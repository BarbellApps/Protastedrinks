import { useEffect, useState, useRef } from "react";

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
    // Landing physics
    scaleX: number;
    scaleY: number;
    // Shadow
    shadowOpacity: number;
    shadowScaleX: number;
    shadowBlur: number;
}

/* ─── Keyframe interpolation helper ─── */
function lerpKeyframes(
    keyframes: { t: number; v: number }[],
    t: number
): number {
    if (t <= keyframes[0].t) return keyframes[0].v;
    if (t >= keyframes[keyframes.length - 1].t)
        return keyframes[keyframes.length - 1].v;

    for (let i = 0; i < keyframes.length - 1; i++) {
        const a = keyframes[i];
        const b = keyframes[i + 1];
        if (t >= a.t && t <= b.t) {
            const local = (t - a.t) / (b.t - a.t);
            return a.v + (b.v - a.v) * local;
        }
    }
    return keyframes[keyframes.length - 1].v;
}

/* ─── Eased keyframe interpolation (ease-in for approach, ease-out for bounce) ─── */
function lerpKeyframesEased(
    keyframes: { t: number; v: number; ease?: "in" | "out" | "inOut" }[],
    t: number
): number {
    if (t <= keyframes[0].t) return keyframes[0].v;
    if (t >= keyframes[keyframes.length - 1].t)
        return keyframes[keyframes.length - 1].v;

    for (let i = 0; i < keyframes.length - 1; i++) {
        const a = keyframes[i];
        const b = keyframes[i + 1];
        if (t >= a.t && t <= b.t) {
            let local = (t - a.t) / (b.t - a.t);
            // Apply easing to segment
            const ease = b.ease || "inOut";
            if (ease === "in") local = local * local;
            else if (ease === "out") local = 1 - (1 - local) * (1 - local);
            else local = local < 0.5
                ? 2 * local * local
                : 1 - 2 * (1 - local) * (1 - local);
            return a.v + (b.v - a.v) * local;
        }
    }
    return keyframes[keyframes.length - 1].v;
}


/**
 * CLEAN & STABLE Free-Fall Hook with realistic 3-phase landing.
 *
 * Progress 0 → 0.82:  Gravity fall + spin
 * Progress 0.82 → 0.87: Impact (overshoot + squash)
 * Progress 0.87 → 0.94: Bounce up
 * Progress 0.94 → 1.0:  Settle to rest
 */
export function useSectionHandoffCan(
    startEl: HTMLElement | null,
    endEl: HTMLElement | null
): HandoffCanResult {
    const [scrollY, setScrollY] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

    const snapshot = useRef<{ start: Rect; end: Rect } | null>(null);
    const [isMeasured, setIsMeasured] = useState(false);
    const [triggerRange, setTriggerRange] = useState<{
        start: number;
        end: number;
    } | null>(null);

    // 1. Monitor Scroll & Window
    useEffect(() => {
        const hS = () => setScrollY(window.scrollY);
        const hR = () => setWindowHeight(window.innerHeight);
        hS();
        hR();
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
                end: landingScroll,
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
                    },
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
        const p = Math.max(0, Math.min(1.0, rawP)); // Clamp to 0–1
        const active = rawP > -0.05 && rawP < 1.5;

        // ── PHASE BOUNDARIES ──
        const FALL_END = 0.82;
        const IMPACT_END = 0.87;
        const BOUNCE_END = 0.94;
        // SETTLE_END = 1.0

        // ── POSITION (X) ── always linear
        const xDoc = start.left + (end.left - start.left) * p;

        // ── POSITION (Y) ── keyframed with overshoot/bounce/settle
        // All Y offsets are relative to end.top (final resting position)
        const startY = start.top;
        const endY = end.top;
        const totalYDist = endY - startY;

        // Y keyframes: fall with gravity → overshoot → bounce → settle
        const yKeyframes = [
            { t: 0, v: 0, ease: "in" as const },     // start position
            { t: FALL_END, v: 1.0, ease: "in" as const },     // arrive at landing
            { t: IMPACT_END, v: 1.0 + 14 / Math.max(Math.abs(totalYDist), 1), ease: "in" as const },  // overshoot down +14px
            { t: BOUNCE_END, v: 1.0 - 16 / Math.max(Math.abs(totalYDist), 1), ease: "out" as const }, // bounce up -16px
            { t: 0.97, v: 1.0 + 6 / Math.max(Math.abs(totalYDist), 1), ease: "in" as const },  // settle dip +6px
            { t: 1.0, v: 1.0, ease: "out" as const },    // final rest
        ];

        // Apply gravity easing to fall phase only
        let yNorm: number;
        if (p <= FALL_END) {
            // Gravity curve: accelerating fall (ease-in quadratic)
            const fallP = p / FALL_END;
            const g = 0.6 * fallP + 0.4 * (fallP * fallP); // gravity-like acceleration
            yNorm = g;
        } else {
            // Landing phases use keyframe interpolation
            yNorm = lerpKeyframesEased(yKeyframes, p);
        }

        const yDoc = startY + totalYDist * yNorm;

        // ── ROTATION ──
        // 720° total spin, damping in last 15% of fall, then settle
        const rotKeyframes = [
            { t: 0, v: 0 },
            { t: 0.67, v: 600 },    // fast spin through most of fall
            { t: FALL_END, v: 740 },    // damped as approaching
            { t: IMPACT_END, v: 752 },    // tiny residual at impact
            { t: BOUNCE_END, v: 756 },    // almost stopped
            { t: 1.0, v: 756 },    // final rest (≈ -4° from 720° = slight tilt equivalent)
        ];
        const rotate = lerpKeyframes(rotKeyframes, p);

        // ── SCALE (SQUASH/STRETCH) ──
        const scaleXKeyframes = [
            { t: 0, v: 1.0 },
            { t: FALL_END, v: 1.0 },
            { t: 0.845, v: 1.05 },   // squash at impact (widen)
            { t: IMPACT_END, v: 1.02 },
            { t: BOUNCE_END, v: 1.0 },
            { t: 1.0, v: 1.0 },
        ];

        const scaleYKeyframes = [
            { t: 0, v: 1.0 },
            { t: FALL_END, v: 1.0 },
            { t: 0.845, v: 0.92 },   // squash at impact (compress)
            { t: IMPACT_END, v: 0.96 },
            { t: BOUNCE_END, v: 1.0 },
            { t: 1.0, v: 1.0 },
        ];

        const scaleX = lerpKeyframes(scaleXKeyframes, p);
        const scaleY = lerpKeyframes(scaleYKeyframes, p);

        // ── SHADOW ──
        // Shadow starts appearing during approach (last 20% of fall)
        // and reacts to bounce
        const shadowStartP = 0.65; // start showing shadow
        const distToGround = Math.max(0, 1 - (p < FALL_END
            ? yNorm  // during fall
            : Math.min(1, yNorm) // during landing phases, clamp
        ));

        const shadowOpacityKeyframes = [
            { t: 0, v: 0 },
            { t: shadowStartP, v: 0.0 },     // invisible
            { t: 0.75, v: 0.08 },     // faint, far away
            { t: FALL_END, v: 0.22 },     // strong at landing
            { t: IMPACT_END, v: 0.26 },     // darkest at impact
            { t: BOUNCE_END, v: 0.12 },     // lighter during bounce up
            { t: 0.97, v: 0.20 },     // returning
            { t: 1.0, v: 0.22 },     // settled
        ];

        const shadowScaleXKeyframes = [
            { t: 0, v: 1.45 },
            { t: shadowStartP, v: 1.40 },     // wide, diffuse
            { t: 0.75, v: 1.25 },
            { t: FALL_END, v: 1.0 },      // tight at landing
            { t: IMPACT_END, v: 0.95 },     // tightest at impact
            { t: BOUNCE_END, v: 1.18 },     // expands during bounce
            { t: 0.97, v: 1.04 },
            { t: 1.0, v: 1.0 },      // settled
        ];

        const shadowBlurKeyframes = [
            { t: 0, v: 22 },
            { t: shadowStartP, v: 20 },       // very blurry
            { t: 0.75, v: 14 },
            { t: FALL_END, v: 8 },        // sharp at landing
            { t: IMPACT_END, v: 6 },        // sharpest at impact
            { t: BOUNCE_END, v: 14 },       // blurry during bounce
            { t: 0.97, v: 9 },
            { t: 1.0, v: 8 },        // settled
        ];

        const shadowOpacity = lerpKeyframes(shadowOpacityKeyframes, p);
        const shadowScaleXVal = lerpKeyframes(shadowScaleXKeyframes, p);
        const shadowBlur = lerpKeyframes(shadowBlurKeyframes, p);

        // ── SIZE ──
        const width = start.width + (end.width - start.width) * p;
        const height = start.height + (end.height - start.height) * p;

        // ── VIEWPORT COORDS ──
        const x = xDoc - (typeof window !== "undefined" ? window.scrollX : 0);
        const y = yDoc - scrollY;

        return {
            x,
            y,
            rotate,
            width,
            height,
            opacity: active ? 1 : 0,
            zIndex: 100,
            overlayActive: active,
            isReady: isMeasured,
            progress: p,
            scaleX,
            scaleY,
            shadowOpacity,
            shadowScaleX: shadowScaleXVal,
            shadowBlur,
        };
    }

    return {
        x: 0,
        y: 0,
        rotate: 0,
        width: 0,
        height: 0,
        opacity: 0,
        zIndex: 0,
        overlayActive: false,
        isReady: false,
        progress: 0,
        scaleX: 1,
        scaleY: 1,
        shadowOpacity: 0,
        shadowScaleX: 1,
        shadowBlur: 10,
    };
}
