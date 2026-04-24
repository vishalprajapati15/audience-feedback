'use client'
import { toast } from "sonner"
import { Message } from "@/model/user.model"
import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { User } from "next-auth"

const page = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId));
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
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
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success('Showing Latest messages!!');
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || 'Failed to fetch message setting!!');
    }
    finally {
      setIsLoading(true);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages]);

  useEffect(()=>{
    if(!session || !session.user){
      return
    }
    fetchMessages();
    fetchAcceptMessage();

  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async ()=>{
    try {
      const response = await axios.post<ApiResponse>('/api/accept-message', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessage', !acceptMessages);
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to fetch message!!');
    }
  }

  const {username} = session?.user as User

  if(!session || !session.user){
    return 
    <div>
      Please Login!!
    </div>
  }

  return (
    <div>Dashboard Page</div>
  )
}

export default page