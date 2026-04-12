import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button'

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

    return (
      <main className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
        <h1 className='text-3xl font-bold' >Welcome to DevLink</h1>
        <p className='text-lg' >Your one-stop platform for connecting developers and projects.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-all hover:scale-105"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "default", size: "lg" })}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
      </main>
    )
  }
export default Home


