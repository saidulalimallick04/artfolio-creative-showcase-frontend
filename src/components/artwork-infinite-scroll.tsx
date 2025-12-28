'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Artwork } from '@/types/api';
import ImageMosaic from '@/components/image-mosaic';
import { getArtworks } from '@/actions/artworks_action';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArtworkInfiniteScrollProps {
    initialArtworks: Artwork[];
}

export default function ArtworkInfiniteScroll({ initialArtworks }: ArtworkInfiniteScrollProps) {
    const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
    const [page, setPage] = useState(1); // Start from page 1 (since 0 is initial)
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const { toast } = useToast();
    const LIMIT = 20;

    const lastArtworkElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        }, { threshold: 0.1, rootMargin: '100px' }); // Trigger a bit before strictly end

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);


    // Reset state when initialArtworks changes (e.g. on router.refresh())
    useEffect(() => {
        setArtworks(initialArtworks);
        setPage(1);
        setHasMore(true);
    }, [initialArtworks]);

    useEffect(() => {
        // Prevent fetching for the initial page (page 0/1 handled by server)
        if (page === 1) return;

        const loadMoreArtworks = async () => {
            setLoading(true);

            // Calculate skip: (page ) * limit?? 
            // Initial (page 0 implied): skip 0, limit 20.
            // Page 1 state set -> Load next batch? 
            // If page 1 means "fetch the 2nd batch", then skip = 1 * 20 = 20.
            // Page 0 was 0-20. 
            // Wait, standard: Page 1 = items 0-19. Page 2 = items 20-39.
            // My state `page` starts at 1. But I already HAVE the first batch. 
            // So `page=1` causing a fetch should fetch the SECOND batch.
            // skip = page * LIMIT. (1 * 20 = 20).

            const skip = page * LIMIT;
            // Wait, if page started at 1, and I increment to 2. 
            // Let's reset: 
            // Initial server load: skip 0.
            // First scroll -> setPage(prev => prev + 1). Page becomes 2.
            // Effect runs. Skip = (2-1) * 20 = 20? 
            // Let's stick to standard count. 
            // Artworks length currently = 20. Skip = 20.

            const currentCount = artworks.length;
            const result = await getArtworks(undefined, currentCount, LIMIT);

            if (result.success && result.data) {
                if (result.data.length === 0) {
                    setHasMore(false);
                    toast({
                        description: "You've reached the end of the collection.",
                        duration: 3000,
                    });
                } else {
                    setArtworks(prev => [...prev, ...result.data]);
                    if (result.data.length < LIMIT) {
                        setHasMore(false); // Less than limit means end
                        toast({
                            description: "You've reached the end of the collection.",
                            duration: 3000,
                        });
                    }
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Error fetching more artworks",
                    description: "Please try again later."
                });
            }
            setLoading(false);
        };

        loadMoreArtworks();
    }, [page]); // Dependency on page increment


    return (
        <div className="space-y-8">
            <ImageMosaic artworks={artworks} />

            {/* Loading / Scroll Trigger Metadata */}
            <div className="py-8 flex justify-center items-center w-full min-h-[100px]" ref={lastArtworkElementRef}>
                {loading && (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground animate-in fade-in duration-300">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-sm font-medium">Loading more inspiration...</span>
                    </div>
                )}
                {!hasMore && artworks.length > 0 && (
                    <p className="text-muted-foreground text-sm italic">You've reached the end.</p>
                )}
            </div>
        </div>
    );
}
