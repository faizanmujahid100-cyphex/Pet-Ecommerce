'use client';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const sliderImages = [
  {
    src: 'https://picsum.photos/seed/cat-hero/1600/600',
    alt: 'A majestic cat',
    dataAiHint: 'majestic cat',
  },
  {
    src: 'https://picsum.photos/seed/kitten-play/1600/600',
    alt: 'A playful kitten',
    dataAiHint: 'playful kitten',
  },
  {
    src: 'https://picsum.photos/seed/cat-products/1600/600',
    alt: 'A collection of cat products',
    dataAiHint: 'cat products',
  },
];

export function HeroSlider() {
  return (
    <div className="w-full relative">
      <Carousel
        className="w-full"
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {sliderImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="h-[30vh] md:h-[50vh] lg:h-[calc(100vh-4rem)] w-full relative">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  data-ai-hint={image.dataAiHint}
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex" />
      </Carousel>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white p-4 bg-black/40 rounded-lg">
          <h1 className="text-3xl md:text-5xl font-bold font-headline">
            For the Love of Felines
          </h1>
          <p className="mt-2 text-lg md:text-xl">
            Premium cats and products for your furry friend.
          </p>
        </div>
      </div>
    </div>
  );
}
