'use client';

import { motion } from 'framer-motion';

type AnimatedTitleProps = {
    text: string;
    className?: string;
};

export default function AnimatedTitle({ text, className = '' }: AnimatedTitleProps) {
    // Split text into words and then characters to handle spacing correctly
    const words = text.split(' ');

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}
            variants={container}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {words.map((word, index) => (
                <motion.span key={index} style={{ display: 'flex', marginRight: '0.25em' }}>
                    {word.split('').map((character, index) => (
                        <motion.span variants={child} key={index}>
                            {character}
                        </motion.span>
                    ))}
                </motion.span>
            ))}
        </motion.div>
    );
}
