'use client'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useState } from 'react'
import { useRouter } from 'next/navigation'


const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/sign-in');
    }

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
                            <div
                                className="relative mr-4 inline-block"
                                onMouseEnter={() => setOpen(true)}
                                onMouseLeave={() => setOpen(false)}
                            >
                                <div className="w-10 h-10 text-xl flex items-center justify-center rounded-full bg-blue-600 text-white font-bold cursor-pointer">
                                    {(user?.username || user?.email || "U")[0].toUpperCase()}
                                </div>

                                <div
                                    className={`absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50 transition-all duration-200 ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
                                >
                                    <Link
                                        href="/dashboard"
                                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        Dashboard
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-800"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
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