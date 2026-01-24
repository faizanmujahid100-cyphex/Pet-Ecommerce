import Link from 'next/link';
import {
  Cat,
  Fish,
  ToyBrick,
  Bed,
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const categories = [
  { name: 'Cats', href: '/shop?category=cats', icon: Cat },
  { name: 'Food', href: '/shop?category=food', icon: Fish },
  { name: 'Toys', href: '/shop?category=toys', icon: ToyBrick },
  { name: 'Accessories', href: '/shop?category=accessories', icon: Bed },
];

export function CategoryLinks() {
  return (
    <section className="py-12 md:py-16 bg-muted/40">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {categories.map((category) => (
            <Link href={category.href} key={category.name}>
              <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center h-full">
                <CardContent className="p-2 flex flex-col items-center gap-2">
                  <category.icon className="w-10 h-10 text-primary" />
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
