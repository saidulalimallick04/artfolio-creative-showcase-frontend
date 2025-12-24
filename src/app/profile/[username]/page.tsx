import { notFound } from 'next/navigation';
import { getUserByUsername, getArtworksByUsername } from '@/lib/mock-data';
import ImageMosaic from '@/components/image-mosaic';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type PublicProfilePageProps = {
  params: {
    username: string;
  };
};

export default function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = params;
  const user = getUserByUsername(username);
  
  if (!user) {
    notFound();
  }
  
  const artworks = getArtworksByUsername(username);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col items-center text-center mb-12">
        <Avatar className="h-24 w-24 mb-4 border-4 border-background ring-2 ring-primary">
          <AvatarImage src={user.avatarUrl} alt={user.username} />
          <AvatarFallback className="text-3xl">{user.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="font-headline text-4xl md:text-5xl font-bold">{user.username}</h1>
        <p className="text-muted-foreground mt-2">{user.email}</p>
        <p className="max-w-2xl mt-4">
          Welcome to my creative space! Here you'll find a collection of my digital artworks and visual memories. 
          I hope you enjoy exploring my portfolio.
        </p>
      </header>
      
      {artworks.length > 0 ? (
        <ImageMosaic artworks={artworks} />
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold">No artworks yet</h2>
          <p className="text-muted-foreground mt-2">{user.username} hasn't uploaded any artwork.</p>
        </div>
      )}
    </div>
  );
}
