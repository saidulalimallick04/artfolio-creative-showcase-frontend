import ImageMosaic from '@/components/image-mosaic';
import { getArtworks } from '@/lib/mock-data';

export default function Home() {
  const artworks = getArtworks();
  // Get a random selection of artworks for the landing page
  const randomArtworks = artworks.sort(() => 0.5 - Math.random()).slice(0, 16);

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
      
      <ImageMosaic artworks={randomArtworks} />
    </div>
  );
}
