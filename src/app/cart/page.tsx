'use client';

import { useCart } from '@/context/cart-context';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
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

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">Your Cart</h1>
      <div className="grid md:grid-cols-[2fr_1fr] gap-8">
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
              <Image
                src={item.mainImageUrl}
                alt={item.name}
                width={100}
                height={100}
                className="rounded-md object-cover aspect-square"
              />
              <div className="flex-grow">
                <Link href={`/shop/${item.id}`}>
                  <h2 className="font-semibold hover:underline">{item.name}</h2>
                </Link>
                <p className="text-muted-foreground text-sm">PKR {item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                            const newQuantity = parseInt(e.target.value, 10);
                            if (!isNaN(newQuantity) && newQuantity > 0) {
                                updateQuantity(item.id, newQuantity);
                            }
                        }}
                        className="w-16 h-8 text-center"
                    />
                     <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">PKR {(item.price * item.quantity).toFixed(2)}</p>
                <Button variant="ghost" size="icon" className="mt-2 text-muted-foreground" onClick={() => removeFromCart(item.id)}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="p-6 border rounded-lg bg-muted/30">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between">
              <p>Subtotal ({cartCount} items)</p>
              <p>PKR {cartTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <p>Shipping</p>
              <p>Calculated at checkout</p>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold text-lg">
              <p>Total</p>
              <p>PKR {cartTotal.toFixed(2)}</p>
            </div>
            <Button className="w-full mt-6" size="lg" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
