'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';

/**
 * Redirects the user to the account page if they are already logged in.
 * To be used on pages like Login and Signup.
 */
export function useAuthRedirect() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/account');
    }
  }, [user, loading, router]);
}
