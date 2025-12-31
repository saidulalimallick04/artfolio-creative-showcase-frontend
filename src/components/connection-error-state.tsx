'use client';

import { Button } from '@/components/ui/button';
import { WifiOff, RotateCw } from 'lucide-react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

interface ConnectionErrorStateProps {
    onRetry?: () => void;
}

export function ConnectionErrorState({ onRetry }: ConnectionErrorStateProps) {
    const router = useRouter();

    const handleRefresh = () => {
        if (onRetry) {
            onRetry();
        } else {
            router.refresh();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-in fade-in zoom-in-95 duration-500 min-h-[40vh]">
            <div className="h-24 w-24 bg-destructive/10 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <WifiOff className="h-12 w-12 text-destructive" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Connection Lost</h3>
            <p className="text-lg max-w-md text-center mb-8">
                It looks like the server is taking a break. Please check your internet connection or try again later.
            </p>
            <div className="flex gap-4">
                <Button onClick={handleRefresh} className="gap-2">
                    <RotateCw className="h-4 w-4" />
                    Refresh
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
        </div>
    );
}
