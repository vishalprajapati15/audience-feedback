import { HF_CONFIG, getHFHeaders } from "../config/hf.config";
import { Analysis } from "@/types/analysis.types";


const MAX_CHARS = 1200;   
const BATCH_SIZE = 10;
const UNKNOWN_ANALYSIS: Analysis = { label: "unknown", score: 0 };

type HFLabelScore = {
  label: string;
  score: number;
};

type HFErrorResponse = {
  error?: string;
  estimated_time?: number;
};

// 🔹 truncate helper
const truncate = (text: string): string =>
  typeof text === "string" ? text.slice(0, MAX_CHARS) : "";

const isHFLabelScore = (value: unknown): value is HFLabelScore => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.label === "string" && typeof candidate.score === "number";
};

const normalizeAnalysis = (result: HFLabelScore | null): Analysis => {
  if (!result) return UNKNOWN_ANALYSIS;
  return {
    label: result.label.toLowerCase(),
    score: result.score
  };
};

// 🔹 batch processor (generic)
async function runInBatches(
  model: string,
  texts: string[]
): Promise<unknown[]> {
  if (!HF_CONFIG.API_KEY) {
    throw new Error("HUGGING_FACE_TOKEN is missing");
  }

  const results: unknown[] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE).map(truncate);

    const response = await fetch(
      `${HF_CONFIG.API_URL}/${model}`,
      {
        method: "POST",
        headers: getHFHeaders(),
        body: JSON.stringify({ inputs: batch })
      }
    );

    const data = (await response.json()) as unknown;

    if (!response.ok) {
      const errorPayload = data as HFErrorResponse;
      throw new Error(errorPayload?.error || `HF request failed with status ${response.status}`);
    }

    if (Array.isArray(data)) {
      results.push(...data);
    } else {
      results.push(data);
    }

    // ⏳ small delay (avoid rate limit)
    await new Promise((res) => setTimeout(res, 300));
  }

  return results;
}

// 🔹 Sentiment (array input)
export async function analyzeSentiments(
  texts: string[]
): Promise<Analysis[]> {
  try {
    const data = await runInBatches(
      HF_CONFIG.MODELS.SENTIMENT,
      texts
    );

    return data.map((item) => {
      if (!Array.isArray(item)) return UNKNOWN_ANALYSIS;
      const result = item[0];

      return normalizeAnalysis(isHFLabelScore(result) ? result : null);
    });

  } catch (error: unknown) {
    console.error("Sentiment Batch Error:", error);

    return texts.map(() => UNKNOWN_ANALYSIS);
  }
}

// 🔹 Emotion (array input)
export async function analyzeEmotions(
  texts: string[]
): Promise<Analysis[]> {
  try {
    const data = await runInBatches(
      HF_CONFIG.MODELS.EMOTION,
      texts
    );

    return data.map((predictions) => {
      if (!Array.isArray(predictions)) {
        return UNKNOWN_ANALYSIS;
      }

      const validPredictions = predictions.filter(isHFLabelScore);
      if (validPredictions.length === 0) return UNKNOWN_ANALYSIS;

      const top = validPredictions.reduce((a, b) => (b.score > a.score ? b : a));

      return normalizeAnalysis(top);
    });

  } catch (error: unknown) {
    console.error("Emotion Batch Error:", error);

    return texts.map(() => UNKNOWN_ANALYSIS);
  }
}


export async function analyzeFeedbackBatch(
  texts: string[]
): Promise<{ sentiment: Analysis; emotion: Analysis }[]> {
  try {
    if (!texts || texts.length === 0) {
      throw new Error("No texts provided");
    }

    // 🚀 Run both models in parallel
    const [sentiments, emotions] = await Promise.all([
      analyzeSentiments(texts),
      analyzeEmotions(texts)
    ]);

    // 🔗 Combine results
    return texts.map((_, i) => ({
      sentiment: sentiments[i],
      emotion: emotions[i]
    }));

  } catch (error) {
    console.error("Batch Analysis Error:", error);

    return texts.map(() => ({
      sentiment: UNKNOWN_ANALYSIS,
      emotion: UNKNOWN_ANALYSIS
    }));
  }
}