import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';
import { TokenRefresher } from '@/components/auth/TokenRefresher';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import ScrollProgress from '@/components/scroll-progress';
import Footer from '@/components/layout/footer';
import BottomNav from '@/components/layout/bottom-nav';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: {
    default: 'ArtFolio',
    template: '%s - ArtFolio',
  },
  description: 'A creative showcase for artists to share their work.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <TokenRefresher />
            <div className="flex min-h-screen flex-col pb-20 md:pb-0">
              <ScrollProgress />
              <Header />
              <main className="flex-1 pt-20">{children}</main>
              <Footer />
              <BottomNav />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
