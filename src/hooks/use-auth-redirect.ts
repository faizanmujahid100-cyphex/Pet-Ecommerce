'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useAdmin } from './use-admin';

/**
 * Redirects the user to the account page or admin page if they are already logged in.
 * To be used on pages like Login and Signup.
 */
export function useAuthRedirect() {
  const { user, loading: userLoading } = useUser();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    const loading = userLoading || adminLoading;
    if (!loading && user) {
        if (isAdmin) {
            router.push('/admin');
        } else {
            router.push('/account');
        }
    }
  }, [user, userLoading, isAdmin, adminLoading, router]);
}
