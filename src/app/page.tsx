import { Button } from '@/components/ui/button';
import { PawPrint } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <PawPrint className="w-24 h-24 text-primary mb-4" />
      <h1 className="text-4xl font-bold font-headline mb-2">
        Welcome to Feline & Friend
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        This is the customer-facing part of the application. The implemented
        feature is for admins.
      </p>
      <Link href="/admin">
        <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Go to Admin Dashboard</Button>
      </Link>
    </div>
  );
}
