import { notFound } from 'next/navigation';
import { getUserProfile, getUserArtworks } from '@/actions/users_action';
import ProfileContent from '@/components/profile-content';

type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

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
