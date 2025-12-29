import { getArtworks } from '@/actions/artworks_action';
import PlaceholderMosaic from '@/components/placeholder-mosaic';
import HeroSection from '@/components/home/hero-section';
import placeholderData from '@/lib/placeholder-images.json';

export default async function Home() {
  const result = await getArtworks();
  // We ignore API artworks for the home page as requested to show placeholders
  // Or do we show both? USER said "show the already declared image links... Only in the home page."
  // Usually this means REPLACING the current view or adding to it. 
  // Given "Only in the home page", I'll prioritize the placeholders.

  const placeholders = placeholderData.placeholderImages;

  // Randomize placeholders for variety on refresh
  const randomPlaceholders = placeholders.sort(() => 0.5 - Math.random()).slice(0, 20);

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />

      <div className="mt-20 mb-12 text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight mb-4">Featured Collection</h2>
        <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
      </div>

      <PlaceholderMosaic images={randomPlaceholders} />
    </div>
  );
}
