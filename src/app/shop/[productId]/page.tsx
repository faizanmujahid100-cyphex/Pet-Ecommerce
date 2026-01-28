'use client';

import Image from 'next/image';
import { useMemo, use } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useFirestore } from '@/firebase/provider';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/cart-context';
import { ShoppingCart, Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function ProductPageSkeleton() {
  return (
    <div className="container py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-5 gap-2 mt-2">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-48" />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ params }: { params: { productId: string } }) {
  const resolvedParams = use(params);
  const firestore = useFirestore();
  const { addToCart } = useCart();

  const productRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'products', resolvedParams.productId);
  }, [firestore, resolvedParams.productId]);

  const { data: product, loading, error } = useDoc<Product>(productRef);

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (error) {
    return (
         <div className="container py-12">
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Could not load product data. Please try again later.
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-muted-foreground">The product you are looking for does not exist.</p>
      </div>
    );
  }
  
  const galleryImages = [product.mainImageUrl, ...(product.galleryImageUrls || [])];

  return (
    <div className="container py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
            <Carousel className="w-full">
                <CarouselContent>
                    {galleryImages.map((url, index) => (
                        <CarouselItem key={index}>
                            <div className="aspect-square relative">
                                <Image
                                    src={url}
                                    alt={`${product.name} image ${index + 1}`}
                                    fill
                                    className="object-cover rounded-lg border"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {galleryImages.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </>
                )}
            </Carousel>
        </div>
        
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold font-headline">{product.name}</h1>

          <div className="flex items-center gap-4">
            <p className="text-3xl font-bold">PKR {product.price}</p>
            {product.ratingCount > 0 && (
                <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{product.ratingAverage.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({product.ratingCount} ratings)</span>
                </div>
            )}
          </div>
          
          <Separator />

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          
          <div className="pt-4">
            <Button size="lg" onClick={() => addToCart(product)} disabled={product.stockQuantity === 0}>
              <ShoppingCart className="mr-2 h-5 w-5" /> 
              {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {product.stockQuantity > 5 && <span className="text-green-600">In stock</span>}
            {product.stockQuantity <= 5 && product.stockQuantity > 0 && <span className="text-yellow-600">Low stock ({product.stockQuantity} remaining)</span>}
            {product.stockQuantity === 0 && <span className="text-red-600">Out of stock</span>}
          </p>

        </div>
      </div>
    </div>
  );
}
