import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import Navbar from '@/components/layout/navbar';

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-12 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl mx-auto">
          {/* Hero heading */}
          <h1 className="text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Welcome to DevLink
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-10">
            Your one-stop platform for connecting developers and projects.
          </p>

          {/* Call-to-action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {session ? (
              <Link
                href="/dashboard"
                className={buttonVariants({
                  variant: 'default',
                  size: 'lg',
                })}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'lg',
                  })}
                >
                  Get Started — It&apos;s free
                </Link>
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: 'default',
                    size: 'lg',
                  })}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Optional trust line */}
          {session && (
            <p className="mt-8 text-sm text-muted-foreground">
              Welcome back! 👋 Ready to build something great?
            </p>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;