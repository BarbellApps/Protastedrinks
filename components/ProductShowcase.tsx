"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import InfoSections from "./InfoSections";
import Image from "next/image";

export default function ProductShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Desktop Motion Values
    // x position: starts right (50%), moves left (-25%), moves right (25%), centers (0%)
    const xDesktop = useTransform(
        scrollYProgress,
        [0, 0.2, 0.5, 0.8, 1],
        ["30%", "25%", "-25%", "25%", "0%"]
    );

    // Mobile Motion Values (simplified)
    const xMobile = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", "0%"]
    );

    // Scale: start slightly larger, settle to normal
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

    // Opacity: Fade in slightly at start to ensure smoothness from hero
    const opacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

    return (
        <div ref={containerRef} className="relative bg-background">
            {/* Sticky Product Container */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                    {/* Desktop Product */}
                    <motion.div
                        style={{ x: xDesktop, scale, opacity }}
                        className="hidden md:block relative w-[30vh] h-[55vh] max-h-[600px] z-10"
                    >
                        <Image
                            src="/images/product-static.png"
                            alt="Drankenreclame Product"
                            fill
                            style={{ objectFit: "contain" }}
                            priority
                        />
                    </motion.div>

                    {/* Mobile Product - Centered and smaller */}
                    <motion.div
                        style={{ x: xMobile, scale, opacity }}
                        className="md:hidden relative w-[20vh] h-[35vh] z-10 mt-12 opacity-50" // Lower opacity on mobile so text is readable over it if needed
                    >
                        <Image
                            src="/images/product-static.png"
                            alt="Drankenreclame Product"
                            fill
                            style={{ objectFit: "contain" }}
                            priority
                        />
                    </motion.div>

                </div>
            </div>

            {/* Content Layer - ensure high enough z-index or spacing so text is clickable/readable */}
            <div className="relative z-20 pt-20">
                <InfoSections />
            </div>
        </div>
    );
}
