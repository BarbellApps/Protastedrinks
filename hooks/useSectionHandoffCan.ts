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
 * ROCK-SOLID Free-Fall Hook.
 * Guarantees monotonic motion, zero jitter via one-way snapshots, and precise landing.
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
    const [activeProgress, setActiveProgress] = useState(0);

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

    // Calculate a STABLE trigger range based on landing section
    useEffect(() => {
        if (endEl) {
            const rE = endEl.getBoundingClientRect();
            const docTop = rE.top + window.scrollY;
            // Transition spans 1000px, ending precisely when landing section hits its viewport spot
            // The landing target is at 18vh. So it hits 18vh when scrollY = docTop - 0.18 * windowHeight
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

        // "Ready to capture" means we are approaching the start
        const isApproaching = scrollY >= triggerRange.start - 500 && scrollY <= triggerRange.start;
        const isInside = scrollY >= triggerRange.start && scrollY <= triggerRange.end + 500;

        // CAPTURE: Exactly when crossing the start threshold
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

        // RESET: Only if we scroll back UP far enough
        if (scrollY < triggerRange.start - 200 && snapshot.current) {
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
        const p = Math.max(0, Math.min(1, rawProgress));

        // Visibility: show slightly before and definitely through landing
        const overlayActive = rawProgress > -0.05 && rawProgress < 1.1;

        // Physics: Gravity with initial velocity matching scroll
        // v0 = 1.0 (linear), a = 0.5 (parabolic)
        const g = 0.6 * p + 0.4 * (p * p);

        // Docs
        const xDoc = start.left + (end.left - start.left) * p;
        const yDoc = start.top + (end.top - start.top) * g;

        // Viewport
        const x = xDoc - (typeof window !== "undefined" ? window.scrollX : 0);
        const y = yDoc - scrollY;

        // Rotation: 2 full spins, then settle to 0
        // We settle between progress 0.7 and 1.0
        let rotate = p * 720;
        if (p > 0.7) {
            const settleP = (p - 0.7) / 0.3;
            const easeOut = 1 - Math.pow(1 - settleP, 3);
            // We want to end at exactly 720 (effectively 0)
            rotate = (0.7 * 720) + (720 - (0.7 * 720)) * easeOut;
        }

        // Scale
        const width = start.width + (end.width - start.width) * p;
        const height = start.height + (end.height - start.height) * p;

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
