'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase/provider';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function ProductSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                <Skeleton className="w-full h-48" />
            </CardHeader>
            <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardContent>
        </Card>
    )
}

export default function ProductsPage() {
  const firestore = useFirestore();

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), orderBy('name', 'asc'));
  }, [firestore]);

  const { data: products, loading } = useCollection<Product>(productsQuery);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Products</h1>
        <Link href="/admin/products/new">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && (
          <>
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </>
        )}
        {!loading && products && products.map((product) => (
          <Link href={`/admin/products/${product.id}`} key={product.id}>
            <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
              <CardHeader className="p-0">
                <Image
                  src={
                    product.mainImageUrl || 'https://picsum.photos/seed/placeholder/600/400'
                  }
                  alt={product.name}
                  width={600}
                  height={400}
                  className="object-cover w-full h-48"
                  data-ai-hint={product.name}
                />
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg font-semibold">
                  {product.name}
                </CardTitle>
                <CardDescription className="mt-2">
                  ${product.price} • {product.stockQuantity} in stock
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {!loading && (!products || products.length === 0) && (
        <div className="text-center py-12">
            <h2 className="text-xl font-semibold">No products yet</h2>
            <p className="text-muted-foreground mt-2">Click "Add Product" to create your first one.</p>
        </div>
      )}
    </div>
  );
}
