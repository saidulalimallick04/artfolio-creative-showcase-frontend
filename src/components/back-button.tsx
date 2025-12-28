'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    label?: string;
    className?: string;
}

export default function BackButton({ label = "Back", className }: BackButtonProps) {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            className={`pl-0 hover:bg-transparent hover:text-primary ${className}`}
            onClick={() => router.back()}
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {label}
        </Button>
    );
}
