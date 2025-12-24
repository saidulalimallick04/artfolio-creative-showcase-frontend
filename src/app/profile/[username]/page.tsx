
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
      <header className="relative mb-12 rounded-xl overflow-hidden p-8 md:p-12 flex flex-col md:flex-row items-center bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-accent/5 opacity-50"></div>
        <Avatar className="relative h-28 w-28 md:h-36 md:w-36 mb-6 md:mb-0 md:mr-8 border-4 border-white shadow-lg ring-4 ring-primary/50">
          <AvatarImage src={user.avatarUrl} alt={user.username} />
          <AvatarFallback className="text-4xl">{user.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="relative text-center md:text-left">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground">{user.username}</h1>
          <p className="text-muted-foreground mt-2 text-lg">{user.email}</p>
          <p className="max-w-2xl mt-4 text-foreground/80">
            Welcome to my creative space! Here you'll find a collection of my digital artworks and visual memories. 
            I hope you enjoy exploring my portfolio.
          </p>
        </div>
      </header>
      
      {artworks.length > 0 ? (
        <ImageMosaic artworks={artworks} />
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/20">
          <h2 className="text-2xl font-semibold font-headline text-foreground">A Blank Canvas</h2>
          <p className="text-muted-foreground mt-2">{user.username} is just getting started. Check back soon for new creations!</p>
        </div>
      )}
    </div>
  );
}
