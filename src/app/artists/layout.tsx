import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Artists',
    description: 'Discover talented artists and creators on ArtFolio.',
};

export default function ArtistsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
