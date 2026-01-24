import {
  PawPrint,
  Package,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <Link
    href={href}
    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
  >
    {children}
  </Link>
);

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-semibold font-headline"
            >
              <PawPrint className="h-6 w-6 text-primary" />
              <span className="">Feline & Friend</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLink href="/admin/products">
                <Package className="h-4 w-4" />
                Products
              </NavLink>
               <NavLink href="/admin/settings">
                <Settings className="h-4 w-4" />
                Site Settings
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PawPrint className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <PawPrint className="h-6 w-6 text-primary" />
                  <span className="sr-only">Feline & Friend</span>
                </Link>
                <NavLink href="/admin/products">
                  <Package className="h-5 w-5" />
                  Products
                </NavLink>
                 <NavLink href="/admin/settings">
                  <Settings className="h-5 w-5" />
                  Site Settings
                </NavLink>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1">
            {/* Can add search form here */}
          </div>
          {/* User dropdown menu */}
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
