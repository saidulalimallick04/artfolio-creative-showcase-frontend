'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updateAccountDetails } from '@/actions/accounts_action';
import { Loader2 } from 'lucide-react';
import { User } from '@/types/api';

interface EditBioFormProps {
    user: User;
    onUpdate: (user: User) => void;
    closeDialog: () => void;
}

export function EditBioForm({ user, onUpdate, closeDialog }: EditBioFormProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [bio, setBio] = useState(user.bio || '');

    const handleSave = async () => {
        setLoading(true);
        const data = new FormData();
        // Sending full_name to preserve it
        data.append('full_name', user.full_name || '');
        data.append('bio', bio);

        const result = await updateAccountDetails(data);

        if (result.success && result.data) {
            toast({ title: 'Bio updated successfully!' });
            onUpdate(result.data);
            closeDialog();
        } else {
            toast({ title: 'Update failed', description: result.error, variant: 'destructive' });
        }
        setLoading(false);
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the world about yourself..."
                    className="min-h-[120px] resize-none"
                />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={closeDialog}>Cancel</Button>
                <Button onClick={handleSave} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save
                </Button>
            </div>
        </div>
    );
}
