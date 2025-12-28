import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
    return (
        <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
            {/* Navigation & Header Skeleton */}
            <div className="mb-6 flex items-center justify-between">
                <Skeleton className="h-10 w-32 rounded-lg" />
                <Skeleton className="h-10 w-24 rounded-lg" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left Column: Image Skeleton */}
                <div className="lg:col-span-7">
                    <div className="rounded-2xl overflow-hidden bg-muted/30 border shadow-sm aspect-[4/5] md:aspect-[3/2] w-full">
                        <Skeleton className="h-full w-full" />
                    </div>
                </div>

                {/* Right Column: Details Skeleton */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-3/4 rounded-lg" />

                        {/* Artist Row Skeleton */}
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Description Skeleton */}
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>

                    {/* Action Buttons Skeleton */}
                    <div className="flex gap-3 pt-2">
                        <Skeleton className="h-12 flex-1 rounded-full" />
                        <Skeleton className="h-12 flex-1 rounded-full" />
                    </div>

                    {/* Comments Block Skeleton */}
                    <div className="rounded-xl border bg-card shadow-sm p-6 space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-20 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
