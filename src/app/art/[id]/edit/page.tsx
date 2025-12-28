'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { getArtworkById, updateArtwork } from '@/actions/artworks_action';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { FileUp, Image as ImageIcon, Loader2, ArrowLeft, Upload, Save, Eye, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const formSchema = z.object({
    title: z.string().min(1, { message: 'Title is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
    artwork: z
        .any()
        .optional()
        .refine((files) => !files || files.length === 0 || files.length === 1, 'Max 1 file.')
        .refine((files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
            'Only .jpg, .png, and .webp formats are supported.'
        ),
});

export default function EditArtworkPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [initialData, setInitialData] = useState<{ title: string; description: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    useEffect(() => {
        async function fetchArtwork() {
            const result = await getArtworkById(id);
            if (result.success && result.data) {
                form.reset({
                    title: result.data.title || '',
                    description: result.data.description || '',
                });
                setImagePreview(result.data.image_url);
                setOriginalImageUrl(result.data.image_url);
                setInitialData({
                    title: result.data.title || '',
                    description: result.data.description || '',
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to load artwork details.',
                    variant: 'destructive',
                });
                router.push('/dashboard');
            }
            setIsLoading(false);
        }
        fetchArtwork();
    }, [id, form, toast, router]);

    const artworkFile = form.watch('artwork');

    useEffect(() => {
        if (artworkFile && artworkFile.length > 0) {
            const file = artworkFile[0];
            if (file && ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                const previewUrl = URL.createObjectURL(file);
                setImagePreview(previewUrl);
                return () => URL.revokeObjectURL(previewUrl);
            }
        } else if (originalImageUrl) {
            setImagePreview(originalImageUrl);
        }
    }, [artworkFile, originalImageUrl]);

    const handleResetImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        form.resetField('artwork'); // Clear the file input and reset dirty state
        // The effect above will handle resetting the preview to originalImageUrl
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            if (values.artwork && values.artwork.length > 0) {
                formData.append('image', values.artwork[0]);
            }

            const result = await updateArtwork(id, formData);

            if (result.success) {
                toast({
                    title: 'Update Successful',
                    description: `Artwork "${values.title}" has been updated.`,
                });
                router.push('/dashboard');
                router.refresh();
            } else {
                toast({
                    title: 'Update Failed',
                    description: result.error || 'Something went wrong.',
                    variant: 'destructive',
                });
            }
        } catch (e) {
            toast({
                title: 'Error',
                description: 'Failed to update artwork.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="min-h-screen bg-muted/30 relative">
            {/* Background Ambience */}
            <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
            {imagePreview && (
                <div className="fixed inset-0 w-full h-full -z-20 overflow-hidden pointer-events-none">
                    <Image
                        src={imagePreview}
                        alt="Background"
                        fill
                        className="object-cover opacity-[0.03] blur-3xl scale-110"
                    />
                </div>
            )}


            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <Button asChild variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary transition-colors">
                        <Link href={`/dashboard`} className="flex items-center gap-2">
                            <ArrowLeft className="h-5 w-5" />
                            <span className="text-lg font-medium">Back to Dashboard</span>
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Header Section (Mobile only, or separate) -- Actually let's integrate it */}

                    {/* Left Column: Image Preview (Sticky) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6 order-2 lg:order-1">
                        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border p-2 shadow-sm">
                            <div className="aspect-[4/5] relative rounded-xl overflow-hidden bg-muted group">
                                {imagePreview ? (
                                    <>
                                        <Image
                                            src={imagePreview}
                                            alt="Artwork preview"
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="text-white text-center p-4">
                                                <Eye className="h-8 w-8 mx-auto mb-2 opacity-80" />
                                                <p className="font-semibold text-lg">Current Preview</p>
                                                <p className="text-sm opacity-80">This is how your art looks</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                        <ImageIcon className="h-16 w-16 mb-4 opacity-50" />
                                        <p>No image selected</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-center px-4">
                            <p className="text-sm text-muted-foreground">
                                "Art is not what you see, but what you make others see." — Edgar Degas
                            </p>
                        </div>
                    </div>


                    {/* Right Column: Edit Form */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <Card className="border-none shadow-xl bg-card/80 backdrop-blur-md overflow-hidden">
                            {/* Decorative header gradient */}
                            <div className="h-2 w-full bg-gradient-to-r from-primary to-primary/50" />
                            <CardHeader className="pb-8 pt-8 px-8 md:px-10">
                                <CardTitle className="font-headline text-3xl md:text-4xl font-bold">
                                    Edit Details
                                </CardTitle>
                                <CardDescription className="text-base mt-2">
                                    Refine the story behind your masterpiece. Update the title, description, or swap the image.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="px-8 md:px-10 pb-10">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                        {/* Image Upload Field */}
                                        <FormField
                                            control={form.control}
                                            name="artwork"
                                            render={({ field: { value, onChange, ...rest } }) => (
                                                <FormItem>
                                                    <FormLabel className="text-base font-semibold">Change Image (Optional)</FormLabel>
                                                    <FormControl>
                                                        <div className="space-y-3">
                                                            <div className="relative group cursor-pointer">
                                                                <Input
                                                                    id="artwork-upload"
                                                                    type="file"
                                                                    className="sr-only"
                                                                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                                                    onChange={(e) => onChange(e.target.files)}
                                                                    onClick={(e) => { (e.target as HTMLInputElement).value = '' }} // Fix: Allow re-selecting the same file
                                                                    {...rest}
                                                                />
                                                                <label
                                                                    htmlFor="artwork-upload"
                                                                    className={cn(
                                                                        "flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-muted-foreground/20 transition-all",
                                                                        "hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                                                                    )}
                                                                >
                                                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                                        <Upload className="h-6 w-6" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-foreground">Click to upload a new file</p>
                                                                        <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG or WEBP (Max 5MB)</p>
                                                                    </div>
                                                                </label>
                                                            </div>

                                                            {/* Selected File Info & Reset */}
                                                            <div className="space-y-3">
                                                                {imagePreview && (
                                                                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted lg:hidden">
                                                                        <Image
                                                                            src={imagePreview}
                                                                            alt="Preview"
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    </div>
                                                                )}

                                                                {artworkFile && artworkFile.length > 0 && (
                                                                    <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border animate-in fade-in slide-in-from-top-2">
                                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                                            <div className="h-8 w-8 rounded bg-background border flex items-center justify-center shrink-0">
                                                                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                                            </div>
                                                                            <span className="text-sm font-medium truncate max-w-[180px] sm:max-w-xs">
                                                                                {artworkFile[0].name}
                                                                            </span>
                                                                        </div>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={handleResetImage}
                                                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                                                                            title="Reset to original image"
                                                                        >
                                                                            <X className="h-4 w-4 mr-1" />
                                                                            <span className="text-xs">Reset</span>
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="space-y-6">
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Title</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Name your masterpiece"
                                                                {...field}
                                                                className="h-12 text-lg bg-background/50 focus:bg-background transition-all"
                                                            />
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
                                                        <FormLabel className="text-base font-semibold">Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="What inspired this piece? Share its story..."
                                                                className="min-h-[180px] text-base resize-none bg-background/50 focus:bg-background transition-all leading-relaxed p-4"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="pt-4 flex gap-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="lg"
                                                className="flex-1 h-12 text-base rounded-full"
                                                onClick={() => router.back()}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                size="lg"
                                                disabled={isSubmitting || !form.formState.isDirty}
                                                className="flex-[2] h-12 text-base rounded-full shadow-lg hover:shadow-xl transition-all"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving Changes...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="mr-2 h-5 w-5" /> Save Update
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
