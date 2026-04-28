'use client'
import { toast } from "sonner"
import { Message } from "@/model/message.model"
import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { User } from "next-auth"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw } from "lucide-react"
import MessageCard from "@/components/MessageCard"
import { useRouter } from "next/navigation"

const page = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const router = useRouter();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId));
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: { acceptMessage: false }
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch('acceptMessage');

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-message');
      setValue('acceptMessage', response.data.isAcceptingMessage ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || 'Failed to fetch message setting!!');
    }
    finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);


  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      console.log('Messages Response:', response.data);
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success('Showing Latest messages!!');
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      console.error('Error fetching messages:', axiosError);
      toast.error(axiosError.response?.data.message || 'Failed to fetch message setting!!');
    }
    finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages]);

  useEffect(() => {
    if (session === null) {
      router.push('/sign-in');
    }
  }, [session, router]);

  useEffect(() => {
    if (!session || !session.user) {
      return
    }
    fetchMessages();
    fetchAcceptMessage();

  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-message', {
        acceptMessage: !acceptMessages
      })
      setValue('acceptMessage', !acceptMessages);
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to fetch message!!');
    }
  }

  if (session === undefined) {
    return <div className="text-center font-semibold text-4xl">
      Loading...
    </div>;
  }

  if (session === null) {
    return null;
  }

  const username = (session?.user as User | undefined)?.username || "";
  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Url Copied successfully!!");
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto max-w-6xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
            User Dashboard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Manage your public feedback link, message preferences, and incoming audience messages.
          </p>
        </div>

        <div className="space-y-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40 md:p-5">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Copy Your Unique Link
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Share this link so users can send you anonymous feedback.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 opacity-100 shadow-sm focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
            <Button
              onClick={copyToClipboard}
              className="sm:w-auto w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Copy
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40 md:flex-row md:items-center md:justify-between md:p-5">
          <div className="flex items-center gap-3">
            <Switch
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Accept Messages: {acceptMessages ? 'On' : 'Off'}
            </span>
          </div>

          <Button
            className="w-full md:w-auto border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2 h-4 w-4" />
            )}
            Refresh Messages
          </Button>
        </div>

        <Separator className="my-8 bg-slate-200 dark:bg-slate-700" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
              No messages to display yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default page