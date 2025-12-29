import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Manage your artworks and profile on ArtFolio.',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
