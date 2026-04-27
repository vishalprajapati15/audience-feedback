'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod'
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react'
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';


const page = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  //zod

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      });

      if (result?.error) {
        toast.error('Login failed. Incorrect username or password!!')
        return;
      }

      if (result?.url) {
        router.replace('/dashboard')
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950'>
      <div className='w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8'>
        <div className='mb-8 space-y-2 text-center'>
          <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl'>
            Sign In to InsightLoop
          </h1>
          <p className='text-sm text-slate-600 dark:text-slate-300'>
            Sign in to continue your anonymous feedback journey.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>

            <FormField
              control={form.control}
              name='identifier'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-slate-800 dark:text-slate-200'>Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email or username"
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
              ) : ("Sign In")}
            </Button>
          </form>
        </Form>

        <div className='mt-6 text-center text-sm text-slate-600 dark:text-slate-300'>
          <p>
            Don't have account {' '}
            <Link href="/sign-up" className='font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default page