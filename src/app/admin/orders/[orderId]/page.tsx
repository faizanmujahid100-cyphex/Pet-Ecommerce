'use client';
import { use, useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useFirestore } from '@/firebase/provider';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { OrderStatusUpdater } from '@/components/admin/order-status-updater';

function OrderDetailSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <div className="lg:col-span-2 grid auto-rows-max gap-4">
                <Card>
                    <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                    <CardContent><Skeleton className="h-24 w-full" /></CardContent>
                </Card>
                <Card>
                    <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                    <CardContent><Skeleton className="h-32 w-full" /></CardContent>
                </Card>
             </div>
             <div className="grid auto-rows-max gap-4">
                <Card>
                    <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
                    <CardContent><Skeleton className="h-16 w-full" /></CardContent>
                </Card>
                 <Card>
                    <CardHeader><Skeleton className="h-8 w-2/3" /></CardHeader>
                    <CardContent><Skeleton className="h-20 w-full" /></CardContent>
                </Card>
             </div>
        </div>
    )
}

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const resolvedParams = use(params);
  const firestore = useFirestore();

  const orderRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'orders', resolvedParams.orderId);
  }, [firestore, resolvedParams.orderId]);

  const { data: order, loading, error } = useDoc<Order>(orderRef);

  if (loading) {
    return <OrderDetailSkeleton />;
  }

  if (error || !order) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error Loading Order</AlertTitle>
        <AlertDescription>
          {error?.message || "The order you are looking for could not be found."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2 grid auto-rows-max gap-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle>Order #{order.id.substring(0, 7)}</CardTitle>
                    <CardDescription>
                       Placed on {order.createdAt ? format(order.createdAt.toDate(), 'PPP') : 'N/A'}
                    </CardDescription>
                </div>
                <OrderStatusUpdater order={order} />
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.items.map(item => (
                            <TableRow key={item.productId}>
                                <TableCell>
                                    <Image src={item.mainImageUrl} alt={item.productName} width={64} height={64} className="rounded-md object-cover aspect-square" />
                                </TableCell>
                                <TableCell className="font-medium">{item.productName}</TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                <TableCell className="text-right">PKR {item.unitPrice.toFixed(2)}</TableCell>
                                <TableCell className="text-right">PKR {item.subtotal.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
            </CardContent>
            <CardFooter className="flex flex-col items-end gap-2 bg-muted/50 p-4">
                <div className="flex justify-between w-full max-w-xs">
                    <span>Subtotal</span>
                    <span>PKR {order.totalAmount.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between w-full max-w-xs text-muted-foreground">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <Separator className="my-2 max-w-xs" />
                <div className="flex justify-between w-full max-w-xs font-semibold text-lg">
                    <span>Total</span>
                    <span>PKR {order.totalAmount.toFixed(2)}</span>
                </div>
            </CardFooter>
        </Card>
      </div>

      <div className="grid auto-rows-max gap-4">
        <Card>
            <CardHeader>
                <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
                <p className="font-medium">{order.deliveryInfo.name}</p>
                <p className="text-muted-foreground">{order.deliveryInfo.email}</p>
                <p className="text-muted-foreground">{order.deliveryInfo.phone}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                <p>{order.deliveryInfo.addressLine1}</p>
                {order.deliveryInfo.addressLine2 && <p>{order.deliveryInfo.addressLine2}</p>}
                <p>{order.deliveryInfo.city}, {order.deliveryInfo.postalCode}</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
