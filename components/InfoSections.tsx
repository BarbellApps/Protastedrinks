"use client";

import ProductCarousel from "./ProductCarousel";

export default function InfoSections() {
    return (
        <div className="flex flex-col gap-0 relative">
            {/* Section 1: Choose Your Drink - Interactive Carousel */}
            <div id="products">
                <ProductCarousel />
            </div>
        </div>
    );
}
