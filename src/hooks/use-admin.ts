'use client';

import { useUser } from '@/firebase';
import { useEffect, useState } from 'react';

// IMPORTANT: This is not a secure way to implement admin checks.
// In a production app, you should use Firebase custom claims.
// This is for demonstration purposes only.
const ADMIN_EMAIL = 'cat840695@gmail.com';

export function useAdmin() {
  const { user, loading: userLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // In a real app, this would be:
    // user.getIdTokenResult().then((idTokenResult) => {
    //   setIsAdmin(!!idTokenResult.claims.admin);
    //   setLoading(false);
    // });
    
    setIsAdmin(user.email === ADMIN_EMAIL);
    setLoading(false);

  }, [user, userLoading]);

  return { isAdmin, loading };
}
