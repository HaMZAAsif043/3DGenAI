'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ModelSkeleton() {
    return (
        <div className="w-full h-full min-h-[500px] bg-zinc-50 rounded-3xl overflow-hidden relative border border-zinc-200 flex items-center justify-center">
            {/* Shimmering Container */}
            <div className="relative w-64 h-64">
                {/* Base "Ghost" Model Shape */}
                <motion.div
                    animate={{
                        scale: [0.95, 1.05, 0.95],
                        rotateY: [0, 180, 360],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-full h-full bg-zinc-200 rounded-full blur-3xl"
                />

                {/* Central Pulsing Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-4 border-zinc-200 border-t-accent rounded-full animate-spin" />
                </div>
            </div>

            {/* Floating Labels */}
            <div className="absolute top-8 left-8 flex flex-col gap-2">
                <div className="w-24 h-4 bg-zinc-100 rounded-full overflow-hidden relative">
                    <Shimmer />
                </div>
                <div className="w-16 h-3 bg-zinc-100 rounded-full overflow-hidden relative">
                    <Shimmer />
                </div>
            </div>

            <div className="absolute bottom-8 right-8 flex gap-2">
                <div className="w-20 h-8 bg-zinc-100 rounded-xl overflow-hidden relative">
                    <Shimmer />
                </div>
                <div className="w-20 h-8 bg-zinc-100 rounded-xl overflow-hidden relative">
                    <Shimmer />
                </div>
            </div>
        </div>
    );
}

function Shimmer() {
    return (
        <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        />
    );
}
