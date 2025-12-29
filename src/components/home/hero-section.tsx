'use client';

import AnimatedTitle from './animated-title';
import HeroImageGrid from './hero-image-grid';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';

export default function HeroSection() {
    const { user } = useAuth();
    return (
        <div className="h-[calc(100vh-5rem)] min-h-[600px] flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden relative">

            {/* Background decoration elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />
            </div>

            {/* Left Content */}
            <div className="w-full lg:w-[40%] flex flex-col justify-center items-start z-10 space-y-8 pl-4 lg:pl-8">
                <AnimatedTitle
                    text="Welcome to ArtFolio"
                    className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1]"
                />

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
                >
                    Discover a world of creativity. A place for artists to share their digital memories, connect with others, and showcase their masterpiece to the world.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="flex flex-wrap gap-4"
                >
                    <Link href="/explore">
                        <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                            Start Exploring <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    {user ? (
                        <Link href="/upload">
                            <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg border-2 hover:bg-muted/50">
                                Create Art
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/signup">
                            <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg border-2 hover:bg-muted/50">
                                Join Community
                            </Button>
                        </Link>
                    )}
                </motion.div>
            </div>

            {/* Right Content - Image Grid */}
            <div className="w-full lg:w-[60%] flex justify-start items-center pr-0 pb-12 lg:pb-0">
                <HeroImageGrid />
            </div>
        </div>
    );
}
