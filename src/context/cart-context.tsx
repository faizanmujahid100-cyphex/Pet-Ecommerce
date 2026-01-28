'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number;
  mainImageUrl: string;
  quantity: number;
  stockQuantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stockQuantity) {
            toast({
                variant: 'destructive',
                title: 'Not enough stock',
                description: `Only ${product.stockQuantity} items available for ${product.name}.`,
            });
            return prevItems;
        }
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        if (quantity > product.stockQuantity) {
            toast({
                variant: 'destructive',
                title: 'Not enough stock',
                description: `Only ${product.stockQuantity} items available for ${product.name}.`,
            });
            return prevItems;
        }
        return [...prevItems, { 
            id: product.id,
            name: product.name,
            price: product.price,
            mainImageUrl: product.mainImageUrl,
            quantity,
            stockQuantity: product.stockQuantity,
        }];
      }
    });
    toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast({
        title: 'Item removed',
        description: `Item has been removed from your cart.`,
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        return prevItems.filter(item => item.id !== productId);
      }
      return prevItems.map(item => {
        if (item.id === productId) {
          if (newQuantity > item.stockQuantity) {
            toast({
                variant: 'destructive',
                title: 'Not enough stock',
                description: `Only ${item.stockQuantity} items available.`,
            });
            return { ...item, quantity: item.stockQuantity };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
