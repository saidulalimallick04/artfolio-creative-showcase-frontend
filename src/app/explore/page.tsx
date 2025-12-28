import ArtworkInfiniteScroll from '@/components/artwork-infinite-scroll';
import { getArtworks } from '@/actions/artworks_action';
import PageUtilities from '@/components/page-utilities';

export default async function ExplorePage() {
  const result = await getArtworks();
  const artworks = result.success && result.data ? result.data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageUtilities />
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Explore Artworks
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Browse a vast collection of digital art from talented artists around the globe.
        </p>
      </header>

      <ArtworkInfiniteScroll initialArtworks={artworks} />
    </div>
  );
}
