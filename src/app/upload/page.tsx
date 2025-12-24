'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUp } from 'lucide-react';

export default function UploadPage() {
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

  return (
    <div className="container mx-auto px-4 py-8">
       <header className="mb-8 max-w-2xl mx-auto text-center">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Upload New Artwork</h1>
        <p className="text-muted-foreground mt-2">Add a new piece to your creative collection. Fill out the details and upload your file.</p>
      </header>
      
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
            <Card>
                <CardHeader>
                <CardTitle>Artwork Details</CardTitle>
                <CardDescription>Provide information about your new piece.</CardDescription>
                </CardHeader>
                <CardContent>
                <form className="grid gap-6">
                    <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="My masterpiece" />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe your artwork, the inspiration behind it, or the techniques you used." />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="picture">Artwork File</Label>
                    <Input id="picture" type="file" className="file:text-primary file:font-medium" />
                    </div>
                    <Button className="w-full" type="submit" size="lg">
                    <FileUp className="mr-2 h-4 w-4" /> Upload Artwork
                    </Button>
                </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
