"use client"
import axios, { AxiosError } from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';
import { useParams } from "next/navigation"
import { messageSchema } from "@/schemas/messageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

const specialChar = '||';

const parseStringMessage = (messageString: string): string[] => {
  return messageString.split(specialChar);
}

const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";



const UserProfilePage = () => {

  const params = useParams<{ username: string }>();
  const username = params.username;

  const [suggestedMessages, setSuggestedMessages] = useState<string>(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [isUserAcceptingMessages, setIsUserAcceptingMessages] = useState<boolean>(true);
  const [isCheckingAcceptance, setIsCheckingAcceptance] = useState<boolean>(true);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message)
  };

  const [isLoading, setIsLoading] = useState(false);

  const checkUserAcceptanceStatus = async () => {
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-message?username=${username}`);
      setIsUserAcceptingMessages(response.data.isAcceptingMessage ?? true);
    } catch (error) {
      console.error('Error checking acceptance status: ', error);
      setIsUserAcceptingMessages(true);
    }
    finally {
      setIsCheckingAcceptance(false);
    }
  };

  useEffect(() => {
    if (username) {
      checkUserAcceptanceStatus();
    }
  }, [username]);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    if (!isUserAcceptingMessages) {
      toast.error('Currently user is not accepting messages');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username
      });
      toast.message(response.data.message);

      form.reset({ ...form.getValues(), content: '' })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to send message!!');
    }
    finally {
      setIsLoading(false);
    }
  }

  const fetchSuggestedMessage = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.post<{ text: string }>('/api/suggest-messages');
      setSuggestedMessages(response.data.text);
      toast.success('Messages suggested successfully!');
    } catch (error) {
      console.error('Error message suggestion: ', error);
      toast.error('Failed to fetch suggested messages!');
    }
    finally {
      setIsSuggestLoading(false);
    }
  }


  return (
    <div className="mx-4 my-8 md:mx-8 lg:mx-auto max-w-4xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
            Public Profile{username ? ` — @${username}` : ''}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Share anonymous feedback safely and pick a suggested message to send faster.
          </p>
          {!isCheckingAcceptance && !isUserAcceptingMessages && (
            <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-700 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-300">
              This user is currently not accepting messages.
            </p>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40 md:p-5">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800 dark:text-slate-200">
                      Send Anonymous Message to @{username}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here"
                        className="min-h-32 resize-none border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled className="w-full sm:w-auto">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !messageContent}
                  className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Send Message
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="my-8 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40 md:p-5">
          <div className="space-y-2">
            <Button
              onClick={fetchSuggestedMessage}
              className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              disabled={isSuggestLoading}
            >
              {isSuggestLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suggesting...
                </>
              ) : (
                "Suggest Messages"
              )}
            </Button>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Click any message below to use it in the input.
            </p>
          </div>

          <Card className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <CardHeader>
              <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Messages</h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {isSuggestLoading ? (
                <p className="text-sm text-slate-600 dark:text-slate-300">Loading suggestions...</p>
              ) : (
                parseStringMessage(suggestedMessages || '').map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6 bg-slate-200 dark:bg-slate-700" />
        <div className="text-center">
          <div className="mb-4 text-slate-700 dark:text-slate-200">Get Your Message Board</div>
          <Link href={'/sign-up'}>
            <Button className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage