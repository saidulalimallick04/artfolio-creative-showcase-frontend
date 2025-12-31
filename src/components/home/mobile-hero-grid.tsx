'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import { useEffect, useState } from 'react';

export default function MobileHeroGrid() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const images = placeholderData.placeholderImages;

    // Split images into 3 rows
    const third = Math.ceil(images.length / 3);
    const row1 = images.slice(0, third);
    const row2 = images.slice(third, third * 2);
    const row3 = images.slice(third * 2);

    // Duplicate for infinite loop (ensure enough length for smooth scroll)
    const row1Multi = [...row1, ...row1, ...row1, ...row1];
    const row2Multi = [...row2, ...row2, ...row2, ...row2];
    const row3Multi = [...row3, ...row3, ...row3, ...row3];

    // Duration for animation (speed control)
    const duration = 200;

    return (
        <div className="flex flex-col gap-3 w-full lg:hidden mt-8 overflow-hidden mask-linear-gradient rotate-[-5deg] scale-110 -translate-x-2">
            {/* Row 1: Slide Right */}
            <div className="flex w-full overflow-hidden">
                <motion.div
                    animate={{ x: ["-50%", "0%"] }}
                    transition={{ repeat: Infinity, duration: duration, ease: "linear" }}
                    className="flex gap-3"
                >
                    {row1Multi.map((img, i) => (
                        <div key={`mob-r1-${img.id}-${i}`} className="relative h-24 w-32 shrink-0 rounded-lg overflow-hidden shadow-sm">
                            <Image src={img.imageUrl} alt="" fill className="object-cover" sizes="150px" priority={i < 4} />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Row 2: Slide Left */}
            <div className="flex w-full overflow-hidden">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: duration * 5, ease: "linear" }}
                    className="flex gap-3"
                >
                    {row2Multi.map((img, i) => (
                        <div key={`mob-r2-${img.id}-${i}`} className="relative h-24 w-32 shrink-0 rounded-lg overflow-hidden shadow-sm">
                            <Image src={img.imageUrl} alt="" fill className="object-cover" sizes="150px" priority={i < 4} />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Row 3: Slide Right */}
            <div className="flex w-full overflow-hidden">
                <motion.div
                    animate={{ x: ["-50%", "0%"] }}
                    transition={{ repeat: Infinity, duration: duration * 1.1, ease: "linear" }}
                    className="flex gap-3"
                >
                    {row3Multi.map((img, i) => (
                        <div key={`mob-r3-${img.id}-${i}`} className="relative h-24 w-32 shrink-0 rounded-lg overflow-hidden shadow-sm">
                            <Image src={img.imageUrl} alt="" fill className="object-cover" sizes="150px" priority={i < 4} />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
