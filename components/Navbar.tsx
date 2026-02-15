"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLoading } from "@/components/LoadingContext"; // Import context hook

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isLoading } = useLoading(); // Get global loading state

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Products", href: "#products" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "MOQ & Delivery", href: "#moq" },
        { name: "Use Cases", href: "#use-cases" },
        { name: "Contact", href: "#contact" },
    ];

    const textColor = scrolled ? "text-coffee" : "text-background"; // Cream text on hero

    // Hide navbar if loading
    if (isLoading) {
        return null;
    }

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
                : "bg-coffee/20 backdrop-blur-md border-b border-white/10 py-6" // Light brown glass
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="transition-opacity hover:opacity-80">
                    <Image
                        src="/images/Protaste Logo.png"
                        alt="Protaste Drinks"
                        width={180}
                        height={50}
                        className="h-[72px] md:h-[80px] w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium hover:text-gold transition-colors uppercase tracking-wider ${textColor}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="#contact"
                        className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider transition-all border shadow-sm hover:shadow-md ${scrolled
                            ? "bg-coffee text-white border-coffee hover:bg-coffee/90"
                            : "bg-white text-coffee border-white hover:bg-gray-100"
                            }`}
                    >
                        Request Quote
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`md:hidden p-2 transition-colors ${textColor}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-background border-b border-gray-100 p-6 md:hidden shadow-xl"
                    >
                        <div className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium text-foreground hover:text-coffee transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="#contact"
                                className="bg-coffee text-white text-center py-3 rounded-md font-bold uppercase tracking-wider"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Request Quote
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
