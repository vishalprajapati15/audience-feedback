'use client'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'


const Navbar = () => {

    const { data: session } = useSession();

    const user: User = session?.user as User

    return (
        <nav className='p-4 md:p-6 shadow-md bg-white dark:bg-slate-900 transition-colors duration-200'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <Link href="/" className='flex items-center gap-2 group cursor-pointer'>
                    <div className='p-2 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg group-hover:shadow-lg transition-all duration-300'>
                        <Zap className='w-5 h-5 text-white' />
                    </div>
                    <span className='text-2xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                        InsightLoop
                    </span>
                </Link>
                <div className='flex items-center gap-4'>
                    <ThemeToggle />
                    {
                        session ? (
                            <>
                                <span className='mr-4 '>Welcome , {user?.username || user?.email}</span>
                                <Button className='w-full md:w-auto' onClick={() => signOut()}>Logout</Button>
                            </>
                        ) : (
                            <Button className='w-full md:w-auto' asChild>
                                <Link href='/sign-in'>Login</Link>
                            </Button>
                        )
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navbar