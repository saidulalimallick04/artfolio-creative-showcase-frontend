import { notFound } from 'next/navigation';
import { getUserProfile, getUserArtworks } from '@/actions/users_action';
import ProfileContent from '@/components/profile-content';

import { Metadata } from 'next';

type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: username,
    description: `Check out ${username}'s creative portfolio on ArtFolio.`,
  };
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;

  // Fetch user profile
  const profileResult = await getUserProfile(username);

  if (!profileResult.success || !profileResult.data) {
    notFound();
  }

  const user = profileResult.data;

  // Fetch artworks using the user ID from the profile
  const artworksResponse = await getUserArtworks(user.id);
  const artworks = artworksResponse.success && artworksResponse.data ? artworksResponse.data : [];

  return <ProfileContent user={user} initialArtworks={artworks} />;
}
