"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, MotionValue } from "framer-motion";

const FRAME_COUNT = 240;
const IMAGES_DIR = "/images/sequence/";

interface HeroCanvasProps {
    scrollYProgress: MotionValue<number>;
}

export default function HeroCanvas({ scrollYProgress }: HeroCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Load images
    useEffect(() => {
        const imgArray: HTMLImageElement[] = [];

        // We can't wait for all images to load before showing anything, 
        // but for smooth scroll we ideally want them locally.
        // We'll load them and trigger re-render.

        const loadImages = async () => {
            const promises = [];
            for (let i = 1; i <= FRAME_COUNT; i++) {
                const img = new Image();
                const src = `${IMAGES_DIR}frame-${i.toString().padStart(3, "0")}.jpg`;
                img.src = src;
                imgArray[i - 1] = img;

                const promise = new Promise((resolve) => {
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                });
                promises.push(promise);
            }

            await Promise.all(promises);
            setImages(imgArray);
            setImagesLoaded(true);
        };

        loadImages();
    }, []);

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || !images[index]) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = images[index];

        // Low-level canvas manipulation for high performance
        const dpr = window.devicePixelRatio || 1;
        // We rely on CSS to size the canvas, so we use clientWidth/Height
        const cssWidth = canvas.clientWidth;
        const cssHeight = canvas.clientHeight;

        if (canvas.width !== cssWidth * dpr || canvas.height !== cssHeight * dpr) {
            canvas.width = cssWidth * dpr;
            canvas.height = cssHeight * dpr;
            ctx.scale(dpr, dpr);
        }

        const aspect = img.width / img.height;
        const canvasAspect = cssWidth / cssHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        // Cover logic: ensure image covers user screen
        if (canvasAspect > aspect) {
            // Canvas is wider relative to height -> fit width, crop height
            drawWidth = cssWidth;
            drawHeight = cssWidth / aspect;
            offsetX = 0;
            offsetY = (cssHeight - drawHeight) / 2;
        } else {
            // Canvas is taller relative to width -> fit height, crop width
            drawHeight = cssHeight;
            drawWidth = cssHeight * aspect;
            offsetX = (cssWidth - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.fillStyle = "#FBF6F6";
        ctx.fillRect(0, 0, cssWidth, cssHeight);

        // Smooth rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Draw initial frame
    useEffect(() => {
        if (imagesLoaded) {
            // Draw frame 0 initially
            renderFrame(0);
        }
    }, [imagesLoaded]);

    // Handle scroll updates
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (!imagesLoaded) return;

        const frameIndex = Math.min(
            FRAME_COUNT - 1,
            Math.floor(latest * (FRAME_COUNT - 1))
        );

        requestAnimationFrame(() => renderFrame(frameIndex));
    });

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (imagesLoaded) {
                renderFrame(Math.min(FRAME_COUNT - 1, Math.floor(scrollYProgress.get() * (FRAME_COUNT - 1))));
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [imagesLoaded, scrollYProgress]);

    return (
        <div className="absolute inset-0 w-full h-full">
            {!imagesLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-coffee font-heading text-2xl animate-pulse z-10">
                    Loading Experience...
                </div>
            )}
            <canvas
                ref={canvasRef}
                className="block w-full h-full object-cover"
            />
        </div>
    );
}
