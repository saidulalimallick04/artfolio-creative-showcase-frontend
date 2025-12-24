'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { FileUp, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  artwork: z
    .any()
    .refine((files) => files?.length == 1, 'Artwork file is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .png, and .webp formats are supported.'
    ),
});

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const artworkFile = form.watch('artwork');

  useEffect(() => {
    if (artworkFile && artworkFile.length > 0) {
      const file = artworkFile[0];
      if (file && ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        
        return () => URL.revokeObjectURL(previewUrl);
      }
    } else {
      setImagePreview(null);
    }
  }, [artworkFile]);

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
    console.log('Form submitted:', values);
    toast({
      title: 'Upload Successful!',
      description: `Your artwork "${values.title}" has been submitted.`,
    });
    form.reset();
    setImagePreview(null);
    router.push('/dashboard');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 max-w-4xl mx-auto text-center">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Upload New Artwork</h1>
        <p className="text-muted-foreground mt-2">Add a new piece to your creative collection. Fill out the details and upload your file.</p>
      </header>
      
      <div className="mx-auto max-w-5xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
              {/* Image Preview and Upload Column */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="artwork"
                  render={({ field: { onChange, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Artwork File</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="artwork-upload"
                            type="file"
                            className="sr-only"
                            accept={ACCEPTED_IMAGE_TYPES.join(',')}
                            onChange={(e) => onChange(e.target.files)}
                            {...rest}
                          />
                          <label
                            htmlFor="artwork-upload"
                            className={cn(
                              "aspect-[4/5] w-full rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer transition-colors",
                              "hover:border-primary hover:bg-accent/50",
                              { "border-solid border-border bg-card p-2": imagePreview }
                            )}
                          >
                            {imagePreview ? (
                              <Image
                                src={imagePreview}
                                alt="Artwork preview"
                                width={400}
                                height={500}
                                className="w-full h-full object-contain rounded-md"
                              />
                            ) : (
                              <div className="text-center text-muted-foreground p-4">
                                <ImageIcon className="mx-auto h-12 w-12 mb-4" />
                                <p className="font-semibold">Click to upload or drag & drop</p>

                                <p className="text-xs mt-1">PNG, JPG, or WEBP (max 5MB)</p>
                              </div>
                            )}
                          </label>
                          {imagePreview && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-4 right-4 h-8 w-8 rounded-full"
                              onClick={() => {
                                form.setValue('artwork', null);
                                form.resetField('artwork');
                              }}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove image</span>
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Form Fields Column */}
              <div className="space-y-6 flex flex-col">
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Artwork Details</CardTitle>
                        <CardDescription>Provide information about your new piece.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                              <Textarea 
                                placeholder="Describe your artwork, the inspiration behind it, or the techniques you used." 
                                className="min-h-[150px] resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                </Card>
                <Button className="w-full" type="submit" size="lg">
                  <FileUp className="mr-2 h-4 w-4" /> Upload Artwork
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
