'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { LandingPageSelector } from '@/components/account/landing-page-selector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Settings, Monitor, Globe, Moon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
    const { toast } = useToast();
    const [landingPage, setLandingPage] = useState('/');

    useEffect(() => {
        const stored = localStorage.getItem('landingPage');
        if (stored) setLandingPage(stored);
    }, []);

    const handleLandingPageChange = (value: string) => {
        setLandingPage(value);
        localStorage.setItem('landingPage', value);
        toast({
            description: "Landing page preference updated.",
        });
    };

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                    <Settings className="h-8 w-8" />
                    Settings
                </h1>
                <p className="text-muted-foreground mt-2">
                    Customize your application experience and preferences.
                </p>
            </div>

            <div className="grid gap-6">
                {/* General Preferences */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Monitor className="h-5 w-5 text-primary" />
                            <CardTitle>Display & Navigation</CardTitle>
                        </div>
                        <CardDescription>
                            Manage how you view and navigate ArtFolio.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Landing Page Setting */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <Label className="text-base font-medium">Default Landing Page</Label>
                                <p className="text-sm text-muted-foreground">
                                    Choose the page you want to see when you log in.
                                </p>
                            </div>
                            <div className="w-[200px]">
                                <Select value={landingPage} onValueChange={handleLandingPageChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select page" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="/">Home Feed</SelectItem>
                                        <SelectItem value="/explore">Explore</SelectItem>
                                        <SelectItem value="/profile">My Profile</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Separator />

                        {/* Placeholder for Theme - Keeping it visual for "Future Settings" */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-50 pointer-events-none">
                            <div className="space-y-1">
                                <Label className="text-base font-medium">Appearance</Label>
                                <p className="text-sm text-muted-foreground">
                                    Switch between light and dark themes.
                                </p>
                            </div>
                            <div className="w-[200px] flex items-center gap-2 border rounded-md p-2 bg-muted/20">
                                <Moon className="h-4 w-4" />
                                <span className="text-sm">System Default</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">More settings coming soon.</p>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
