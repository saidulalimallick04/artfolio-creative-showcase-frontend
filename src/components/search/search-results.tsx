import { Artwork, UserPublic } from '@/types/api';
import ImageMosaic from '@/components/image-mosaic';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SearchResultsProps {
    type: string;
    data: Artwork[] | UserPublic[];
}

export function SearchResults({ type, data }: SearchResultsProps) {
    if (data.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-muted-foreground">No results found</h2>
                <p className="text-muted-foreground mt-2">Try adjusting your search query.</p>
            </div>
        );
    }

    if (type === 'artworks') {
        return <ImageMosaic artworks={data as Artwork[]} />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(data as UserPublic[]).map((user) => (
                <Card key={user.id} className="overflow-hidden text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <CardContent className="p-6 flex flex-col items-center">
                        <Link href={`/profile/${user.username}`}>
                            <Avatar className="h-24 w-24 mb-4 border-4 border-background ring-2 ring-primary transition-all group-hover:scale-105">
                                <AvatarImage src={user.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt={user.username} />
                                <AvatarFallback className="text-3xl">{user.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Link>
                        <h2 className="text-xl font-bold font-headline truncate w-full">{user.username}</h2>
                        {user.full_name && <p className="text-sm text-foreground/80 mb-1">{user.full_name}</p>}
                        <Button asChild variant="outline" size="sm" className="mt-4">
                            <Link href={`/profile/${user.username}`}>
                                View Profile <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
