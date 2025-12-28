'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { getAccountDetails } from '@/actions/accounts_action';
import { User } from '@/types/api';
import { Loader2 } from 'lucide-react';
import { ProfileSidebar } from '@/components/account/profile-sidebar';
import { InfoCard } from '@/components/account/info-card';
import { EditNameForm } from '@/components/account/edit-name-form';
import { EditBioForm } from '@/components/account/edit-bio-form';

export default function AccountPage() {
    const { user: authUser, updateUser } = useAuth();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authUser) {
            router.push('/login');
            return;
        }

        const fetchDetails = async () => {
            const result = await getAccountDetails();
            if (result.success && result.data) {
                setUser(result.data);
            }
            setLoading(false);
        };

        fetchDetails();
    }, [authUser, router]);

    const handleUserUpdate = (updatedUser: User) => {
        setUser(updatedUser);
        updateUser(updatedUser);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-4 h-[300px] bg-muted rounded-xl animate-pulse" />
                    <div className="lg:col-span-8 space-y-4">
                        <div className="h-24 bg-muted rounded-xl animate-pulse" />
                        <div className="h-24 bg-muted rounded-xl animate-pulse" />
                        <div className="h-24 bg-muted rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8 text-center bg-destructive/10 rounded-lg">
                <p className="text-destructive">Failed to load account information. Please try refreshing.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <header className="mb-10 text-center md:text-left">
                <h1 className="font-headline text-3xl md:text-4xl font-bold">Account Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your profile and public presence.</p>
            </header>

            <div className="grid gap-8 grid-cols-1 lg:grid-cols-12 items-start">

                {/* Left Column: Sticky Sidebar */}
                <div className="lg:col-span-4">
                    <ProfileSidebar user={user} onUpdate={handleUserUpdate} />
                </div>

                {/* Right Column: Info Cards */}
                <div className="lg:col-span-8 space-y-6">
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-foreground/80 flex items-center gap-2 after:h-px after:flex-1 after:bg-border/50 after:ml-4">
                            Details
                        </h3>
                        <div className="grid gap-4">

                            {/* Full Name */}
                            <InfoCard
                                label="Full Name"
                                value={user.full_name}
                                dialogTitle="Edit Full Name"
                                dialogDescription="This is your public display name."
                            >
                                {(close) => (
                                    <EditNameForm
                                        user={user}
                                        onUpdate={handleUserUpdate}
                                        closeDialog={close}
                                    />
                                )}
                            </InfoCard>

                            {/* Bio */}
                            <InfoCard
                                label="Bio"
                                value={user.bio}
                                dialogTitle="Edit Bio"
                                dialogDescription="Write a short biography to introduce yourself."
                            >
                                {(close) => (
                                    <EditBioForm
                                        user={user}
                                        onUpdate={handleUserUpdate}
                                        closeDialog={close}
                                    />
                                )}
                            </InfoCard>

                        </div>
                    </section>

                    <section className="pt-4">
                        <h3 className="text-lg font-semibold mb-4 text-foreground/80 flex items-center gap-2 after:h-px after:flex-1 after:bg-border/50 after:ml-4">
                            Account Access
                        </h3>
                        <div className="grid gap-4">

                            {/* Username (Locked) */}
                            <InfoCard
                                label="Username"
                                value={`@${user.username}`}
                                dialogTitle="Change Username"
                                isEditable={false}
                            >
                                {() => null}
                            </InfoCard>

                            {/* Email (Locked) */}
                            <InfoCard
                                label="Email Address"
                                value={user.email}
                                dialogTitle="Change Email"
                                isEditable={false}
                            >
                                {() => null}
                            </InfoCard>

                        </div>
                        <p className="text-xs text-muted-foreground mt-3 px-2">
                            To change your username or email, please contact support.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
