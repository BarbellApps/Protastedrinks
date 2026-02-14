"use client";

import { MotionValue, motion, useTransform } from "framer-motion";

interface HeroTextOverlaysProps {
    scrollYProgress: MotionValue<number>;
}

// Reusable Slide Component
function TextSlide({
    range,
    lines,
    scrollYProgress,
    className = "", // Optional className for generic styling
    textClassFirst = "",
    textClassSecond = ""
}: {
    range: [number, number, number, number];
    lines: [React.ReactNode, React.ReactNode];
    scrollYProgress: MotionValue<number>;
    className?: string;
    textClassFirst?: string;
    textClassSecond?: string;
}) {
    const [start, enterEnd, exitStart, end] = range;

    // Opacity: Fade in -> Hold -> Fade out
    const opacity = useTransform(scrollYProgress, range, [0, 1, 1, 0]);

    // Zoom Effect: Continuous zoom in while visible - Significantly increased scale for dramatic effect
    const scale = useTransform(scrollYProgress, [start, end], [0.8, 2.5]);

    // Slide Animations
    // Line 1: From Left (-100vw) to Center (0) then STAYS at Center (0) while fading out
    const x1 = useTransform(scrollYProgress, [start, enterEnd, exitStart, end], ["-50%", "0%", "0%", "0%"]);

    // Line 2: From Right (100vw) to Center (0) then STAYS at Center (0) while fading out
    const x2 = useTransform(scrollYProgress, [start, enterEnd, exitStart, end], ["50%", "0%", "0%", "0%"]);

    return (
        <motion.div
            style={{ opacity, scale }}
            className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none ${className}`}
        >
            <motion.div style={{ x: x1 }} className="w-full">
                <h2 className={`font-heading font-bold drop-shadow-lg leading-[0.9] ${textClassFirst}`}>
                    {lines[0]}
                </h2>
            </motion.div>
            <motion.div style={{ x: x2 }} className="w-full">
                <h2 className={`font-heading font-bold drop-shadow-lg leading-[0.9] ${textClassSecond}`}>
                    {lines[1]}
                </h2>
            </motion.div>
        </motion.div>
    );
}

export default function HeroTextOverlays({ scrollYProgress }: HeroTextOverlaysProps) {
    return (
        <div className="absolute inset-0 pointer-events-none">

            {/* Slide 1: YOUR BRAND. YOUR DRINK. */}
            <TextSlide
                range={[0.05, 0.1, 0.2, 0.25]}
                scrollYProgress={scrollYProgress}
                lines={["YOUR BRAND.", "YOUR DRINK."]}
                textClassFirst="text-5xl sm:text-7xl md:text-9xl text-white"
                textClassSecond="text-5xl sm:text-7xl md:text-9xl text-white"
            />

            {/* Slide 2: PRIVATE LABEL BEVERAGES */}
            <TextSlide
                range={[0.3, 0.35, 0.45, 0.5]}
                scrollYProgress={scrollYProgress}
                lines={["PRIVATE LABEL", "BEVERAGES"]}
                textClassFirst="text-5xl sm:text-7xl md:text-9xl text-white"
                textClassSecond="text-5xl sm:text-7xl md:text-9xl text-white"
            />

            {/* Slide 3: FULL-COLOR PRINT EUROPEAN PRODUCTION */}
            <TextSlide
                range={[0.55, 0.6, 0.7, 0.75]}
                scrollYProgress={scrollYProgress}
                lines={["FULL-COLOR PRINT", <span key="euro" className="text-white">EUROPEAN PRODUCTION</span>]}
                textClassFirst="text-4xl sm:text-6xl md:text-8xl text-white"
                textClassSecond="text-4xl sm:text-6xl md:text-8xl text-white"
            />

            {/* Slide 4: REQUEST A QUOTE IN MINUTES */}
            {/* This one needs special handling for the button or we just animate text and keep button static? 
           User said "all the hero text". The button is part of the final slide.
           Let's use the same pattern for text. The button can fade in with the container.
       */}
            <LastSlide scrollYProgress={scrollYProgress} />

        </div>
    );
}

function LastSlide({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
    const range = [0.8, 0.85, 0.95, 1];
    const [start, enterEnd] = range; // Ends at 1, so no exit phase really

    const opacity = useTransform(scrollYProgress, range, [0, 1, 1, 1]);
    const scale = useTransform(scrollYProgress, [start, 1], [0.8, 1.5]); // Increased zoom end

    const x1 = useTransform(scrollYProgress, [start, enterEnd], ["-50%", "0%"]);
    const x2 = useTransform(scrollYProgress, [start, enterEnd], ["50%", "0%"]);

    return (
        <motion.div
            style={{ opacity, scale }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none"
        >
            <motion.div style={{ x: x1 }} className="w-full">
                <h2 className="text-4xl sm:text-6xl md:text-8xl font-heading font-bold text-white drop-shadow-lg leading-[0.9]">
                    REQUEST A QUOTE
                </h2>
            </motion.div>
            <motion.div style={{ x: x2 }} className="w-full">
                <h2 className="text-4xl sm:text-6xl md:text-8xl font-heading font-bold text-white drop-shadow-lg leading-[0.9]">
                    IN MINUTES
                </h2>
            </motion.div>

            {/* Button Container */}
            <div className="mt-8 pointer-events-auto">
                <a
                    href="#contact"
                    className="inline-block bg-white text-coffee px-8 py-4 rounded-full font-bold text-lg uppercase tracking-wider transition-transform hover:scale-105 shadow-lg"
                >
                    Request Quote
                </a>
            </div>
        </motion.div>
    )
}
