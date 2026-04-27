'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react'


const page = () => {

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();

  //zod

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username!!")
        }
        finally {
          setIsCheckingUsername(false);
        }
      }
    }

    checkUsername();
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast.success(response.data.message)

      router.replace(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error in sign of user: ', error);
      const axiosError = error as AxiosError<ApiResponse>;

      let errorMessage = axiosError.response?.data.message;

      toast("Error", {
        description: errorMessage,
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950'>
      <div className='w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8'>
        <div className='mb-8 space-y-2 text-center'>
          <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl'>Join InsightLoop</h1>
          <p className='text-sm text-slate-600 dark:text-slate-300'>Sign up to start your anonymous feedback journey.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-slate-800 dark:text-slate-200'>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='username'
                      className='border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400'
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className='h-4 w-4 animate-spin text-slate-500 dark:text-slate-300' />}
                  <p className={`text-sm ${usernameMessage === "Username is available!!" ? "text-green-500" : "text-red-500"}`}>
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-slate-800 dark:text-slate-200'>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email"
                      className='border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-slate-800 dark:text-slate-200'>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="password"
                      className='border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className='w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Submitting
                </>
              ) : ("Sign Up")}
            </Button>
          </form>
        </Form>

        <div className='mt-6 text-center text-sm text-slate-600 dark:text-slate-300'>
          <p>
            Already a member? {' '}
            <Link href="/sign-in" className='font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default page