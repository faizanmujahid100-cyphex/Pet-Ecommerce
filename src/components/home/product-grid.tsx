'use client';
import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { Button } from '../ui/button';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function ProductCardSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    )
}

export function ProductGrid() {
  const firestore = useFirestore();

  const featuredProductsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
        collection(firestore, 'products'), 
        where('isFeatured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(8)
    );
  }, [firestore]);

  const { data: products, loading } = useCollection<Product>(featuredProductsQuery);


  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center font-headline mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading && (
            <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
            </>
          )}
          {products && products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {!loading && (!products || products.length === 0) && (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No featured products at the moment.</p>
            </div>
        )}

        <div className="text-center mt-12">
          <Link href="/shop">
            <Button size="lg">Shop All</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
