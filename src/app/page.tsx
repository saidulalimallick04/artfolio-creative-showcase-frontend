import { getArtworks } from '@/actions/artworks_action';
import PlaceholderMosaic from '@/components/placeholder-mosaic';
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
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Welcome to ArtFolio
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover a world of creativity. A place for artists to share their digital memories and artwork with the world.
        </p>
      </header>

      <PlaceholderMosaic images={randomPlaceholders} />
    </div>
  );
}
