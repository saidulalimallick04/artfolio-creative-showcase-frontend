'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface LandingPageSelectorProps {
    closeDialog: () => void;
    // Callback to update the parent state immediately for UI feedback
    onUpdate: (label: string) => void;
}

export function LandingPageSelector({ closeDialog, onUpdate }: LandingPageSelectorProps) {
    const [value, setValue] = useState('/');
    const { toast } = useToast();

    useEffect(() => {
        const stored = localStorage.getItem('landingPage');
        if (stored) setValue(stored);
    }, []);

    const handleSave = () => {
        localStorage.setItem('landingPage', value);

        // Determine user-friendly label
        let label = "Home Feed";
        if (value === '/explore') label = "Explore";
        if (value === '/profile') label = "My Profile";

        onUpdate(label);

        toast({
            description: "Preference saved successfully.",
        });
        closeDialog();
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Choose where you land after login</Label>
                <Select value={value} onValueChange={setValue}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="/">Home Feed (Default)</SelectItem>
                        <SelectItem value="/explore">Explore</SelectItem>
                        <SelectItem value="/profile">My Profile</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button onClick={handleSave}>Save Preference</Button>
            </div>
        </div>
    );
}
