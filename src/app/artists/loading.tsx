import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-12 space-y-4">
                <Skeleton className="h-12 w-2/3 md:w-1/3 mx-auto rounded-lg" />
                <Skeleton className="h-6 w-full md:w-1/2 mx-auto rounded-md" />
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardContent className="p-6 flex flex-col items-center space-y-4">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <div className="space-y-2 w-full flex flex-col items-center">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <Skeleton className="h-9 w-32 rounded-md" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
