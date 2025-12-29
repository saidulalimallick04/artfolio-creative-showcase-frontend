import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Artworks',
    description: 'Explore a vast collection of creative artworks on ArtFolio.',
};

export default function ExploreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
