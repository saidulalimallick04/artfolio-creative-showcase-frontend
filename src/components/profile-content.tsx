'use client';

import { useState } from 'react';
import { UserPublic, Artwork } from '@/types/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

import { LayoutGrid, List, Search, X, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileArtworkCard from '@/components/profile-artwork-card';

interface ProfileContentProps {
    user: UserPublic;
    initialArtworks: Artwork[];
}

// ... (imports remain same, remove ImageMosaic if no longer used)

export default function ProfileContent({ user, initialArtworks }: ProfileContentProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredArtworks = initialArtworks.filter((artwork) =>
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (artwork.description && artwork.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {/* Sticky Sidebar */}
                <div className="md:col-span-1">
                    <div className="sticky top-24 space-y-6 p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl shadow-xl transition-all hover:shadow-2xl hover:bg-card/40 group">
                        <div className="flex flex-col items-center text-center relative">
                            {/* Decorative background element for avatar */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none opacity-50" />

                            <Avatar className="h-32 w-32 border-4 border-background shadow-2xl mb-4 ring-2 ring-primary/10 transition-transform group-hover:scale-105 duration-500">
                                <AvatarImage
                                    src={user.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                    alt={user.username}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-4xl font-headline bg-gradient-to-br from-primary/20 to-secondary/20">{user.username.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <div className="space-y-1 w-full">
                                <h1 className="font-headline text-2xl font-bold truncate w-full flex items-center justify-center gap-2" title={user.username}>
                                    {user.username}
                                    <BadgeCheck className="h-5 w-5 text-primary fill-primary/10" />
                                </h1>
                                {user.full_name && <p className="text-sm font-medium text-muted-foreground">{user.full_name}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {user.bio ? (
                                <p className="text-sm text-muted-foreground leading-relaxed text-center font-medium">
                                    {user.bio}
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground/60 italic text-center">
                                    No bio available.
                                </p>
                            )}
                        </div>

                        <div className="pt-6 border-t border-border/50">
                            <div className="grid grid-cols-2 gap-4 text-center divide-x divide-border/50">
                                <div className="group/stat cursor-default">
                                    <span className="block font-bold text-2xl group-hover/stat:text-primary transition-colors">{initialArtworks.length}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Artworks</span>
                                </div>
                                <div className="opacity-50 group/stat cursor-not-allowed">
                                    <span className="block font-bold text-2xl">--</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Followers</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-3 space-y-6">
                    {/* Search and View Toggle Header */}
                    {/* Search and View Toggle Header */}
                    <div className="sticky top-24 z-30 flex flex-row gap-2 sm:gap-4 items-center justify-between bg-card/80 p-2 sm:p-4 rounded-xl border backdrop-blur-md shadow-sm transition-all">
                        <div className="relative flex-1 max-w-md group">
                            <Input
                                placeholder="Search..."
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
                                        title="Clear search"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                )}
                                <Button
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 shadow-none"
                                    onClick={() => { }} // Already filtering in real-time
                                    title="Search"
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

                    {/* Artworks Content */}
                    {filteredArtworks.length > 0 ? (
                        <>
                            {viewMode === 'grid' ? (
                                <div className="gap-4 space-y-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
                                    {filteredArtworks.map((artwork) => (
                                        <div key={artwork.id} className="break-inside-avoid mb-4">
                                            <ProfileArtworkCard artwork={artwork} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredArtworks.map((artwork) => (
                                        <div key={artwork.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-xl border hover:shadow-md transition-shadow">
                                            <div className="w-full sm:w-48 h-48 shrink-0 relative rounded-lg overflow-hidden bg-muted">
                                                <ProfileArtworkCard artwork={artwork} className="h-full hover:shadow-none" />
                                                {/* Reusing card structure but constrained container, or we could make a dedicated list item structure. 
                                                      Actually, ProfileArtworkCard has click structure. Let's just use it inside a container or make a specific list rendering.
                                                      Reusing is tricky due to hover effects. Let's write inline list item for simplicity and request.
                                                  */}
                                            </div>
                                            <div className="flex-1 space-y-2 py-2">
                                                <h3 className="text-xl font-bold font-headline">{artwork.title}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-3">{artwork.description || 'No description provided.'}</p>
                                                <div className="pt-4 flex items-center gap-4 text-sm text-muted-foreground">
                                                    {/* Future metadata like date, likes, etc */}
                                                    <span>Uploaded just now</span>
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
                                <Search className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h2 className="text-lg font-semibold text-foreground">No artworks found</h2>
                            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                                {searchQuery ? `We couldn't find any artworks matching "${searchQuery}"` : "This user serves as a simplified, minimal portfolio."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
