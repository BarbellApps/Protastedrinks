"use client";

import { useState } from "react";
import InfoSections from "./InfoSections";
import FloatingCan from "./FloatingCan";
import { useSectionHandoffCan } from "@/hooks/useSectionHandoffCan";

export default function ProductShowcase() {
    // State-based element tracking is more reliable for hooks than mutable refs
    const [startEl, setStartEl] = useState<HTMLDivElement | null>(null);
    const [endEl, setEndEl] = useState<HTMLDivElement | null>(null);

    // Call the hook ONCE here to ensure all components share the SAME calculation results
    const handoff = useSectionHandoffCan(startEl, endEl);

    return (
        <div className="relative bg-background">
            {/* The Floating Can - Uses the shared handoff state */}
            <FloatingCan
                handoff={handoff}
                imageSrc="/images/products images/Promo Energy Drink can.png"
            />

            {/* Content Layer */}
            <div className="relative z-20">
                <InfoSections
                    setStartRef={setStartEl}
                    setLandingRef={setEndEl}
                    overlayActive={handoff.overlayActive}
                />
            </div>
        </div>
    );
}
