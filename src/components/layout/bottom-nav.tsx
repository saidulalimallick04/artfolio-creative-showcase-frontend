'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, LayoutDashboard, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Compass, label: 'Explore' },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', auth: true },
  { href: '/profile', icon: User, label: 'Profile', auth: true },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  const filteredNavItems = navItems.filter(item => !item.auth || (item.auth && user));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container mx-auto flex h-16 max-w-screen-lg items-center justify-around px-4">
        {filteredNavItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary',
              isActive(item.href) && 'text-primary'
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
