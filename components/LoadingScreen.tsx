"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
    progress: number;
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
    // Wave animation variants.
    // We animate the "y" or "d" (path) to simulate moving water.
    // For simplicity, we'll use a CSS-based translate on a large wave SVG.

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
            initial={{ y: 0 }}
            exit={{
                y: "-100%",
                transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
        >
            <div className="relative flex flex-col items-center">
                {/* Bottle/Glass Container Outline */}
                <div className="relative w-24 h-40 border-4 border-coffee rounded-b-3xl rounded-t-lg overflow-hidden backdrop-blur-sm">
                    {/* Liquid Fill */}
                    <motion.div
                        className="absolute bottom-0 left-0 w-full bg-coffee"
                        initial={{ height: "0%" }}
                        animate={{ height: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    >
                        {/* Bubbles / Froth Effect (Optional, can be added later) */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-white/20 animate-pulse" />
                    </motion.div>
                </div>

                {/* Percentage Text */}
                <motion.div
                    className="mt-4 font-heading text-4xl text-coffee"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {Math.round(progress)}%
                </motion.div>

                <p className="mt-2 text-sm uppercase tracking-widest text-coffee/60">
                    Pouring Experience...
                </p>
            </div>
        </motion.div>
    );
}
