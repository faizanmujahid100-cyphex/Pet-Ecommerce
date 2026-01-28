'use client';

import { ProductForm } from '@/components/admin/product-form';
import type { Product } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useMemo, use } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductEditPage({
  params,
}: {
  params: { productId: string };
}) {
  const resolvedParams = use(params);
  const firestore = useFirestore();

  const isNew = resolvedParams.productId === 'new';

  const productRef = useMemo(() => {
    if (!firestore || isNew) return null;
    return doc(firestore, 'products', resolvedParams.productId);
  }, [firestore, resolvedParams.productId, isNew]);

  const { data: product, loading } = useDoc<Product>(productRef);

  if (loading && !isNew) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!product && !isNew) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The product you are looking for does not exist.</p>
        </CardContent>
      </Card>
    );
  }

  const pageTitle = product
    ? `Edit Product: ${product.name}`
    : 'Create New Product';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm product={product || null} />
      </CardContent>
    </Card>
  );
}
