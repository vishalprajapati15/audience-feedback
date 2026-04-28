'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/message.model"
import { toast } from "sonner"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
  message:Message;
  onMessageDelete: (messageId: string)=> void
}



const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {

  const handleDeleteConfirm = async ()=>{
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id?.toString()}`);
    toast.success(response.data.message);
    onMessageDelete(message._id?.toString() || '')
  }

  return (
    <Card className="w-full border rounded-lg shadow-sm overflow-hidden">
      <CardHeader className="p-4 md:p-6">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium line-clamp-2">{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm"><X className="w-4 h-4"/></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this
                  message from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-black">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <CardDescription className="text-sm text-gray-500">
          {new Date(message.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
      </CardContent>
    </Card>
  )
}

export default MessageCard