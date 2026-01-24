import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  return (
    <div className="container py-12 text-center">
      <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground" />
      <h1 className="mt-4 text-3xl font-bold font-headline">
        Your Cart is Empty
      </h1>
      <p className="mt-2 text-muted-foreground">
        Looks like you haven&apos;t added anything to your cart yet.
      </p>
      <Link href="/shop" className="mt-6 inline-block">
        <Button size="lg">Start Shopping</Button>
      </Link>
    </div>
  );
}
