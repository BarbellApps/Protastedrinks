"use client";

import { useRef } from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import HeroCanvas from "./HeroCanvas";
import HeroTextOverlays from "./HeroTextOverlays";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    // h-[600vh] gives us 6 screens of scroll distance
    // 'offset' determines when the scroll progress maps from 0 to 1
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Calculate opacity for a scroll indicator
    const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

    return (
        <section ref={containerRef} className="relative h-[600vh]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <HeroCanvas scrollYProgress={scrollYProgress} />
                <HeroTextOverlays scrollYProgress={scrollYProgress} />

                {/* Scroll Indicator */}
                <motion.div
                    style={{ opacity: scrollIndicatorOpacity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground font-medium"
                >
                    <span className="text-sm uppercase tracking-widest text-background">Scroll to Explore</span>
                    <ChevronDown className="animate-bounce w-6 h-6 text-background" />
                </motion.div>
            </div>
        </section>
    );
}
