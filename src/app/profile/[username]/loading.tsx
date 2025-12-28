import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {/* Sidebar Skeleton */}
                <div className="md:col-span-1">
                    <div className="sticky top-24 space-y-6 p-6 rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <Skeleton className="h-32 w-32 rounded-full" />
                            <Skeleton className="h-8 w-3/4 rounded-md" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6 mx-auto" />
                        </div>
                        <div className="pt-4 border-t grid grid-cols-2 gap-4">
                            <div className="space-y-1 flex flex-col items-center">
                                <Skeleton className="h-6 w-8" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <div className="space-y-1 flex flex-col items-center">
                                <Skeleton className="h-6 w-8" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area Skeleton */}
                <div className="md:col-span-3 space-y-6">
                    {/* Header Skeleton */}
                    <div className="flex flex-row gap-4 items-center justify-between p-2 sm:p-4 rounded-xl border bg-card/80">
                        <Skeleton className="h-10 flex-1 rounded-full max-w-md" />
                        <div className="flex gap-1">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </div>

                    {/* Grid Skeleton */}
                    <div className="gap-4 space-y-4 columns-1 sm:columns-2 lg:columns-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="break-inside-avoid mb-4">
                                <Skeleton className="w-full rounded-xl" style={{ height: i % 2 === 0 ? '300px' : '400px' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
