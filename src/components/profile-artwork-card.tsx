import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Artwork } from '@/types/api';
import { cn } from '@/lib/utils';

type ProfileArtworkCardProps = {
    artwork: Artwork;
    aspectRatio?: 'portrait' | 'square' | 'landscape';
    className?: string;
};

export default function ProfileArtworkCard({ artwork, aspectRatio = 'portrait', className }: ProfileArtworkCardProps) {
    // Determine aspect ratio class if we want to enforce it, or we can let it be natural.
    // In masonry, natural is often better.

    return (
        <Card className={cn("overflow-hidden group transition-all duration-300 hover:shadow-xl border-0 bg-transparent", className)}>
            <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-xl">
                    <Link href={`/art/${artwork.id}`} className="block relative">
                        <Image
                            src={artwork.image_url}
                            alt={artwork.title}
                            width={500}
                            height={700}
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {/* Overlay with simpler content (No user info) */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <h3 className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{artwork.title}</h3>
                            {artwork.description && (
                                <p className="text-white/80 text-sm line-clamp-2 mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                    {artwork.description}
                                </p>
                            )}
                        </div>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
