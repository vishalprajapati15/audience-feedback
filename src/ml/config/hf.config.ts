export const HF_CONFIG = {
  API_URL: "https://api-inference.huggingface.co/models",
  API_KEY: process.env.HUGGING_FACE_TOKEN || "",

  MODELS: {
    SENTIMENT: "distilbert-base-uncased-finetuned-sst-2-english",
    EMOTION: "j-hartmann/emotion-english-distilroberta-base"
  }
};

// Common headers for all requests
export const getHFHeaders = () => ({
  Authorization: `Bearer ${HF_CONFIG.API_KEY}`,
  "Content-Type": "application/json"
});