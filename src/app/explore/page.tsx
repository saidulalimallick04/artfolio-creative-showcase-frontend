import ImageMosaic from '@/components/image-mosaic';
import { getArtworks } from '@/lib/mock-data';

export default function ExplorePage() {
  const artworks = getArtworks();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Explore Artworks
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Browse a vast collection of digital art from talented artists around the globe.
        </p>
      </header>
      
      <ImageMosaic artworks={artworks} />
    </div>
  );
}
