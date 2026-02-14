import { useEffect, useState, useCallback, useRef } from "react";

interface Rect {
    top: number;
    left: number;
    width: number;
    height: number;
}

export interface HandoffCanResult {
    x: number;
    y: number;
    rotate: number;
    width: number;
    height: number;
    opacity: number;
    zIndex: number;
    overlayActive: boolean;
    isReady: boolean;
    progress: number;
}

/**
 * ROCK-SOLID Free-Fall Hook with Landing Bounce & Extreme Persistence.
 */
export function useSectionHandoffCan(
    startEl: HTMLElement | null,
    endEl: HTMLElement | null
): HandoffCanResult {
    const [scrollY, setScrollY] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

    // The "Locked" coordinate snapshot - persists until reset
    const snapshot = useRef<{ start: Rect; end: Rect } | null>(null);
    const [isMeasured, setIsMeasured] = useState(false);

    // Track scroll
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setWindowHeight(window.innerHeight);
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ── TRIGGER CALCULATION ──
    const [triggerRange, setTriggerRange] = useState<{ start: number; end: number } | null>(null);

    useEffect(() => {
        if (endEl) {
            const rE = endEl.getBoundingClientRect();
            const docTop = rE.top + window.scrollY;
            // The target is at 18vh. It hits 18vh when scrollY = docTop - 0.18 * windowHeight
            const landingScroll = docTop - 0.18 * window.innerHeight;
            setTriggerRange({
                start: landingScroll - 1000,
                end: landingScroll
            });
        }
    }, [endEl]);

    // ── SNAPSHOT LATCHING ──
    useEffect(() => {
        if (!triggerRange || !startEl || !endEl) return;

        // Capture snapshot exactly at triggerStart
        if (scrollY >= triggerRange.start && !snapshot.current) {
            const rS = startEl.getBoundingClientRect();
            const rE = endEl.getBoundingClientRect();

            snapshot.current = {
                start: {
                    top: rS.top + window.scrollY,
                    left: rS.left + window.scrollX,
                    width: rS.width,
                    height: rS.height,
                },
                end: {
                    top: rE.top + window.scrollY,
                    left: rE.left + window.scrollX,
                    width: rE.width,
                    height: rE.height,
                }
            };
            setIsMeasured(true);
        }

        // Reset only if we scroll back UP significant distance
        if (scrollY < triggerRange.start - 400 && snapshot.current) {
            snapshot.current = null;
            setIsMeasured(false);
        }
    }, [scrollY, triggerRange, startEl, endEl]);

    // ── RENDER ──
    if (snapshot.current && triggerRange) {
        const { start, end } = snapshot.current;
        const { start: ts, end: te } = triggerRange;

        // Progress calc
        const rawProgress = (scrollY - ts) / (te - ts);
        // Map p to be 0..1 for path, but allow > 1 for persistence/bounce
        const p = Math.max(0, Math.min(2.5, rawProgress));

        /**
         * PERSISTENCE: 
         * Stay active until rawProgress reaches 2.5 (deep into the next sections).
         * This prevents the can from disappearing while the user is still in the "How It Works" zone.
         */
        const overlayActive = rawProgress > -0.05 && rawProgress < 2.5;

        // Physics: Gravity with landing clamp
        const fallP = Math.min(1.0, p);
        const g = 0.6 * fallP + 0.4 * (fallP * fallP);

        // Docs base position
        const xDoc = start.left + (end.left - start.left) * fallP;
        let yDoc = start.top + (end.top - start.top) * g;

        /**
         * BOUNCE EFFECT:
         * Triggered on impact (p >= 1.0).
         * Damped oscillation for position and scale.
         */
        let scaleBounce = 1.0;
        if (p >= 1.0) {
            const bounceP = p - 1.0;
            // Position bounce (up/down)
            const bounceOffset = Math.sin(bounceP * 50) * Math.exp(-bounceP * 12) * 22;
            yDoc += bounceOffset;

            // "Squish" bounce (scale)
            scaleBounce = 1.0 + Math.sin(bounceP * 50 + Math.PI) * Math.exp(-bounceP * 12) * 0.06;
        }

        // Convert to viewport space
        const x = xDoc - (typeof window !== "undefined" ? window.scrollX : 0);
        const y = yDoc - scrollY;

        // Rotation: 2 spins + settle to 0
        let rotate = fallP * 720;
        if (fallP > 0.7) {
            const settleP = (fallP - 0.7) / 0.3;
            const easeOut = 1 - Math.pow(1 - settleP, 3);
            rotate = (0.7 * 720) + (720 - (0.7 * 720)) * easeOut;
        }

        // Dimensions
        const width = (start.width + (end.width - start.width) * fallP) * scaleBounce;
        const height = (start.height + (end.height - start.height) * fallP) * scaleBounce;

        return {
            x, y, rotate, width, height,
            opacity: overlayActive ? 1 : 0,
            zIndex: 50,
            overlayActive,
            isReady: isMeasured,
            progress: p
        };
    }

    return {
        x: 0, y: 0, rotate: 0, width: 0, height: 0,
        opacity: 0, zIndex: 0, overlayActive: false, isReady: false, progress: 0
    };
}
