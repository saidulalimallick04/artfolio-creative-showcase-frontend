
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LayoutGrid, LogOut, User as UserIcon, Compass, LayoutDashboard, Home, Plus, Users, Settings, Search, ArrowLeft, X } from 'lucide-react';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function Header() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('artworks');

    // Sync state with URL params if we land on search page directly or navigate
    useEffect(() => {
        if (pathname === '/search') {
            // Optionally open search bar or just sync values
            const q = searchParams.get('q');
            const type = searchParams.get('type');
            if (q) setSearchQuery(q);
            if (type) setSearchType(type);
        } else {
            // Close search bar on navigation
            setIsSearchOpen(false);
        }
    }, [pathname, searchParams]);


    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
        // Keep it open? Or close? Requirement "back button... normal nav will show" implies we stay in search mode until back is clicked
        // But usually navigate means we see results.
        // Let's keep it open or let the effect close it? 
        // Effect closes it on navigation. Let's let the effect handle it.
    };

    const handleSearchClose = () => {
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/explore', label: 'Artworks', icon: Compass },
        { href: '/artists', label: 'Artists', icon: Users },
        { href: '/dashboard', label: 'Dashboard', auth: true, icon: LayoutDashboard },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
            <div className="mt-4 flex h-16 w-full max-w-screen-lg items-center justify-between rounded-full border border-border/40 bg-background/80 px-6 shadow-lg backdrop-blur-lg md:px-8">
                {isSearchOpen ? (
                    <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 ml-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleSearchClose}
                            className="shrink-0 rounded-full"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>

                        <Select value={searchType} onValueChange={setSearchType}>
                            <SelectTrigger className="w-[80px] md:w-[110px] h-10 border-none bg-muted/50 focus:ring-0 focus:bg-muted transition-colors rounded-full text-xs md:text-sm px-2 md:px-3 justify-between [&>span]:flex-1 [&>span]:text-center [&>svg]:opacity-50">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="artworks">Art</SelectItem>
                                <SelectItem value="users">Artist</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="relative flex-1">
                            <Input
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={searchType === 'artworks' ? "Search art..." : "Search artists..."}
                                className="h-10 w-full pl-4 pr-10 rounded-full border-none bg-muted/50 focus-visible:ring-0 focus-visible:bg-muted transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <Button type="submit" size="icon" variant="ghost" className="shrink-0 rounded-full">
                            <Search className="h-5 w-5" />
                        </Button>
                    </form>
                ) : (
                    <Link href="/" className="flex items-center gap-2">
                        <LayoutGrid className="h-6 w-6 text-primary" />
                        <span className="font-bold font-headline text-lg sm:inline">ArtFolio</span>
                    </Link>
                )}

                {!isSearchOpen && (
                    <>
                        <nav className="hidden items-center gap-1 rounded-full bg-muted/50 p-1 md:flex">
                            {navItems.filter(item => !item.auth || (item.auth && user)).map((item) => (
                                <Button
                                    key={item.label}
                                    asChild
                                    variant={isActive(item.href) ? "default" : "ghost"}
                                    className={cn(
                                        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                                        isActive(item.href) ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Link href={item.href}>
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.label}
                                    </Link>
                                </Button>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full mr-1"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                            <ThemeToggle />
                            {user ? (
                                <>
                                    <Button asChild size="sm" className="rounded-full hidden md:inline-flex">
                                        <Link href="/upload">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Upload
                                        </Link>
                                    </Button>
                                    <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                                <Avatar className="h-10 w-10 border-2 border-primary/50">
                                                    <AvatarImage src={user.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt={user.username} />
                                                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end" forceMount>
                                            <DropdownMenuLabel className="font-normal">
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">{user.username}</p>
                                                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/profile">
                                                    <UserIcon className="mr-2 h-4 w-4" />
                                                    <span>Profile</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard">
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    <span>Dashboard</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/upload">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    <span>Upload</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/account">
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    <span>Account</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={logout}>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Log out</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <nav className="flex items-center gap-2">
                                    <Button asChild variant="ghost" className="rounded-full">
                                        <Link href="/login">Login</Link>
                                    </Button>
                                    <Button asChild className="rounded-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                                        <Link href="/signup">Sign Up</Link>
                                    </Button>
                                </nav>
                            )}
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
