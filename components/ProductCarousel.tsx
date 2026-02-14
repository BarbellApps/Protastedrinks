"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";

// Edition Data
const EDITIONS = [
    {
        id: "winter",
        name: "Ice Coffee",
        tagline: "The Winter Edition",
        color: "#8B5E3C",
        image: "/images/products images/Promo Ice Coffee can.png",
    },
    {
        id: "red",
        name: "The Red Edition",
        tagline: "Maximum Energy",
        color: "#EF4444",
        image: "/images/products images/Promo Energy Drink can.png",
    },
    {
        id: "seablue",
        name: "Still Water",
        tagline: "The Sea Blue Edition",
        color: "#22D3EE",
        image: "/images/products images/Promo Water in can.png",
    },
    {
        id: "apricot",
        name: "Sparkling Water",
        tagline: "The Apricot Edition",
        color: "#FB923C",
        image: "/images/products images/Mineralwater 500ml private label.png",
    },
    {
        id: "blue",
        name: "Mineral Water",
        tagline: "The Blue Edition",
        color: "#3B82F6",
        image: "/images/products images/Mineralwater 330ml private label.png",
    },
    {
        id: "tropical",
        name: "Choco Milk",
        tagline: "The Tropical Edition",
        color: "#D97706",
        image: "/images/products images/Promo Chocomilk can.png",
    },
    {
        id: "pink",
        name: "Premium Glass",
        tagline: "The Pink Edition",
        color: "#EC4899",
        image: "/images/products images/Mineralwater 330ml Glass_private label.png",
    },
    {
        id: "green",
        name: "The Green Edition",
        tagline: "Sugarfree",
        color: "#22C55E",
        image: "/images/products images/Promo Energy Drink can.png",
    },
];

// Define the Rainbow Arc Slots (DESKTOP)
const DESKTOP_ARC_POSITIONS = [
    { x: 0, y: 0, rotate: 0, scale: 1.4, opacity: 1, zIndex: 50 }, // HERO: Center Split
    { x: 220, y: -80, rotate: 15, scale: 1.1, opacity: 0.8, zIndex: 40 }, // Curve Up/Right
    { x: 420, y: -40, rotate: 30, scale: 0.9, opacity: 0.6, zIndex: 30 }, // Peak
    { x: 580, y: 60, rotate: 45, scale: 0.75, opacity: 0.4, zIndex: 20 }, // Down
];

// Define the Rainbow Arc Slots (MOBILE)
const MOBILE_ARC_POSITIONS = [
    { x: 0, y: 80, rotate: 0, scale: 1.15, opacity: 1, zIndex: 50 }, // HERO: Significantly smaller, Lower
    { x: 70, y: 60, rotate: 10, scale: 0.95, opacity: 0.8, zIndex: 40 },
    { x: 130, y: 80, rotate: 20, scale: 0.85, opacity: 0.6, zIndex: 30 },
    { x: 180, y: 120, rotate: 30, scale: 0.75, opacity: 0.4, zIndex: 20 },
    { x: 220, y: 160, rotate: 40, scale: 0.65, opacity: 0.2, zIndex: 10 },
];

interface ProductCarouselProps {
    setStartRef: (node: HTMLDivElement | null) => void;
    overlayActive: boolean;
}

export default function ProductCarousel({ setStartRef, overlayActive }: ProductCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Responsive Check
    // We can use a simple effect here.
    // Note: In Next.js, window is only defined on client.
    useEffect(() => {
        if (typeof window !== "undefined") {
            const checkMobile = () => setIsMobile(window.innerWidth < 768);
            checkMobile();
            window.addEventListener("resize", checkMobile);
            return () => window.removeEventListener("resize", checkMobile);
        }
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const newIndex = Math.min(
            EDITIONS.length - 1,
            Math.floor(latest * EDITIONS.length)
        );
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    });

    // Drop Animation for the last item ("Green Edition")
    // REMOVED: dropY, dropX, dropRotate to keep the can fixed ("sticky") until the next section takes over.
    // The visual "drop" will be handled entirely by the ProductShowcase component starting late.

    // Fade out at the very end to avoid double-rendering when Showcase takes over
    // Fade out at the very end to avoid double-rendering when Showcase takes over
    // REMOVED: dropOpacity is no longer needed here as FloatingCan handles the transition.
    // const dropOpacity = useTransform(scrollYProgress, [0.98, 1], [1, 0]);

    const currentEdition = EDITIONS[currentIndex];
    const itemPositions = isMobile ? MOBILE_ARC_POSITIONS : DESKTOP_ARC_POSITIONS;

    // Calculate which editions go into which slot.
    // Active item (currentIndex) goes to ARC_POSITIONS[0] (Hero).
    const visibleEditions = itemPositions.map((pos, slotIndex) => {
        const offset = slotIndex;
        let editionIndex = (currentIndex + offset) % EDITIONS.length;
        if (editionIndex < 0) editionIndex += EDITIONS.length;

        // Apply drop animation only if it's the active item (slot 0) AND it's the Green Edition (last in list, or just use currentIndex check)
        // Actually, we want the *visual* center item to drop.
        let finalY: number | MotionValue<number> = pos.y;
        let finalOpacity: number | MotionValue<number> = pos.opacity;

        if (slotIndex === 0) {
            // We are in the center slot.
            // If we are at the very end of the scroll, this item should drop.
            // However, motion values are hooks, we can't conditionally apply them easily in a map if they are different types.
            // But Framer Motion 'style' prop accepts MotionValues.
            // We'll pass the motion value derived above.
            // BUT 'pos.y' is a number. We need to combine them?
            // Easiest is to add a separate transform to the container div or use the value directly if supported.
            // Let's use the `dropY` motion value we created, but only effect it if we are indeed at the last index.
            // Since `dropY` is only non-zero at the end, we can add it to all? No, that would drop everything.
            // We only want to drop if `currentIndex === EDITIONS.length - 1` (The Green Edition).

            if (currentIndex === EDITIONS.length - 1) {
                // We are displaying the last item.
                // We can't mathematically add MotionValue to number easily in this map without `useTransform` composition which breaks rules of hooks if done here.
                // Strategy: Pass dropping state or value to the component and handle style there?
                // Or: Since this is the exit animation, we can just make `dropY` active for *whatever* is in slot 0 when scroll is > 0.9.
                // Yes! Because at scroll > 0.9, the Green Edition IS in slot 0.
                // So we just say: Slot 0 always gets `y + dropY`.
            }
        }

        return {
            ...EDITIONS[editionIndex],
            key: EDITIONS[editionIndex].id,
            position: pos,
            isCenter: slotIndex === 0
        };
    });

    return (
        <section
            ref={containerRef}
            className="relative h-[500vh] z-10 bg-white"
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col md:flex-row shadow-2xl">

                {/* Backgrounds 
                    Mobile: Top 55% Color, Bottom 45% White
                    Desktop: Left 50% Color, Right 50% White
                */}
                <div
                    className="absolute left-0 top-0 w-full h-[55%] md:h-full md:w-[50%] transition-colors duration-700 ease-in-out z-0"
                    style={{ backgroundColor: currentEdition.color }}
                />
                <div className="absolute left-0 bottom-0 md:left-auto md:right-0 md:top-0 w-full h-[45%] md:h-full md:w-[50%] bg-white z-0" />

                {/* Left Panel: Text Content */}
                <div className="w-full h-[55%] md:h-full md:w-[50%] flex flex-col justify-start md:justify-center px-6 md:px-20 relative z-10 text-white pt-28 md:pt-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentEdition.id}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.4 }}
                        >
                            <span className="text-lg md:text-2xl font-bold uppercase tracking-widest opacity-90 mb-1 md:mb-2 block">
                                {currentEdition.name}
                            </span>
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-4 md:mb-6 leading-[0.9] opacity-20 md:opacity-100 mix-blend-overlay md:mix-blend-normal">
                                {currentEdition.tagline}
                            </h2>
                            <p className="md:hidden text-base mb-6 opacity-90 leading-tight pr-12">
                                Refreshing and energizing beverages for your brand.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                <button className="bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-bold uppercase tracking-wider text-sm md:text-base hover:scale-105 transition-transform shadow-lg self-start">
                                    Bekijk Product
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Panel: Visual Container - Centered */}
                {/* Mobile: Full screen (inset-0) to allow overlap. Desktop: Right half. */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center z-20 pointer-events-none">
                    <div className="relative w-full h-full flex items-center justify-center translate-y-[30px] md:translate-y-0">
                        <AnimatePresence initial={false}>
                            {visibleEditions.map((item, i) => (
                                <motion.div
                                    key={item.key}
                                    initial={false}
                                    animate={{
                                        x: item.position.x,
                                        y: item.position.y,
                                        rotate: item.position.rotate,
                                        scale: item.position.scale,
                                        opacity: item.position.opacity,
                                        zIndex: item.position.zIndex
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.5,
                                        transition: { duration: 0.4 }
                                    }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute w-[140px] md:w-[280px] drop-shadow-2xl will-change-transform"
                                >
                                    {/* Fixed height container - Apply Drop here */}
                                    <motion.div
                                        ref={(el) => {
                                            if (item.id === "green" && item.isCenter) {
                                                setStartRef(el);
                                            }
                                        }}
                                        style={{
                                            // Hide ALL carousel items when overlay is active
                                            opacity: overlayActive ? 0 : 1,
                                            visibility: overlayActive ? 'hidden' : 'visible'
                                        }}
                                        className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center"
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={400}
                                            height={800}
                                            className="w-full h-full object-contain"
                                            priority={i === 0}
                                        />
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Progress Dots - Floating above everything */}
                <div className="absolute z-30 bottom-8 left-1/2 -translate-x-1/2 md:bottom-12 md:left-20 md:translate-x-0 flex gap-2 md:gap-3 transition-all duration-300">
                    {EDITIONS.map((_, idx) => (
                        <div
                            key={idx}
                            style={{
                                backgroundColor: isMobile
                                    ? (idx === currentIndex ? currentEdition.color : `${currentEdition.color}40`)
                                    : undefined
                            }}
                            className={`
                                h-1.5 md:h-2 rounded-full transition-all duration-300 shadow-sm
                                ${idx === currentIndex ? 'w-6 md:w-8' : 'w-1.5 md:w-2'}
                                ${!isMobile ? (idx === currentIndex ? 'bg-white' : 'bg-white/40') : ''}
                            `}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
