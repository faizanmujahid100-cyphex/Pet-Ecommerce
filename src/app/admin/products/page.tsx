import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// This is mock data. In a real app, you'd fetch this from Firestore.
const mockProducts = [
  {
    id: 'prod1',
    name: 'Persian Cat',
    image: PlaceHolderImages.find((p) => p.id === 'persian-cat-1')?.imageUrl,
    price: 1200,
    stock: 5,
    dataAiHint: 'persian cat',
  },
  {
    id: 'prod2',
    name: 'Premium Cat Food',
    image: PlaceHolderImages.find((p) => p.id === 'cat-food-1')?.imageUrl,
    price: 50,
    stock: 100,
    dataAiHint: 'cat food',
  },
  {
    id: 'prod3',
    name: 'Feather Wand Toy',
    image: PlaceHolderImages.find((p) => p.id === 'cat-toy-1')?.imageUrl,
    price: 15,
    stock: 200,
    dataAiHint: 'cat toy',
  },
];

export default function ProductsPage() {
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
        {mockProducts.map((product) => (
          <Link href={`/admin/products/${product.id}`} key={product.id}>
            <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
              <CardHeader className="p-0">
                <Image
                  src={
                    product.image || 'https://picsum.photos/seed/placeholder/600/400'
                  }
                  alt={product.name}
                  width={600}
                  height={400}
                  className="object-cover w-full h-48"
                  data-ai-hint={product.dataAiHint}
                />
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg font-semibold">
                  {product.name}
                </CardTitle>
                <CardDescription className="mt-2">
                  ${product.price} • {product.stock} in stock
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
