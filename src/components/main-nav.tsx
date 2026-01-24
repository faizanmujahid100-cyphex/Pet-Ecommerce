'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/shop"
        className={cn(
          'text-sm font-medium transition-colors hover:text-primary',
          pathname === '/shop' ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        Shop
      </Link>
    </nav>
  );
}
