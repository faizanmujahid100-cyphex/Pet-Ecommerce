'use client';
import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';
import { PawPrint } from 'lucide-react';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';

export default function SignupPage() {
  useAuthRedirect();

  return (
    <div className="container relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="lg:p-8 order-2 lg:order-1">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password to create your account
            </p>
          </div>
          <AuthForm mode="signup" />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Log In
            </Link>
          </p>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r order-1 lg:order-2">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=1974&auto=format&fit=crop)',
          }}
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <PawPrint className="mr-2 h-6 w-6" />
          Feline & Friend
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;The purrfect companion awaits. Find your new furry
              family member today.&rdquo;
            </p>
            <footer className="text-sm">The Feline & Friend Team</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
