import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getArtworkById, getUserByUsername } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ArtworkPageProps = {
  params: {
    id: string;
  };
};

export default function ArtworkPage({ params }: ArtworkPageProps) {
  const { id } = params;
  const artwork = getArtworkById(id);

  if (!artwork) {
    notFound();
  }

  const artist = getUserByUsername(artwork.authorUsername);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/explore">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Artworks
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden shadow-lg">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-contain"
                data-ai-hint={artwork.imageHint}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
              />
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl md:text-4xl">{artwork.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{artwork.description}</p>
            </CardContent>
          </Card>

          {artist && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-headline">About the Artist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/50">
                    <AvatarImage src={artist.avatarUrl} alt={artist.username} />
                    <AvatarFallback className="text-2xl">{artist.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{artist.username}</h3>
                    <p className="text-sm text-muted-foreground">{artist.email}</p>
                  </div>
                </div>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href={`/profile/${artist.username}`}>
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
