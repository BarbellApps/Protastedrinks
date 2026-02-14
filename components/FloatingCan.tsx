import Image from "next/image";
import { HandoffCanResult } from "@/hooks/useSectionHandoffCan";

interface FloatingCanProps {
    handoff: HandoffCanResult;
    imageSrc: string;
}

export default function FloatingCan({
    handoff,
    imageSrc
}: FloatingCanProps) {
    const {
        x, y, rotate, width, height, opacity, zIndex, isReady
    } = handoff;

    // Only render if we have a valid snapshot
    if (!isReady) return null;

    return (
        <div
            className="floating-can-overlay fixed top-0 left-0 pointer-events-none will-change-transform"
            style={{
                width: `${width}px`,
                height: `${height}px`,
                transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`,
                opacity,
                zIndex,
                // Removed debug outline and background
            }}
        >
            <div className="relative w-full h-full">
                <Image
                    src={imageSrc}
                    alt="Floating Product Can"
                    fill
                    sizes={`${width}px`}
                    style={{ objectFit: "contain" }}
                    priority
                />
            </div>
        </div>
    );
}
