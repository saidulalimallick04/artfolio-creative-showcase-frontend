'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, LayoutDashboard, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Compass, label: 'Explore' },
  // The upload button will be handled separately
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', auth: true },
  { href: '/profile', icon: User, label: 'Profile', auth: true },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    // For profile, we want to match /profile and /profile/[username]
    if (href === '/profile') return pathname.startsWith('/profile');
    return pathname.startsWith(href);
  };

  const filteredNavItems = navItems.filter(item => !item.auth || (item.auth && user));
  const navLinks = filteredNavItems.filter(item => item.href !== '/dashboard');
  const dashboardLink = filteredNavItems.find(item => item.href === '/dashboard');

  if (!user) {
     return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            <div className="container mx-auto flex h-16 max-w-screen-lg items-center justify-around px-4">
                {filteredNavItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                        'flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors w-16',
                        isActive(item.href)
                            ? 'text-primary'
                            : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                        )}
                    >
                        <item.icon className="h-6 w-6" />
                        <span className="text-xs font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
     );
  }

  const leftItems = filteredNavItems.slice(0, 2);
  const rightItems = filteredNavItems.slice(2);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container mx-auto flex h-16 max-w-screen-lg items-center justify-around px-2">
        {leftItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors w-16',
              isActive(item.href)
                ? 'text-primary'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}

        <div className="flex-grow flex justify-center">
            <Button asChild size="icon" className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg -translate-y-4">
                <Link href="/dashboard">
                    <Plus className="h-6 w-6" />
                    <span className="sr-only">Upload</span>
                </Link>
            </Button>
        </div>

        {rightItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors w-16',
              isActive(item.href)
                ? 'text-primary'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
