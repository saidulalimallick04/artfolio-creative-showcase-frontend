'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Artwork } from '@/types/api';
import ImageMosaic from '@/components/image-mosaic';
import { getArtworks } from '@/actions/artworks_action';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ConnectionErrorState } from '@/components/connection-error-state';

interface ArtworkInfiniteScrollProps {
    initialArtworks: Artwork[];
}

export default function ArtworkInfiniteScroll({ initialArtworks }: ArtworkInfiniteScrollProps) {
    const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
    const [page, setPage] = useState(1); // Start from page 1 (since 0 is initial)
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isError, setIsError] = useState(false);
    const [retryToken, setRetryToken] = useState(0);

    const observer = useRef<IntersectionObserver | null>(null);
    const { toast } = useToast();
    const LIMIT = 20;

    const lastArtworkElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isError) {
                setPage(prevPage => prevPage + 1);
            }
        }, { threshold: 0.1, rootMargin: '100px' }); // Trigger a bit before strictly end

        if (node) observer.current.observe(node);
    }, [loading, hasMore, isError]);


    // Reset state when initialArtworks changes (e.g. on router.refresh())
    useEffect(() => {
        setArtworks(initialArtworks);
        setPage(1);
        setHasMore(true);
        setIsError(false);
        setRetryToken(0);
    }, [initialArtworks]);

    useEffect(() => {
        // Prevent fetching for the initial page (page 0/1 handled by server)
        if (page === 1) return;

        const loadMoreArtworks = async () => {
            setLoading(true);
            setIsError(false);
            setHasMore(true); // Optimistically assume more, or keep previous state? 
            // In error case, we set hasMore(false). Retrying should reset it? 
            // Better to keep hasMore true if we are retrying.

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
                setHasMore(false);
                setIsError(true);
                toast({
                    variant: "destructive",
                    title: "Connection Error",
                    description: "Could not load more artworks. Server not responding."
                });
            }
            setLoading(false);
        };

        loadMoreArtworks();
    }, [page, retryToken]);

    const handleRetry = () => {
        setRetryToken(prev => prev + 1);
        setHasMore(true); // Re-enable fetching flag
    };

    return (
        <div className="space-y-8">
            <ImageMosaic artworks={artworks} />

            {/* Error State */}
            {isError && (
                <ConnectionErrorState onRetry={handleRetry} />
            )}

            {/* Loading / Scroll Trigger Metadata */}
            {!isError && (
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
            )}
        </div>
    );
}
