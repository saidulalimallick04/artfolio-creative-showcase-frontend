import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Artwork } from '@/lib/types';

type ImageMosaicProps = {
  artworks: Artwork[];
};

export default function ImageMosaic({ artworks }: ImageMosaicProps) {
  return (
    <div
      className="gap-4 space-y-4 [column-fill:_balance] sm:columns-2 md:columns-3 lg:columns-4"
    >
      {artworks.map((artwork) => (
        <div key={artwork.id} className="break-inside-avoid">
          <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-0">
              <div className="relative overflow-hidden">
                <Link href={`/profile/${artwork.authorUsername}`}>
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    width={500}
                    height={700}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={artwork.imageHint}
                  />
                </Link>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  <h3 className="text-white font-bold truncate">{artwork.title}</h3>
                  <div className="flex items-center mt-2">
                    <Avatar className="h-6 w-6 mr-2 border-2 border-white">
                      <AvatarImage src={`https://picsum.photos/seed/${artwork.authorUsername}/100/100`} />
                      <AvatarFallback>{artwork.authorUsername.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-white text-sm">{artwork.authorUsername}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
