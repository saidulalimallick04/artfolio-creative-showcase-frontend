import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'View user profiles on ArtFolio.',
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
