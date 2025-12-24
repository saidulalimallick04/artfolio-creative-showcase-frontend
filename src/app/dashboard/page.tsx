'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { getArtworksByUsername } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileUp, MoreHorizontal } from 'lucide-react';

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
      <header className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Your Dashboard</h1>
        <p className="text-muted-foreground">Manage your artworks and upload new ones.</p>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Artwork</CardTitle>
              <CardDescription>Add a new piece to your collection.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="My masterpiece" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="About this piece..." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="picture">Artwork File</Label>
                  <Input id="picture" type="file" />
                </div>
                <Button className="w-full" type="submit">
                  <FileUp className="mr-2 h-4 w-4" /> Upload
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
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
    </div>
  );
}
