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
import { LayoutGrid, LogOut, User as UserIcon, Compass, LayoutDashboard, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/dashboard', label: 'Dashboard', auth: true, icon: LayoutDashboard },
  ];
  
  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
        <div className="mt-4 flex h-16 w-full max-w-screen-lg items-center justify-between rounded-full border border-border/40 bg-background/80 px-6 shadow-lg backdrop-blur-lg md:px-8">
            <Link href="/" className="flex items-center gap-2">
                <LayoutGrid className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline text-lg hidden sm:inline">ArtFolio</span>
            </Link>

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
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-10 w-10 border-2 border-primary/50">
                                    <AvatarImage src={user.avatarUrl} alt={user.username} />
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
        </div>
    </header>
  );
}
