'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updateAccountDetails } from '@/actions/accounts_action';
import { Loader2 } from 'lucide-react';
import { User } from '@/types/api';

interface PersonalInfoBlockProps {
    user: User;
    onUpdate: (user: User) => void;
}

export function PersonalInfoBlock({ user, onUpdate }: PersonalInfoBlockProps) {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user.full_name || '',
        bio: user.bio || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        const data = new FormData();
        data.append('full_name', formData.full_name);
        data.append('bio', formData.bio);

        const result = await updateAccountDetails(data);

        if (result.success && result.data) {
            toast({ title: 'Personal info updated!' });
            onUpdate(result.data);
            setIsEditing(false);
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
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Manage your public identity.</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    {isEditing ? (
                        <Input
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="e.g. Jane Doe"
                        />
                    ) : (
                        <p className="text-sm">{user.full_name || 'Not set'}</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                        <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself..."
                            className="resize-none min-h-[100px]"
                        />
                    ) : (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{user.bio || 'No bio provided.'}</p>
                    )}
                </div>

                {isEditing && (
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
