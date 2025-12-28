

import Link from 'next/link';
import PageUtilities from '@/components/page-utilities';
import { getUsers } from '@/actions/users_action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default async function ArtistsPage() {
  const result = await getUsers();
  const artists = result.success && result.data ? result.data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageUtilities />
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Discover Artists
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Browse our community of talented artists from around the world.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artists.map((artist) => (
          <Card key={artist.id} className="overflow-hidden text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardContent className="p-6 flex flex-col items-center">
              <Link href={`/profile/${artist.username}`}>
                <Avatar className="h-24 w-24 mb-4 border-4 border-background ring-2 ring-primary transition-all group-hover:scale-105">
                  <AvatarImage src={artist.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${artist.username}`} alt={artist.username} />
                  <AvatarFallback className="text-3xl">{artist.username.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <h2 className="text-xl font-bold font-headline">{artist.username}</h2>
              <p className="text-sm text-muted-foreground mb-4">~~~~~</p>
              <Button asChild variant="outline" size="sm">
                <Link href={`/profile/${artist.username}`}>
                  View Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
