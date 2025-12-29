
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

import { AnimatePresence, motion } from 'framer-motion';

export default function Header() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('artworks');

    // Sync state with URL params
    useEffect(() => {
        if (pathname === '/search') {
            const q = searchParams.get('q');
            const type = searchParams.get('type');
            if (q) setSearchQuery(q);
            if (type) setSearchType(type);
        } else {
            setIsSearchOpen(false);
        }
    }, [pathname, searchParams]);


    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
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
            <motion.div
                layout
                className="mt-4 flex h-16 w-full max-w-screen-lg items-center justify-between rounded-full border border-border/40 bg-background/80 px-6 shadow-lg backdrop-blur-lg md:px-8 overflow-hidden"
            >
                <AnimatePresence mode="wait">
                    {isSearchOpen ? (
                        <motion.form
                            key="search-bar"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            onSubmit={handleSearchSubmit}
                            className="flex-1 flex items-center gap-2 w-full"
                        >
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={handleSearchClose}
                                className="shrink-0 rounded-full hover:bg-muted"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>

                            <Select value={searchType} onValueChange={setSearchType}>
                                <SelectTrigger className="w-[80px] md:w-[110px] h-10 border-none bg-muted/50 focus:ring-0 focus:bg-muted transition-colors rounded-full text-xs md:text-sm px-2 md:px-3 justify-between shadow-none">
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
                                    className="h-10 w-full pl-4 pr-10 rounded-full border-none bg-muted/50 focus-visible:ring-0 focus-visible:bg-muted transition-colors shadow-none"
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

                            <Button type="submit" size="icon" variant="ghost" className="shrink-0 rounded-full hover:bg-muted">
                                <Search className="h-5 w-5" />
                            </Button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="nav-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-between w-full"
                        >
                            <Link href="/" className="flex items-center gap-2 mr-4">
                                <LayoutGrid className="h-6 w-6 text-primary" />
                                <span className="font-bold font-headline text-lg sm:inline">ArtFolio</span>
                            </Link>

                            <nav className="hidden items-center gap-1 rounded-full bg-muted/50 p-1 md:flex mx-auto">
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

                            <div className="flex items-center gap-2 ml-auto">
                                <motion.div layoutId="search-icon-container">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full mr-1 hover:bg-muted"
                                        onClick={() => setIsSearchOpen(true)}
                                    >
                                        <Search className="h-5 w-5" />
                                    </Button>
                                </motion.div>
                                <ThemeToggle />
                                {user ? (
                                    <>
                                        <Button asChild size="sm" className="rounded-full hidden md:inline-flex shadow-sm">
                                            <Link href="/upload">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Upload
                                            </Link>
                                        </Button>
                                        <DropdownMenu modal={false}>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/10">
                                                    <Avatar className="h-10 w-10 border border-border">
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
                                                    <Link href="/account">
                                                        <Users className="mr-2 h-4 w-4" />
                                                        <span>Account</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/settings">
                                                        <Settings className="mr-2 h-4 w-4" />
                                                        <span>Settings</span>
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
                                        <Button asChild className="rounded-full shadow-sm" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                                            <Link href="/signup">Sign Up</Link>
                                        </Button>
                                    </nav>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </header>
    );
}
