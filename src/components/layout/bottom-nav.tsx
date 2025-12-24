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
  { href: '/upload', icon: Plus, label: 'Upload', auth: true, isCentral: true },
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 md:hidden">
      <div className="relative flex h-16 items-center justify-around border-t bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {filteredNavItems.map((item) => {
          if (item.isCentral) {
            return (
              <div key={item.label} className="relative -mt-12 flex h-16 w-16 items-center justify-center">
                <Button asChild size="icon" className="absolute h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90">
                    <Link href={item.href}>
                        <Plus className="h-8 w-8" />
                        <span className="sr-only">{item.label}</span>
                    </Link>
                </Button>
              </div>
            );
          }
          return (
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
          );
        })}
      </div>
    </nav>
  );
}
