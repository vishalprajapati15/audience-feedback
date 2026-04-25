'use client'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'


const Navbar = () => {

    const { data: session } = useSession();

    const user: User = session?.user as User

    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <Link href="/" className='flex items-center gap-2 group'>
                    <div className='p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg group-hover:shadow-lg transition-all duration-300'>
                        <Zap className='w-5 h-5 text-white' />
                    </div>
                    <span className='text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                        InsightLoop
                    </span>
                </Link>
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
        </nav>
    )
}

export default Navbar