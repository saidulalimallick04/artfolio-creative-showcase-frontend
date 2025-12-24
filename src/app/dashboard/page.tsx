'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { getArtworksByUsername } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  const userArtworks = getArtworksByUsername(user.username);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div>
            <h1 className="font-headline text-3xl md:text-4xl font-bold">Your Dashboard</h1>
            <p className="text-muted-foreground">Manage your artworks and view your collection.</p>
        </div>
        <Button asChild>
            <Link href="/upload">Upload New Artwork</Link>
        </Button>
      </header>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Artworks</CardTitle>
            <CardDescription>A list of all your uploaded pieces.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userArtworks.map((artwork) => (
                  <TableRow key={artwork.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={artwork.title}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={artwork.imageUrl}
                        width="64"
                        data-ai-hint={artwork.imageHint}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{artwork.title}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">{artwork.description}</TableCell>
                    <TableCell>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
