'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { FileUp } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  artwork: z
    .any()
    .refine((files) => files?.length == 1, 'Artwork file is required.')
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (files) => ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      'Only .jpg, .png, and .webp formats are supported.'
    ),
});

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

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
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically handle the file upload to a server/service
    console.log('Form submitted:', values);
    toast({
      title: 'Upload Successful!',
      description: `Your artwork "${values.title}" has been submitted.`,
    });
    // For now, just reset the form and redirect to dashboard
    form.reset();
    router.push('/dashboard');
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
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="My masterpiece" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Describe your artwork, the inspiration behind it, or the techniques you used." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="artwork"
                          render={({ field }) => {
                            // We need to manage the file input's value manually
                            const { ref, onChange, ...rest } = field;
                            return (
                              <FormItem>
                                <FormLabel>Artwork File</FormLabel>
                                <FormControl>
                                  <Input
                                    type="file"
                                    className="file:text-primary file:font-medium"
                                    onChange={(e) => onChange(e.target.files)}
                                    {...rest}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )
                          }}
                        />
                      <Button className="w-full" type="submit" size="lg">
                        <FileUp className="mr-2 h-4 w-4" /> Upload Artwork
                      </Button>
                    </form>
                  </Form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
