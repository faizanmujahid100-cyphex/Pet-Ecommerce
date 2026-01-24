'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, PawPrint } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useUser } from '@/firebase';
import { handleSignOut } from '@/firebase/auth/auth';

const navLinks = [{ href: '/shop', label: 'Shop' }];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, loading } = useUser();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="py-6">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <PawPrint className="h-6 w-6 text-primary" />
              <span className="font-bold">Feline & Friend</span>
            </Link>
            <nav className="flex flex-col space-y-3">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'text-lg font-medium transition-colors hover:text-primary',
                    pathname === href
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t">
              {!loading &&
                (user ? (
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/account"
                      className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      Account
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-left text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/login"
                      className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      Sign Up
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
