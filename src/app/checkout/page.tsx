import { Lock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CheckoutPage() {
  return (
    <div className="container py-12 text-center">
      <Lock className="mx-auto h-24 w-24 text-muted-foreground" />
      <h1 className="mt-4 text-3xl font-bold font-headline">
        Checkout is Not Ready
      </h1>
      <p className="mt-2 text-muted-foreground">
        This is a placeholder page for the checkout process. I can build this out for you next!
      </p>
      <Link href="/shop" className="mt-6 inline-block">
        <Button size="lg">Continue Shopping</Button>
      </Link>
    </div>
  );
}
