import { ProductForm } from '@/components/admin/product-form';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Mock function to get product data. In real app, this would be a Firestore call.
async function getProduct(id: string): Promise<Product | null> {
  if (id === 'new') {
    return null;
  }

  const mockProduct: Product = {
    id: id,
    name: 'Fluffy Persian Cat',
    description:
      'A very fluffy and adorable Persian cat, great with families and other pets. Loves to cuddle and play with feather toys. Comes with all initial vaccinations.',
    category: 'persian',
    price: 1200,
    stockQuantity: 5,
    mainImageUrl:
      PlaceHolderImages.find((p) => p.id === 'persian-cat-1')?.imageUrl || '',
    galleryImageUrls: [],
    currency: 'USD',
    isFeatured: true,
    ratingAverage: 4.8,
    ratingCount: 25,
    type: 'cat',
    // In a real app these would be Firestore Timestamps
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  };

  if (id === 'prod1') return mockProduct;
  return null;
}

export default async function ProductEditPage({
  params,
}: {
  params: { productId: string };
}) {
  const product = await getProduct(params.productId);
  const pageTitle = product
    ? `Edit Product: ${product.name}`
    : 'Create New Product';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm product={product} />
      </CardContent>
    </Card>
  );
}
