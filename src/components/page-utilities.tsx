'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUp, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function PageUtilities() {
    const router = useRouter();
    const { toast } = useToast();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [showRefresh, setShowRefresh] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Go To Top Logic: Show if scrolled down more than 300px
            setShowScrollTop(currentScrollY > 300);

            // Refresh Button Logic: Show if scrolling UP and scrolled down at least 200px
            if (currentScrollY > 200 && currentScrollY < lastScrollY) {
                setShowRefresh(true);
            } else {
                setShowRefresh(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);

        router.refresh();

        // Simulate loading for better UX feedback 
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setIsRefreshing(false);
            toast({
                description: "Refreshed!",
                duration: 2000,
            });
        }, 1000);
    };

    return (
        <>
            {/* Refresh Button - Top Center/Under Header */}
            <div
                className={cn(
                    "fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-300 transform",
                    showRefresh ? "top-24 opacity-100 translate-y-0" : "top-10 opacity-0 -translate-y-4 pointer-events-none"
                )}
            >
                <Button
                    onClick={handleRefresh}
                    variant="secondary"
                    size="sm"
                    className="rounded-full shadow-lg bg-background/80 backdrop-blur-md border border-border/50 gap-2 pr-4 pl-3"
                    disabled={isRefreshing}
                >
                    <RotateCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                    <span className="font-medium">Refresh</span>
                </Button>
            </div>

            {/* Scroll To Top - Bottom Right */}
            <div
                className={cn(
                    "fixed right-4 z-40 transition-all duration-300 transform",
                    // Desktop: bottom-8, Mobile: bottom-24 (to clear nav)
                    "bottom-24 md:bottom-8",
                    showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
                )}
            >
                <Button
                    onClick={scrollToTop}
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110 transition-all"
                >
                    <ArrowUp className="h-6 w-6" />
                    <span className="sr-only">Scroll to top</span>
                </Button>
            </div>
        </>
    );
}
