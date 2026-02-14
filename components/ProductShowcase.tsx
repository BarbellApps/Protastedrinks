"use client";

import { useState } from "react";
import InfoSections from "./InfoSections";
import FloatingCan from "./FloatingCan";
import { useSectionHandoffCan } from "@/hooks/useSectionHandoffCan";

export default function ProductShowcase() {
    const [startEl, setStartEl] = useState<HTMLElement | null>(null);
    const [endEl, setEndEl] = useState<HTMLElement | null>(null);

    const handoff = useSectionHandoffCan(startEl, endEl);

    return (
        <div className="relative bg-background">
            {/* Content Layer */}
            <div className="relative z-20">
                <InfoSections
                    setStartRef={setStartEl}
                    setLandingRef={setEndEl}
                    overlayActive={handoff.overlayActive}
                />
            </div>

            {/* The Floating Can - Rendered AFTER content to ensure high stacking */}
            <FloatingCan
                handoff={handoff}
                imageSrc="/images/products images/Promo Energy Drink can.png"
            />
        </div>
    );
}
