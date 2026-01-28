'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, writeBatch, doc, serverTimestamp, getDoc, DocumentReference } from 'firebase/firestore';
import type { DeliveryInfo, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { CheckoutForm } from '@/components/checkout-form';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect if cart is empty, but not during submission
    if (!isSubmitting && cartItems.length === 0) {
      router.replace('/cart');
    }
  }, [cartItems, router, isSubmitting]);

  const handlePlaceOrder = async (deliveryInfo: DeliveryInfo) => {
    setIsSubmitting(true);
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not connect to the database. Please try again.',
      });
      setIsSubmitting(false);
      return;
    }
    
    // Create a new write batch
    const batch = writeBatch(firestore);

    // 1. Verify stock and prepare product updates
    try {
      for (const item of cartItems) {
        const productRef = doc(firestore, 'products', item.id) as DocumentReference<Product>;
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
          throw new Error(`Product ${item.name} not found.`);
        }

        const currentStock = productSnap.data().stockQuantity;
        if (currentStock < item.quantity) {
          throw new Error(`Not enough stock for ${item.name}. Only ${currentStock} left.`);
        }

        const newStock = currentStock - item.quantity;
        batch.update(productRef, { stockQuantity: newStock });
      }
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Order Failed',
            description: error.message || 'Could not verify product stock. Please try again.',
        });
        setIsSubmitting(false);
        // Optional: redirect to cart to adjust quantities
        router.push('/cart');
        return;
    }


    // 2. Create the order document
    const orderData = {
      userId: user?.uid || null,
      items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: item.price * item.quantity,
          mainImageUrl: item.mainImageUrl,
      })),
      totalAmount: cartTotal,
      currency: 'PKR',
      status: 'pending' as const,
      deliveryInfo,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const ordersRef = collection(firestore, 'orders');
    const newOrderRef = doc(ordersRef);
    batch.set(newOrderRef, orderData);

    // 3. Commit the batch
    try {
      await batch.commit();
      toast({
        title: 'Order Placed!',
        description: 'Thank you for your purchase.',
      });
      clearCart();
      router.replace(`/orders/${newOrderRef.id}`);
    } catch (error: any) {
      console.error("Order placement failed:", error);
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: 'There was an issue placing your order. Please try again.',
      });
      setIsSubmitting(false);
    }
  };
  
  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty.</h1>
        <p className="text-muted-foreground mt-2">Add items to your cart to proceed to checkout.</p>
        <Button asChild className="mt-4">
            <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="md:col-span-1">
          <h1 className="text-2xl font-bold font-headline mb-6">Delivery Information</h1>
          <CheckoutForm user={user} onSubmit={handlePlaceOrder} isSubmitting={isSubmitting} />
        </div>
        <div className="md:col-span-1 order-first md:order-last">
          <h2 className="text-2xl font-bold font-headline mb-6">Your Order</h2>
          <div className="border rounded-lg p-6 bg-muted/20">
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                    <Image src={item.mainImageUrl} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">PKR {item.price.toFixed(2)}</p>
                  </div>
                  <p className="font-semibold">PKR {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <p>Subtotal ({cartCount} items)</p>
                <p>PKR {cartTotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>PKR {cartTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
           <Button variant="link" asChild className="mt-4">
            <Link href="/cart">← Return to Cart</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
