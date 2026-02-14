"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, MotionValue, AnimatePresence } from "framer-motion";
import LoadingScreen from "./LoadingScreen";
import { useLoading } from "@/components/LoadingContext";

const FRAME_COUNT = 240;
const IMAGES_DIR = "/images/sequence/";

interface HeroCanvasProps {
    scrollYProgress: MotionValue<number>;
}

export default function HeroCanvas({ scrollYProgress }: HeroCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const { setIsLoading } = useLoading();

    // Set initial loading state
    useEffect(() => {
        setIsLoading(true);
    }, [setIsLoading]);

    // Load images
    useEffect(() => {
        const imgArray: HTMLImageElement[] = [];
        let loadedCount = 0;

        const loadImages = async () => {
            const promises = [];
            for (let i = 1; i <= FRAME_COUNT; i++) {
                const img = new Image();
                const src = `${IMAGES_DIR}frame-${i.toString().padStart(3, "0")}.jpg`;
                img.src = src;
                imgArray[i - 1] = img;

                const promise = new Promise((resolve) => {
                    img.onload = () => {
                        loadedCount++;
                        setLoadingProgress((loadedCount / FRAME_COUNT) * 100);
                        resolve(true);
                    };
                    img.onerror = () => {
                        // Even if it fails, we count it as "processed" so loading finishes
                        loadedCount++;
                        setLoadingProgress((loadedCount / FRAME_COUNT) * 100);
                        resolve(false);
                    };
                });
                promises.push(promise);
            }

            await Promise.all(promises);
            setImages(imgArray);

            // Add a small delay to let the user see the 100% state
            setTimeout(() => {
                setImagesLoaded(true);
                setIsLoading(false);
            }, 500);
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
            <AnimatePresence mode="wait">
                {!imagesLoaded && (
                    <LoadingScreen key="loader" progress={loadingProgress} />
                )}
            </AnimatePresence>

            {/* 
               We only show the canvas when images are loaded to avoid flashing empty canvas. 
               However, to keep the layout stable, we can keep it mounted but hidden or just performant.
               Actually, we can render it behind the loader so it's ready.
            */}
            <canvas
                ref={canvasRef}
                className={`block w-full h-full object-cover transition-opacity duration-500 ${imagesLoaded ? "opacity-100" : "opacity-0"}`}
            />
        </div>
    );
}

