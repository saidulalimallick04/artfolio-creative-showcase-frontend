import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-12 space-y-4">
                <Skeleton className="h-12 md:h-16 w-3/4 md:w-1/2 mx-auto rounded-lg" />
                <Skeleton className="h-6 w-full md:w-2/3 mx-auto rounded-md" />
            </header>

            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="break-inside-avoid relative mb-4 rounded-xl overflow-hidden">
                        <Skeleton
                            className="w-full rounded-xl"
                            style={{ aspectRatio: i % 2 === 0 ? '3/4' : '4/3' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
