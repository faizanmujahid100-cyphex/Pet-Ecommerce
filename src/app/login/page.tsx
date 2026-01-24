'use client';
import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';
import { PawPrint } from 'lucide-react';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';

export default function LoginPage() {
  useAuthRedirect();

  return (
    <div className="container relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1574158622682-e40e69841006?q=80&w=2080&auto=format&fit=crop)',
          }}
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <PawPrint className="mr-2 h-6 w-6" />
          Feline & Friend
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;The perfect place to find your new best friend or get the
              best products for them.&rdquo;
            </p>
            <footer className="text-sm">A Happy Customer</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to sign in to your account
            </p>
          </div>
          <AuthForm mode="login" />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
