"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
    return (
        <section className="min-h-[60vh] flex flex-col justify-center items-end px-6 md:px-20 text-right pb-32">
            <div className="max-w-xl">
                <h2 className="text-5xl md:text-7xl font-heading font-bold text-coffee mb-6">
                    READY TO BRAND?
                </h2>
                <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
                    Get your private label drinks produced, printed, and delivered.
                    European quality, competitive pricing.
                </p>
                <Link
                    href="#contact"
                    className="inline-flex items-center gap-2 bg-white text-coffee hover:bg-gray-50 border-2 border-coffee px-8 py-4 rounded-full font-bold text-lg uppercase tracking-wider transition-all shadow-md hover:shadow-lg group"
                >
                    <span>Request Quote</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </section>
    );
}
