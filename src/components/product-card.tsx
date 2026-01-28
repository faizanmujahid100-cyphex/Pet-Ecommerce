'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';


export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col group">
      <Link href={`/shop/${product.id}`} className="flex flex-col h-full">
        <CardHeader className="p-0">
          <div className="aspect-square relative w-full overflow-hidden">
            <Image
              src={
                product.mainImageUrl || 'https://picsum.photos/seed/placeholder/400/400'
              }
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.name}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <h3 className="text-base font-semibold">{product.name}</h3>
          <p className="mt-1 text-lg font-bold">${product.price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              console.log(`Added ${product.name} to cart`);
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
