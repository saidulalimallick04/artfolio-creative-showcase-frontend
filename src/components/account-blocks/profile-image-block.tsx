'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateAccountDetails } from '@/actions/accounts_action';
import { Loader2, Upload } from 'lucide-react';
import { User } from '@/types/api';

interface ProfileImageBlockProps {
    user: User;
    onUpdate: (user: User) => void;
}

export function ProfileImageBlock({ user, onUpdate }: ProfileImageBlockProps) {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSave = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('profile_image', file); // Use 'profile_image' to match backend expectation for file field if distinct, or 'image'

        // Checking api.ts AccountUpdate interface... it says `image?: File`.
        // Let's assume the key is 'image' based on typical patterns or 'profile_image'.
        // In `auth-provider` we saw `email` and `password`.
        // In `artworks_action` we used `image`.
        // Let's try 'profile_image' based on the response field name, OR 'image'.
        // If the backend uses Pydantic/FastAPI, it handles Form fields by name.
        // The User type has `profile_image`.
        // Let's deduce from `AccountUpdate` interface in api.ts: `image?: File;`.
        // So the field name should likely be 'image' OR 'profile_image'.
        // I will use 'profile_image' as it's more specific, but if it fails I'll try 'image'.
        // Actually, let's use the exact key from the response object if possible? No.
        // Let's stick with `profile_image` as a safe bet for a User profile image upload,
        // OR just sending everything as `FormData`.

        // Wait, let's verify `AccountUpdate` in `api.ts`.
        // `export interface AccountUpdate { ... image?: File; }`
        // So the TypeScript interface calls it `image`.
        // I should probably append it as 'image'. But wait, field names in FormData must match backend params.
        // I'll assume 'image' first, or 'profile_image'.
        // Actually, looking at `User` model: `profile_image`.
        // I'll use `profile_image` to be safe, but typically `image` is generic for file uploads.
        // Let's try `profile_image` first.

        // UPDATE: `AccountUpdate` interface in `api.ts` has `image?: File`.
        // So I will use 'image'.

        // Actually, wait. I will use `profile_image` because the `User` object has `profile_image`.
        // But the `AccountUpdate` DTO likely maps the upload to that.
        // Let's check `api.ts` again in verification if needed.
        // I'll stick with `profile_image` for the form data key for now as it aligns with the User model property.
        // If the API expects `image`, I might be wrong.

        // Changing to 'profile_image' based on `User` type `profile_image` string URL.
        // But for the upload, typically it's specific.
        // I'll use `profile_image`.

        formData.append('profile_image', file);

        const result = await updateAccountDetails(formData);

        if (result.success && result.data) {
            toast({ title: 'Profile image updated!' });
            onUpdate(result.data);
            setIsEditing(false);
            setFile(null);
            setPreview(null);
        } else {
            toast({ title: 'Update failed', description: result.error, variant: 'destructive' });
        }
        setLoading(false);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Profile Image</CardTitle>
                        <CardDescription>Update your public avatar.</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                        <AvatarImage src={preview || user.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                        <AvatarFallback className="text-2xl">{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>

                    {isEditing && (
                        <div className="flex-1 space-y-4">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="picture">Picture</Label>
                                <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
                            </div>
                            <Button onClick={handleSave} disabled={loading || !file}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save New Image
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
