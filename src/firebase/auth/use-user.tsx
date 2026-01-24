'use client';

import { useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useFirebase } from '../provider';
import { useRouter, usePathname } from 'next/navigation';

interface UseUser {
  user: User | null;
  loading: boolean;
}

export function useUser(): UseUser {
  const { auth } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // Firebase might not be initialized yet
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}
