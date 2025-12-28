'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArtworkDisplayProps {
    src: string;
    alt: string;
}

export default function ArtworkDisplay({ src, alt }: ArtworkDisplayProps) {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    return (
        <>
            {/* Main Image Display */}
            <div
                className="relative group cursor-zoom-in rounded-xl overflow-hidden bg-muted shadow-lg aspect-[3/4] md:aspect-auto md:h-[calc(100vh-8rem)] w-full"
                onClick={() => setIsLightboxOpen(true)}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
                        <Maximize2 className="h-4 w-4" />
                        <span className="text-sm font-medium">View Full Screen</span>
                    </div>
                </div>
            </div>

            {/* Lightbox Overlay */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <div className="absolute top-4 right-4 z-50">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-background/20 hover:bg-background/40 text-foreground rounded-full h-10 w-10 border border-border/50"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLightboxOpen(false);
                            }}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div
                        className="relative w-full h-full max-w-7xl max-h-[85vh] select-none"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            quality={100}
                            priority
                        />
                    </div>
                </div>
            )}
        </>
    );
}
