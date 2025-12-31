'use client';

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils'; // Assuming cn utility exists

export function RouteProgressBar({ className }: { className?: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [progress, setProgress] = React.useState(0);
    const [isVisible, setIsVisible] = React.useState(false);

    // Reset progress when path changes (navigation complete)
    React.useEffect(() => {
        setProgress(100);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setProgress(0);
        }, 500); // Fade out delay
        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    // Listen for clicks on links to start progress
    React.useEffect(() => {
        const handleAnchorClick = (event: MouseEvent) => {
            const anchor = (event.target as HTMLElement).closest('a');
            if (
                anchor &&
                anchor.href &&
                anchor.target !== '_blank' &&
                anchor.origin === window.location.origin &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.shiftKey &&
                !event.altKey
            ) {
                // Check if it's actually a navigation (not same page hash or strictly same url)
                const currentUrl = new URL(window.location.href);
                const targetUrl = new URL(anchor.href);

                // If paths are different or search params different, trigger loading
                if (currentUrl.pathname !== targetUrl.pathname || currentUrl.search !== targetUrl.search) {
                    setIsVisible(true);
                    setProgress(10);
                    // Simulate slow progress
                    const interval = setInterval(() => {
                        setProgress((prev) => {
                            if (prev >= 90) {
                                clearInterval(interval);
                                return prev;
                            }
                            // Random increment
                            return prev + Math.random() * 10;
                        });
                    }, 300);

                    // Cleanup interval if component unmounts or navigation completes (handled by other effect effectivelly resetting but we should be careful)
                    // Actually, we can't easily clear this specific interval from the other effect.
                    // A ref would be better but for simplicity, let's rely on the fact that component re-renders or state updates.
                    // Better: use a ref for the interval.
                    (window as any)._routeProgressInterval = interval;
                }
            }
        };

        const cleanup = () => {
            if ((window as any)._routeProgressInterval) clearInterval((window as any)._routeProgressInterval);
        };

        // We also need to clear interval when pathname changes in the other effect.

        document.addEventListener('click', handleAnchorClick);
        return () => {
            document.removeEventListener('click', handleAnchorClick);
            cleanup();
        };
    }, []);

    // Clear interval on path change logic is tricky if split across effects.
    // Let's refine the "Simulate" logic:
    React.useEffect(() => {
        if (progress === 100) {
            if ((window as any)._routeProgressInterval) clearInterval((window as any)._routeProgressInterval);
        }
    }, [progress]);


    if (!isVisible) return null;

    return (
        <div className={cn("absolute bottom-0 left-0 right-0 z-50 h-1", className)}>
            <Progress value={progress} className="h-full rounded-none bg-transparent [&>div]:bg-primary transition-all duration-300 ease-in-out" />
        </div>
    );
}
