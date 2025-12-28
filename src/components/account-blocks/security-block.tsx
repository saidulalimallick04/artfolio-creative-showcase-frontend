'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types/api';

interface SecurityBlockProps {
    user: User;
}

export function SecurityBlock({ user }: SecurityBlockProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Private account details. Contact support to change.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="username" className="text-base font-semibold">Username</Label>
                        <Button variant="ghost" size="sm" disabled className="text-xs h-8">Edit (Coming Soon)</Button>
                    </div>
                    <Input id="username" value={user.username} disabled className="bg-muted font-medium" />
                </div>

                <div className="grid gap-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
                        <Button variant="ghost" size="sm" disabled className="text-xs h-8">Contact Support to Change</Button>
                    </div>
                    <Input id="email" value={user.email} disabled className="bg-muted font-medium" />
                    <p className="text-[0.8rem] text-muted-foreground mt-1">
                        Your email is kept private and used for login and notifications.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
