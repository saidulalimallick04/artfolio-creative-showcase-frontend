'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Artwork } from '@/types/api';

type ImageMosaicProps = {
  artworks: Artwork[];
};

export default function ImageMosaic({ artworks }: ImageMosaicProps) {
  const [columns, setColumns] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateColumns = () => {
      if (window.innerWidth < 640) setColumns(1);
      else if (window.innerWidth < 768) setColumns(2);
      else if (window.innerWidth < 1024) setColumns(3);
      else setColumns(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Distribute artworks into columns sequentially
  // We attach the original index to the artwork object wrapper to avoid O(N^2) lookups later
  const columnArrays = Array.from({ length: columns }, () => [] as { artwork: Artwork; originalIndex: number }[]);

  artworks.forEach((artwork, index) => {
    const columnIndex = index % columns;
    columnArrays[columnIndex].push({ artwork, originalIndex: index });
  });

  if (!mounted) {
    return null; // Avoid hydration mismatch by rendering nothing until mounted, or render a simple grid
  }

  return (
    <div className="flex gap-4 items-start pb-20">
      {columnArrays.map((col, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col gap-4">
          {col.map(({ artwork, originalIndex }) => {
            // Calculate delay based on batch of 20 to reset animation timer for new fetches
            const delay = (originalIndex % 20) * 100;

            return (
              <div
                key={artwork.id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${delay}ms` }}
              >
                <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl border-0 bg-transparent">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-xl">
                      <Link href={`/art/${artwork.id}`}>
                        <Image
                          src={artwork.image_url}
                          alt={artwork.title}
                          width={500}
                          height={700}
                          unoptimized
                          className="w-full h-auto object-cover transition-transform duration-500 md:group-hover:scale-105"
                        />
                      </Link>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                        <Link href={`/art/${artwork.id}`}>
                          <h3 className="text-white font-bold truncate text-lg">{artwork.title}</h3>
                        </Link>
                        <Link href={`/profile/${artwork.owner.username}`} className="flex items-center mt-2 group/avatar w-fit">
                          <Avatar className="h-6 w-6 mr-2 border-2 border-white/80">
                            <AvatarImage src={artwork.owner.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${artwork.owner.username}`} />
                            <AvatarFallback className="text-[10px]">{artwork.owner.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-white/90 text-sm font-medium group-hover/avatar:underline decoration-white/50 underline-offset-4">{artwork.owner.username}</span>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  );
}
