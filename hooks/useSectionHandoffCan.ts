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
 * CLEAN & STABLE Free-Fall Hook.
 */
export function useSectionHandoffCan(
    startEl: HTMLElement | null,
    endEl: HTMLElement | null
): HandoffCanResult {
    const [scrollY, setScrollY] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

    const snapshot = useRef<{ start: Rect; end: Rect } | null>(null);
    const [isMeasured, setIsMeasured] = useState(false);
    const [triggerRange, setTriggerRange] = useState<{ start: number; end: number } | null>(null);

    // 1. Monitor Scroll & Window
    useEffect(() => {
        const hS = () => setScrollY(window.scrollY);
        const hR = () => setWindowHeight(window.innerHeight);
        hS(); hR();
        window.addEventListener("scroll", hS, { passive: true });
        window.addEventListener("resize", hR);
        return () => {
            window.removeEventListener("scroll", hS);
            window.removeEventListener("resize", hR);
        };
    }, []);

    // 2. Calculate Trigger Range
    useEffect(() => {
        if (endEl) {
            const rE = endEl.getBoundingClientRect();
            const docTop = rE.top + window.scrollY;
            const landingScroll = docTop - 0.18 * window.innerHeight;

            setTriggerRange({
                start: landingScroll - 1100,
                end: landingScroll
            });
        }
    }, [endEl]);

    // 3. Snapshot Logic
    useEffect(() => {
        if (!triggerRange || !startEl || !endEl) return;

        const isPastStart = scrollY >= triggerRange.start;
        const isPastEnd = scrollY > triggerRange.end + 1200;

        // CAPTURE
        if (isPastStart && !isPastEnd && !snapshot.current) {
            const rS = startEl.getBoundingClientRect();
            const rE = endEl.getBoundingClientRect();

            if (rS.width > 0 && rS.height > 0) {
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
        }

        // RESET
        if (scrollY < triggerRange.start - 600 && snapshot.current) {
            snapshot.current = null;
            setIsMeasured(false);
        }
    }, [scrollY, triggerRange, startEl, endEl]);

    // 4. Render Calculations
    if (snapshot.current && triggerRange) {
        const { start, end } = snapshot.current;
        const { start: ts, end: te } = triggerRange;

        const rawP = (scrollY - ts) / (te - ts);
        const p = Math.max(0, Math.min(3.0, rawP));
        const active = rawP > -0.05 && rawP < 2.5;

        const fallP = Math.min(1.0, p);
        const g = 0.6 * fallP + 0.4 * (fallP * fallP);

        const xD = start.left + (end.left - start.left) * fallP;
        let yD = start.top + (end.top - start.top) * g;

        let sB = 1.0;
        if (p >= 1.0) {
            const bP = p - 1.0;
            yD += Math.sin(bP * 50) * Math.exp(-bP * 12) * 22;
            sB = 1.0 + Math.sin(bP * 50 + Math.PI) * Math.exp(-bP * 12) * 0.05;
        }

        const x = xD - (typeof window !== "undefined" ? window.scrollX : 0);
        const y = yD - scrollY;

        let r = fallP * 720;
        if (fallP > 0.7) {
            const sP = (fallP - 0.7) / 0.3;
            r = (0.7 * 720) + (720 - (0.7 * 720)) * (1 - Math.pow(1 - sP, 3));
        }

        return {
            x, y, rotate: r,
            width: (start.width + (end.width - start.width) * fallP) * sB,
            height: (start.height + (end.height - start.height) * fallP) * sB,
            opacity: active ? 1 : 0,
            zIndex: 100,
            overlayActive: active,
            isReady: isMeasured,
            progress: p
        };
    }

    return {
        x: 0, y: 0, rotate: 0, width: 0, height: 0,
        opacity: 0, zIndex: 0, overlayActive: false, isReady: false, progress: 0
    };
}
