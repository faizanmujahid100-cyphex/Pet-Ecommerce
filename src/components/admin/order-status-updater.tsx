'use client';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type OrderStatus = Order['status'];
const statuses: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export function OrderStatusUpdater({ order }: { order: Order }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Database not connected.' });
      return;
    }

    try {
      const orderRef = doc(firestore, 'orders', order.id);
      await setDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast({
        title: 'Status Updated',
        description: `Order #${order.id.substring(0, 7)} is now ${newStatus}.`
      });
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Could not update order status.'
      });
    }
  };

  return (
    <Select onValueChange={handleStatusChange} defaultValue={order.status}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Change status..." />
      </SelectTrigger>
      <SelectContent>
        {statuses.map(status => (
          <SelectItem key={status} value={status} className="capitalize">
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
