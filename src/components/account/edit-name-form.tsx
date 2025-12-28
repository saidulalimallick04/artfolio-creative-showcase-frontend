'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateAccountDetails } from '@/actions/accounts_action';
import { Loader2 } from 'lucide-react';
import { User } from '@/types/api';

interface EditNameFormProps {
    user: User;
    onUpdate: (user: User) => void;
    closeDialog: () => void;
}

export function EditNameForm({ user, onUpdate, closeDialog }: EditNameFormProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState(user.full_name || '');

    const handleSave = async () => {
        setLoading(true);
        const data = new FormData();
        data.append('full_name', fullName);
        // Be careful not to wipe other fields if the backend requires all fields.
        // Assuming backend PATCH behavior or robust handling.
        // If backend requires bio to be present, we might need to send it too.
        // Looking at previous `PersonalInfoBlock`, it sent BOTH.
        // Let's send current bio as well to be safe, or check backend implementation.
        // Implementation Plan: "Small form components for updating SPECIFIC fields".
        // I will send both to be safe against overwrites if the backend isn't true PATCH.
        data.append('bio', user.bio || '');

        const result = await updateAccountDetails(data);

        if (result.success && result.data) {
            toast({ title: 'Name updated successfully!' });
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
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                    id="full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jane Doe"
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
