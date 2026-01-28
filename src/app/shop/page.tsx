'use client';

import { ProductCard } from '@/components/product-card';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where } from 'firebase/firestore';
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

export default function ShopPage() {
  const firestore = useFirestore();

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    // The query now filters for listed products.
    // Sorting is handled on the client to avoid needing a composite index.
    return query(collection(firestore, 'products'), where('isListed', '==', true));
  }, [firestore]);

  const { data: products, loading } = useCollection<Product>(productsQuery);

  const sortedProducts = useMemo(() => {
    if (!products) return null;
    // Sort products alphabetically by name on the client
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">Shop All Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {loading && (
            <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
            </>
        )}
        {sortedProducts && sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {!loading && (!sortedProducts || sortedProducts.length === 0) && (
        <div className="col-span-full text-center py-12">
            <h2 className="text-xl font-semibold">No products found</h2>
            <p className="text-muted-foreground mt-2">Check back later or try adding some in the admin panel.</p>
        </div>
      )}
    </div>
  );
}
