import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArtworkById } from '@/actions/artworks_action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, Heart } from 'lucide-react';
import ArtworkDisplay from '@/components/artwork-display';
import { ShareButton } from '@/components/share-button';
import BackButton from '@/components/back-button';
import { cookies } from 'next/headers';
import ArtworkActions from '@/components/artwork-actions';
import { Separator } from '@/components/ui/separator';
import PageUtilities from '@/components/page-utilities';

import { Metadata } from 'next';

type ArtworkPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: ArtworkPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getArtworkById(id);

  if (!result.success || !result.data) {
    return {
      title: 'Artwork Not Found',
    };
  }

  return {
    title: result.data.title,
    description: result.data.description || `View ${result.data.title} on ArtFolio.`,
  };
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { id } = await params;
  const result = await getArtworkById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const artwork = result.data;
  const cookieStore = await cookies();
  const currentUsername = cookieStore.get('username')?.value;
  const isOwner = currentUsername === artwork.owner.username;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
      <PageUtilities />
      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <BackButton label="Back to Gallery" />

        {/* Owner Actions */}
        <ArtworkActions artworkId={id} isOwner={isOwner} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* Left Column: Artwork Image */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 rounded-2xl overflow-hidden bg-muted/30 border shadow-sm">
            <ArtworkDisplay src={artwork.image_url} alt={artwork.title} />
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-5 space-y-8">

          {/* Header Section */}
          <div className="space-y-4">
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {artwork.title}
            </h1>

            {/* Artist Row */}
            {artwork.owner && (
              <div className="flex items-center justify-between">
                <Link href={`/profile/${artwork.owner.username}`} className="flex items-center gap-3 group">
                  <Avatar className="h-10 w-10 border border-border shadow-sm">
                    <AvatarImage src={artwork.owner.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${artwork.owner.username}`} alt={artwork.owner.username} />
                    <AvatarFallback>{artwork.owner.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium group-hover:underline decoration-primary underline-offset-4 pointer-events-none">
                      {artwork.owner.username}
                    </p>
                    <p className="text-xs text-muted-foreground">Artist</p>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div className="prose prose-sm dark:prose-invert text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {artwork.description || "No description provided."}
          </div>

          {/* Actions */}
          <Button className="flex-1 rounded-full" size="lg">
            <Heart className="mr-2 h-4 w-4" />
            Like
          </Button>
          <ShareButton artworkId={id} title={artwork.title} />
        </div>

        {/* Comments Placeholder */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 font-semibold">
              <MessageSquare className="h-4 w-4" />
              <h3>Comments</h3>
            </div>
            <div className="p-6 bg-muted/50 rounded-lg border border-dashed text-center space-y-1">
              <p className="text-sm font-medium">Discussion Disabled</p>
              <p className="text-xs text-muted-foreground">Comments will be enabled in a future update.</p>
            </div>
          </div>
        </div>

      </div>
    </div>

  );
}
