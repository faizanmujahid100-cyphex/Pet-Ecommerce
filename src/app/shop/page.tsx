import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProductCard } from '@/components/product-card';

// This is mock data. In a real app, you'd fetch this from Firestore.
const mockProducts = [
  {
    id: 'prod1',
    name: 'Persian Cat',
    image: PlaceHolderImages.find((p) => p.id === 'persian-cat-1')?.imageUrl,
    price: 1200,
    dataAiHint: 'persian cat',
  },
  {
    id: 'prod2',
    name: 'Premium Cat Food',
    image: PlaceHolderImages.find((p) => p.id === 'cat-food-1')?.imageUrl,
    price: 50,
    dataAiHint: 'cat food',
  },
  {
    id: 'prod3',
    name: 'Feather Wand Toy',
    image: PlaceHolderImages.find((p) => p.id === 'cat-toy-1')?.imageUrl,
    price: 15,
    dataAiHint: 'cat toy',
  },
  {
    id: 'prod4',
    name: 'Siamese Cat',
    image: PlaceHolderImages.find((p) => p.id === 'siamese-cat-1')?.imageUrl,
    price: 1000,
    dataAiHint: 'siamese cat',
  },
    {
    id: 'prod5',
    name: 'Enclosed Litter Box',
    image: PlaceHolderImages.find((p) => p.id === 'litter-box-1')?.imageUrl,
    price: 75,
    dataAiHint: 'litter box',
  },
];

export default function ShopPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">Shop All Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
         {mockProducts.map((product) => (
          <ProductCard key={product.id + '2'} product={{...product, id: product.id + '2'}} />
        ))}
         {mockProducts.map((product) => (
          <ProductCard key={product.id + '3'} product={{...product, id: product.id + '3'}} />
        ))}
      </div>
    </div>
  );
}
