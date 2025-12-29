
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, LayoutDashboard, User, Plus, Users, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  {
    id: 'explore',
    icon: Compass,
    label: 'Explore',
    isDropdown: true,
    children: [
      { href: '/explore', label: 'Artworks', icon: ImageIcon },
      { href: '/artists', label: 'Artists', icon: Users }
    ]
  },
  { href: '/upload', icon: Plus, label: 'Upload', auth: true, isCentral: true },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', auth: true },
  { href: '/profile', icon: User, label: 'Profile', auth: true },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    if (href === '/profile') return pathname.startsWith('/profile');
    return pathname.startsWith(href);
  };

  const isExploreActive = pathname.startsWith('/explore') || pathname.startsWith('/artists');

  const centralItem = navItems.find(item => 'isCentral' in item && item.isCentral && (!item.auth || (item.auth && user)));
  const regularItems = navItems.filter(item => !('isCentral' in item && item.isCentral) && (!item.auth || (item.auth && user)));

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="relative flex h-16 items-center justify-around rounded-full border border-primary/20 bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-xl shadow-2xl shadow-primary/10 supports-[backdrop-filter]:bg-background/60 transition-all duration-300 hover:shadow-primary/20">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

        {regularItems.map((item, index) => {
          // Insert the central button placeholder in the middle
          if (centralItem && index === Math.floor(regularItems.length / 2)) {
            return (
              <div key={`split-${index}`} className="contents">
                <div className="h-full w-16" />
                <NavItem item={item} isActive={isActive} isExploreActive={isExploreActive} />
              </div>
            )
          }

          return <NavItem key={item.label} item={item} isActive={isActive} isExploreActive={isExploreActive} />;
        })}

        {centralItem && 'href' in centralItem && centralItem.href && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            {/* Pulsing glow effect */}
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse" />

            <Button
              asChild
              size="icon"
              className="relative h-16 w-16 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-2xl shadow-primary/50 hover:shadow-primary/70 hover:scale-110 transition-all duration-300 ring-4 ring-background"
            >
              <Link href={centralItem.href as string}>
                <Plus className="h-8 w-8 transition-transform duration-300 group-hover:rotate-90" />
                <span className="sr-only">{centralItem.label}</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

import { ChevronUp } from 'lucide-react';
import { useState } from 'react';

function NavItem({ item, isActive, isExploreActive }: { item: any; isActive: (href: string) => boolean; isExploreActive: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  if ('isDropdown' in item && item.isDropdown && 'children' in item) {
    return (
      <DropdownMenu onOpenChange={setIsOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 p-1 rounded-lg transition-colors w-16 group',
              isExploreActive || isOpen
                ? 'text-primary'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
            )}
          >
            <div className="relative">
              <item.icon className="h-6 w-6 mb-1" />
              {/* Indicator Arrow */}
              <span className={cn(
                "absolute -top-2 left-1/2 -translate-x-1/2 transition-transform duration-300",
                isOpen ? "rotate-180 text-primary" : "text-muted-foreground/50"
              )}>
                <ChevronUp className="h-3 w-3" />
              </span>
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="center"
          sideOffset={10}
          className="mb-2 p-1 min-w-[140px] rounded-xl border-border/50 shadow-xl bg-background/95 backdrop-blur-md"
        >
          {item.children.map((child: any) => (
            <DropdownMenuItem key={child.href} asChild className="rounded-lg focus:bg-primary/10 focus:text-primary cursor-pointer my-0.5">
              <Link href={child.href} className="flex items-center gap-2.5 py-2 px-3">
                <child.icon className="h-4 w-4" />
                <span className="font-medium">{child.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Safe check for href mainly for TS comfort, though logic ensures regular items have href
  if (!('href' in item)) return null;

  return (
    <Link
      href={item.href as string}
      className={cn(
        'flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors w-16',
        isActive(item.href as string)
          ? 'text-primary'
          : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
      )}
    >
      <item.icon className="h-6 w-6" />
      <span className="text-[10px] font-medium">{item.label}</span>
    </Link>
  );
}
