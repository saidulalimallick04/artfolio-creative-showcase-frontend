'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateAccountDetails } from '@/actions/accounts_action';
import { Loader2, Camera, Upload } from 'lucide-react';
import { User } from '@/types/api';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface ProfileSidebarProps {
    user: User;
    onUpdate: (user: User) => void;
}

export function ProfileSidebar({ user, onUpdate }: ProfileSidebarProps) {
    const { toast } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit
                toast({
                    variant: "destructive",
                    title: "File too large",
                    description: "Please select an image under 4MB.",
                });
                return;
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSave = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('profile_image', file);

        const result = await updateAccountDetails(formData);

        if (result.success && result.data) {
            toast({ title: 'Profile image updated!' });
            onUpdate(result.data);
            setOpen(false);
            setFile(null);
            setPreview(null);
        } else {
            toast({ title: 'Update failed', description: result.error, variant: 'destructive' });
        }
        setLoading(false);
    };

    return (
        <div className="sticky top-24 flex flex-col items-center p-6 bg-card rounded-xl border shadow-sm">
            <div className="relative group">
                <Avatar className="h-40 w-40 border-4 border-background shadow-lg">
                    <AvatarImage
                        src={user.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                        className="object-cover"
                    />
                    <AvatarFallback className="text-4xl">{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute bottom-1 right-1 h-10 w-10 rounded-full shadow-md hover:scale-105 transition-transform"
                        >
                            <Camera className="h-5 w-5" />
                            <span className="sr-only">Change Profile Picture</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Profile Picture</DialogTitle>
                            <DialogDescription>Upload a new image for your profile.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="flex justify-center mb-4">
                                <Avatar className="h-32 w-32 border-2 border-border">
                                    <AvatarImage src={preview || user.profile_image || ''} className="object-cover" />
                                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
                                <Label htmlFor="picture">Picture</Label>
                                <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button onClick={handleSave} disabled={loading || !file} className="w-full">
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save New Image
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="mt-6 text-center space-y-1">
                <h2 className="text-xl font-bold font-headline">{user.username}</h2>
                <p className="text-sm text-muted-foreground">{user.full_name || 'No Name Set'}</p>
                <div className="pt-2">
                    <p className="text-xs text-muted-foreground bg-muted py-1 px-3 rounded-full inline-block">Artist Account</p>
                </div>
            </div>
        </div>
    );
}
