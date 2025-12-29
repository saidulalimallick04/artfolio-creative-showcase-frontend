import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Upload Artwork',
    description: 'Share your creativity with the world. Upload your artwork to ArtFolio.',
};

export default function UploadLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
