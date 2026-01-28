'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { collection, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase/provider';
import type { Order } from '@/lib/types';

import {
  Card,
  CardContent,
  CardDescription,
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
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

function OrderRowSkeleton() {
    return (
        <TableRow>
            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></TableCell>
        </TableRow>
    )
}

export default function OrdersPage() {
  const firestore = useFirestore();

  const ordersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: orders, loading } = useCollection<Order>(ordersQuery);

  const getStatusVariant = (status: Order['status']) => {
    switch(status) {
        case 'pending': return 'default';
        case 'confirmed': return 'secondary';
        case 'shipped': return 'secondary';
        case 'delivered': return 'secondary';
        case 'cancelled': return 'destructive';
        default: return 'outline';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>A list of all the orders placed in your store.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
                <>
                    <OrderRowSkeleton />
                    <OrderRowSkeleton />
                    <OrderRowSkeleton />
                    <OrderRowSkeleton />
                    <OrderRowSkeleton />
                </>
            )}
            {orders && orders.map(order => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">{order.deliveryInfo.name}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {order.deliveryInfo.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)} className="capitalize">{order.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {order.createdAt ? format(order.createdAt.toDate(), 'PPP') : 'N/A'}
                </TableCell>
                <TableCell className="text-right">PKR {order.totalAmount.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/orders/${order.id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                            <span className="sr-only">View Order</span>
                        </Link>
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!loading && (!orders || orders.length === 0) && (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold">No orders yet</h2>
                <p className="text-muted-foreground mt-2">When a customer places an order, it will appear here.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
