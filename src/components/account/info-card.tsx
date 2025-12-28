'use client';

import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoCardProps {
    label: string;
    value: string | null | undefined;
    dialogTitle: string;
    dialogDescription?: string;
    children: (closeDialog: () => void) => ReactNode; // Render prop to pass close function
    className?: string;
    isEditable?: boolean;
}

export function InfoCard({
    label,
    value,
    dialogTitle,
    dialogDescription,
    children,
    className,
    isEditable = true,
}: InfoCardProps) {
    const [open, setOpen] = useState(false);

    return (
        <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
            <CardContent className="p-6 flex items-center justify-between gap-4">
                <div className="space-y-1 overflow-hidden min-w-0">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        {label}
                    </p>
                    <p className="text-base font-semibold truncate text-foreground">
                        {value || <span className="text-muted-foreground/60 italic">Not set</span>}
                    </p>
                </div>

                {isEditable && (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 text-muted-foreground hover:text-primary">
                                <Edit2 className="h-4 w-4" />
                                <span className="sr-only">Edit {label}</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>{dialogTitle}</DialogTitle>
                                {dialogDescription && <DialogDescription>{dialogDescription}</DialogDescription>}
                            </DialogHeader>
                            <div className="py-2">
                                {children(() => setOpen(false))}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </CardContent>
        </Card>
    );
}
