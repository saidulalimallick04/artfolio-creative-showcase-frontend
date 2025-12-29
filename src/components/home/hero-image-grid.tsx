'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import { useEffect, useState } from 'react';

export default function HeroImageGrid() {
    const [mounted, setMounted] = useState(false);

    // Use a fixed subset of images to ensure consistent server/client rendering initially
    // scaling/randomness will happen via framer-motion which handles hydration reasonably well if initial is consistent
    // or we use useEffect to trigger the random spread.

    // Actually, for "appearing from random direction", we can set initial variants that are random.
    // BUT: Random values during render cause hydration mismatch.
    // Solution: Use a deterministic randomness based on index or just useEffect to set mounted.

    useEffect(() => {
        setMounted(true);
    }, []);

    // Use all images for a rich, diverse "endless" feel
    const images = placeholderData.placeholderImages;

    // Distribute images into 3 columns for the vertical slider effect
    const third = Math.ceil(images.length / 3);
    const column1 = images.slice(0, third);
    const column2 = images.slice(third, third * 2);
    const column3 = images.slice(third * 2);

    // Duplicate for infinite loop (4x to be safe for larger screens/seamlessness)
    const col1Multi = [...column1, ...column1, ...column1, ...column1];
    const col2Multi = [...column2, ...column2, ...column2, ...column2];
    const col3Multi = [...column3, ...column3, ...column3, ...column3];

    // Calculated duration based on item count to maintain consistent speed
    // Base speed: ~5s per item? 20 items * 5s = 100s
    const duration1 = column1.length * 4;
    const duration2 = column2.length * 5; // Slower
    const duration3 = column3.length * 3.5; // Faster

    return (
        <div className="hidden lg:grid grid-cols-3 gap-2 w-full max-w-[800px] mx-auto lg:mx-0 lg:-ml-80 rotate-[-8deg] h-[120%] -translate-y-[10%] overflow-hidden bg-transparent select-none p-2">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
                <motion.div
                    animate={{ y: [0, "-25%"] }} // Move 25% (one full set) of the 4-set height
                    transition={{ repeat: Infinity, duration: duration1, ease: "linear" }}
                    className="flex flex-col gap-4"
                >
                    {col1Multi.map((img, i) => (
                        <div key={`${img.id}-${i}-col1`} className="relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow-lg border-2 border-white/20">
                            <Image src={img.imageUrl} alt="" fill className="object-cover" sizes="33vw" priority={i < 4} />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Column 2 (Offset start) */}
            <div className="flex flex-col gap-4 pt-12">
                <motion.div
                    animate={{ y: [0, "-25%"] }}
                    transition={{ repeat: Infinity, duration: duration2, ease: "linear" }}
                    className="flex flex-col gap-4"
                >
                    {col2Multi.map((img, i) => (
                        <div key={`${img.id}-${i}-col2`} className="relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow-lg border-2 border-white/20">
                            <Image src={img.imageUrl} alt="" fill className="object-cover" sizes="33vw" priority={i < 4} />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4">
                <motion.div
                    animate={{ y: [0, "-25%"] }}
                    transition={{ repeat: Infinity, duration: duration3, ease: "linear" }}
                    className="flex flex-col gap-4"
                >
                    {col3Multi.map((img, i) => (
                        <div key={`${img.id}-${i}-col3`} className="relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow-lg border-2 border-white/20">
                            <Image src={img.imageUrl} alt="" fill className="object-cover" sizes="33vw" priority={i < 4} />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
