import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Search',
    description: 'Find artworks and artists on ArtFolio.',
};

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
