import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Up',
    description: 'Join ArtFolio and start sharing your creative journey.',
};

export default function SignupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
