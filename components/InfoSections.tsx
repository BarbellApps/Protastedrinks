"use client";

import ProductCarousel from "./ProductCarousel";
import FinalCTA from "./FinalCTA";

export default function InfoSections() {
    return (
        <div className="flex flex-col gap-0 pb-32 relative">
            {/* Section 1: Choose Your Drink - Interactive Carousel */}
            {/* Height needs to be large enough to scroll through. 
                The Component itself defines height, but the container should flow. */}
            <div id="products">
                <ProductCarousel />
            </div>

            {/* Section 2: How It Works */}
            <section id="how-it-works" className="min-h-[80vh] flex flex-col justify-center items-end px-6 md:px-20 text-right">
                <div className="max-w-xl">
                    <h2 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-6">
                        HOW IT WORKS
                    </h2>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-coffee mb-2">01. CHOOSE PRODUCT</h3>
                            <p className="text-lg text-foreground/80">Select your base beverage and can size (250ml, 330ml, 500ml).</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-coffee mb-2">02. UPLOAD DESIGN</h3>
                            <p className="text-lg text-foreground/80">Submit your artwork or let our design team create a premium label for you.</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-coffee mb-2">03. PRODUCTION</h3>
                            <p className="text-lg text-foreground/80">High-quality filling and printing in our European facilities.</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-coffee mb-2">04. DELIVERY</h3>
                            <p className="text-lg text-foreground/80">Fast shipping to your warehouse, event, or office.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: MOQ & Delivery */}
            <section id="moq" className="min-h-[80vh] flex flex-col justify-center px-6 md:px-20">
                <div className="max-w-xl">
                    <h2 className="text-5xl md:text-7xl font-heading font-bold text-coffee mb-6">
                        MOQ & DELIVERY
                    </h2>
                    <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-6">
                        Flexible minimum order quantities tailored for businesses of all sizes.
                        Start small with promotional runs or scale up for retail distribution.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h4 className="text-xl font-bold text-foreground mb-2">Small Runs</h4>
                            <p className="text-sm text-foreground/70">Perfect for events & promotions.</p>
                            <p className="text-2xl font-heading font-bold text-gold mt-2">From 264 Cans</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h4 className="text-xl font-bold text-foreground mb-2">Large Scale</h4>
                            <p className="text-sm text-foreground/70">For retail & wholesale.</p>
                            <p className="text-2xl font-heading font-bold text-gold mt-2">Truckloads</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Use Cases */}
            <section id="use-cases" className="min-h-[80vh] flex flex-col justify-center items-end px-6 md:px-20 text-right">
                <div className="max-w-xl">
                    <h2 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-6">
                        USE CASES
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="bg-coffee/5 p-4 rounded-md">
                            <h4 className="font-bold text-coffee">Events</h4>
                            <p className="text-sm">Brand awareness at festivals.</p>
                        </div>
                        <div className="bg-coffee/5 p-4 rounded-md">
                            <h4 className="font-bold text-coffee">Offices</h4>
                            <p className="text-sm">Corporate branding.</p>
                        </div>
                        <div className="bg-coffee/5 p-4 rounded-md">
                            <h4 className="font-bold text-coffee">Horeca</h4>
                            <p className="text-sm">House brands for cafes.</p>
                        </div>
                        <div className="bg-coffee/5 p-4 rounded-md">
                            <h4 className="font-bold text-coffee">Retail</h4>
                            <p className="text-sm">Private label lines.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <FinalCTA />
        </div>
    );
}
