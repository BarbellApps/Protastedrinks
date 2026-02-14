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

    // Only render if we have valid measurements
    if (!isReady) return null;

    return (
        <div
            className="floating-can-overlay"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: `${width}px`,
                height: `${height}px`,
                transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`,
                opacity,
                zIndex,
                pointerEvents: "none",
                willChange: "transform, opacity",
            }}
        >
            <div className="relative w-full h-full">
                <Image
                    src={imageSrc}
                    alt="Floating Product Can"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                />
            </div>
        </div>
    );
}
