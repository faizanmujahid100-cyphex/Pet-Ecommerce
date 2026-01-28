'use client';
import { use, useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useFirestore } from '@/firebase/provider';
import type { Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Package } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function OrderConfirmationSkeleton() {
  return (
    <div className="container py-12 max-w-2xl mx-auto">
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
        <div className="mt-8 border rounded-lg p-6">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <div className="space-y-4">
                <div className="flex gap-4 items-center">
                    <Skeleton className="h-20 w-20 rounded-md" />
                    <div className="flex-grow space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-5 w-1/4" />
                </div>
                 <div className="flex gap-4 items-center">
                    <Skeleton className="h-20 w-20 rounded-md" />
                    <div className="flex-grow space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-5 w-1/4" />
                </div>
            </div>
            <Separator className="my-6" />
            <Skeleton className="h-12 w-full" />
             <Separator className="my-6" />
            <Skeleton className="h-24 w-full" />
        </div>
    </div>
  )
}

export default function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  const resolvedParams = use(params);
  const firestore = useFirestore();

  const orderRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'orders', resolvedParams.orderId);
  }, [firestore, resolvedParams.orderId]);

  const { data: order, loading, error } = useDoc<Order>(orderRef);

  if (loading) {
    return <OrderConfirmationSkeleton />;
  }

  if (error || !order) {
    return (
         <div className="container py-12">
            <Alert variant="destructive">
                <AlertTitle>Error Loading Order</AlertTitle>
                <AlertDescription>
                    {error?.message || "The order you are looking for could not be found."}
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  return (
    <div className="container py-12 max-w-3xl mx-auto">
        <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="mt-4 text-3xl font-bold font-headline">Thank you for your order!</h1>
            <p className="mt-2 text-muted-foreground">
                Your order has been placed successfully. Order ID: #{order.id.substring(0, 7)}
            </p>
        </div>

        <div className="mt-8 border rounded-lg p-6 bg-muted/20">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <Package className="h-6 w-6" />
                Order Summary
            </h2>
            <Separator className="my-4" />
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.productId} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                    <Image src={item.mainImageUrl} alt={item.productName} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">PKR {(item.unitPrice * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
             <div className="space-y-2">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>PKR {order.totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>PKR {order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
             <Separator className="my-4" />
             <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold mb-2">Shipping To</h3>
                    <div className="text-sm text-muted-foreground">
                        <p>{order.deliveryInfo.name}</p>
                        <p>{order.deliveryInfo.addressLine1}</p>
                        {order.deliveryInfo.addressLine2 && <p>{order.deliveryInfo.addressLine2}</p>}
                        <p>{order.deliveryInfo.city}, {order.deliveryInfo.postalCode}</p>
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Contact</h3>
                    <div className="text-sm text-muted-foreground">
                        <p>{order.deliveryInfo.email}</p>
                        <p>{order.deliveryInfo.phone}</p>
                    </div>
                </div>
             </div>
        </div>
        <div className="mt-8 text-center">
            <Button asChild>
                <Link href="/shop">Continue Shopping</Link>
            </Button>
        </div>
    </div>
  );
}
