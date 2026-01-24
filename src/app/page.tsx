import { HeroSlider } from '@/components/home/hero-slider';
import { ProductGrid } from '@/components/home/product-grid';
import { CategoryLinks } from '@/components/home/category-links';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSlider />
      <CategoryLinks />
      <ProductGrid />
    </div>
  );
}
