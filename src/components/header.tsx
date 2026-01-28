'use client';

import Link from 'next/link';
import { PawPrint, ShoppingCart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { MobileNav } from './mobile-nav';
import { useCart } from '@/context/cart-context';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export default function Header() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  if (pathname.startsWith('/admin')) {
    return null; // Don't render public header in admin section
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <PawPrint className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold">Feline & Friend</span>
          </Link>
          <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center space-x-2">
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link href="/cart">
                <ShoppingCart />
                {cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-xs">{cartCount}</Badge>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            <UserNav />
          </nav>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
