import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProductCard } from '@/components/product-card';
import { Button } from '../ui/button';

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
];

export function ProductGrid() {
  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center font-headline mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/shop">
            <Button size="lg">Shop All</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
