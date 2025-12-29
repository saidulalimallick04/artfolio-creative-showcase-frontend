'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getUserArtworks } from '@/actions/users_action';
import { Artwork } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LayoutGrid, List, Search, X, Plus, Settings, LogOut, Edit2 } from 'lucide-react';
import ProfileArtworkCard from '@/components/profile-artwork-card';
import ArtworkActions from '@/components/artwork-actions';
import { logoutUser } from '@/actions/auth_action';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchArtworks = async () => {
      const result = await getUserArtworks(user.id);
      if (result.success && result.data) {
        setArtworks(result.data);
      }
      setLoading(false);
    };

    fetchArtworks();
  }, [user, router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Sidebar Skeleton */}
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-6 p-6 rounded-xl border bg-card/50 shadow-sm">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-32 w-32 rounded-full bg-muted animate-pulse" />
                <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
              </div>
              <div className="space-y-3 pt-6">
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="md:col-span-3 space-y-6">
            <div className="h-14 w-full bg-muted rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const filteredArtworks = artworks.filter((artwork) =>
    artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (artwork.description && artwork.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">

        {/* Sidebar (User Info & Actions) */}
        <div className="md:col-span-1">
          <div className="md:sticky md:top-24 space-y-6 p-6 rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm relative group">

            {/* Edit Profile Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
              asChild
              title="Edit Profile"
            >
              <Link href="/account">
                <Edit2 className="h-4 w-4" />
              </Link>
            </Button>

            <div className="flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 border-4 border-background shadow-md mb-4">
                <AvatarImage
                  src={user.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.username}
                />
                <AvatarFallback className="text-3xl">{user.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <h1 className="font-headline text-2xl font-bold truncate w-full" title={user.username}>
                {user.username}
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center py-4 border-t border-b border-border/50">
              <div>
                <span className="block font-bold text-xl">{artworks.length}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Artworks</span>
              </div>
              <div className="opacity-50">
                <span className="block font-bold text-xl">--</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Likes</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full gap-2 rounded-xl h-11" asChild>
                <Link href="/upload">
                  <Plus className="h-4 w-4" /> Upload New
                </Link>
              </Button>
              <Button variant="outline" className="w-full gap-2 rounded-xl h-11" asChild>
                <Link href={`/profile/${user.username}`}>
                  View Public Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-6">

          {/* Header / Search Bar */}
          <div className="sticky top-24 z-30 flex flex-row gap-2 sm:gap-4 items-center justify-between bg-card/80 p-2 sm:p-4 rounded-xl border backdrop-blur-md shadow-sm transition-all">
            <div className="relative flex-1 max-w-md group">
              <Input
                placeholder="Search your artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-20 h-10 bg-background/50 border-border/60 focus:bg-background transition-all rounded-full text-sm"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchQuery('')}
                    className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  size="icon"
                  className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 shadow-none"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content List/Grid */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading your collection...</p>
            </div>
          ) : filteredArtworks.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="gap-4 space-y-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
                  {filteredArtworks.map((artwork) => (
                    <div key={artwork.id} className="break-inside-avoid mb-4 relative group">
                      <ProfileArtworkCard artwork={artwork} />
                      {/* Action Overlay */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="bg-background/80 backdrop-blur-sm rounded-full shadow-sm">
                          <ArtworkActions artworkId={artwork.id} isOwner={true} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredArtworks.map((artwork) => (
                    <div key={artwork.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-xl border hover:shadow-md transition-shadow group">
                      <div className="w-full sm:w-48 h-48 shrink-0 relative rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={artwork.image_url}
                          alt={artwork.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2 py-2 relative">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold font-headline">{artwork.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{artwork.description || 'No description provided.'}</p>
                          </div>
                          <ArtworkActions artworkId={artwork.id} isOwner={true} />
                        </div>
                        <div className="pt-4 flex items-center gap-4 text-sm text-muted-foreground mt-auto">
                          <span>Uploaded {new Date().toLocaleDateString()}</span> {/* Placeholder date if data missing */}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="secondary" size="sm" asChild>
                            <Link href={`/art/${artwork.id}/edit`}>Edit</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/art/${artwork.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">No artworks yet</h2>
              <p className="text-muted-foreground mt-2 max-w-sm mx-auto mb-6">
                Start building your portfolio by uploading your first piece of art.
              </p>
              <Button asChild>
                <Link href="/upload">Upload Now</Link>
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
