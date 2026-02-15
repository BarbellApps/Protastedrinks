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
        x, y, rotate, width, height, opacity, zIndex, isReady,
        scaleX, scaleY,
        shadowOpacity, shadowScaleX, shadowBlur
    } = handoff;

    // Only render if we have a valid snapshot
    if (!isReady) return null;

    return (
        <div
            className="floating-can-overlay fixed top-0 left-0 pointer-events-none will-change-transform"
            style={{
                width: `${width}px`,
                height: `${height}px`,
                transform: `translate3d(${x}px, ${y}px, 0)`,
                opacity,
                zIndex,
            }}
        >
            {/* Can with squash/stretch (bottom-center pivot) */}
            <div
                className="relative w-full h-full"
                style={{
                    transform: `rotate(${rotate}deg) scaleX(${scaleX}) scaleY(${scaleY})`,
                    transformOrigin: "50% 100%",
                }}
            >
                <Image
                    src={imageSrc}
                    alt="Floating Product Can"
                    fill
                    sizes={`${width}px`}
                    style={{ objectFit: "contain" }}
                    priority
                />
            </div>

            {/* Shadow ellipse beneath the can */}
            {shadowOpacity > 0.01 && (
                <div
                    className="absolute left-1/2 pointer-events-none"
                    style={{
                        bottom: "-8px",
                        width: `${width * 0.6}px`,
                        height: "12px",
                        transform: `translateX(-50%) scaleX(${shadowScaleX})`,
                        borderRadius: "50%",
                        background: `radial-gradient(ellipse at center, rgba(0,0,0,${shadowOpacity}) 0%, rgba(0,0,0,0) 70%)`,
                        filter: `blur(${shadowBlur}px)`,
                    }}
                />
            )}
        </div>
    );
}
