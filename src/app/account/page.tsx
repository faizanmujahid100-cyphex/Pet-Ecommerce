'use client';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { handleSignOut } from '@/firebase/auth/auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="container py-12">
            <div className="mx-auto max-w-lg">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-10 w-24 mt-4" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>My Account</CardTitle>
            <CardDescription>
              View and manage your account details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">Display Name</p>
              <p>{user.displayName || 'Not set'}</p>
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p>{user.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
