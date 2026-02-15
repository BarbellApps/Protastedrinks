"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const products = [
        { name: "Mineral Water RPET (330ml)", href: "https://protaste-drinks.com/products/mineral-water-rpet-bottle-330-ml/" },
        { name: "Mineral Water RPET (500ml)", href: "https://protaste-drinks.com/products/mineral-water-pet-bottle-500-ml/" },
        { name: "Mineral Water Glass (330ml)", href: "https://protaste-drinks.com/products/mineral-water-glass-bottle-330-ml/" },
        { name: "Energy Drink Can (250ml)", href: "https://protaste-drinks.com/products/energy-drink-can/" },
        { name: "Iced Coffee Can (250ml)", href: "https://protaste-drinks.com/products/iced-coffee-can/" },
        { name: "Promosecco Can (200ml)", href: "https://protaste-drinks.com/products/promosecco-can/" },
    ];

    const company = [
        { name: "About Us", href: "https://protaste-drinks.com/about-us/" },
        { name: "Portfolio", href: "https://protaste-drinks.com/portfolio/" },
        { name: "FAQ", href: "https://protaste-drinks.com/faq/" },
        { name: "Blog", href: "https://protaste-drinks.com/blog/" },
        { name: "Contact", href: "https://protaste-drinks.com/contact/" },
    ];

    return (
        <footer className="relative bg-white text-gray-900 overflow-hidden">
            {/* Decorative gradient line at top */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8">
                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link href="/">
                            <Image
                                src="/images/Protaste Logo.png"
                                alt="Protaste Drinks"
                                width={180}
                                height={50}
                                className="h-[62px] md:h-[70px] w-auto object-contain mb-4"
                            />
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-500 mb-6 max-w-xs">
                            Custom label drinks for everyone. Your own private label beverages with your logo, design and style. European quality, competitive pricing.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            <a
                                href="https://www.linkedin.com/company/protastedrinks"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-all duration-300 group"
                            >
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.facebook.com/ProTasteDrinksAmsterdam/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-all duration-300 group"
                            >
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Products Column */}
                    <div>
                        <h4 className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-red-500 mb-5">Products</h4>
                        <ul className="space-y-3">
                            {products.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-red-500 mb-5">Company</h4>
                        <ul className="space-y-3">
                            {company.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-red-500 mb-5">Contact</h4>
                        <div className="space-y-4">
                            <a
                                href="tel:+0031206694469"
                                className="flex items-center gap-3 group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center group-hover:bg-red-50 group-hover:border-red-300 transition-all duration-300 shrink-0">
                                    <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-500 group-hover:text-red-500 transition-colors">
                                    +31 (0)20 - 669 44 69
                                </span>
                            </a>
                            <a
                                href="mailto:info@protaste-drinks.com"
                                className="flex items-center gap-3 group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center group-hover:bg-red-50 group-hover:border-red-300 transition-all duration-300 shrink-0">
                                    <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-500 group-hover:text-red-500 transition-colors">
                                    info@protaste-drinks.com
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 mb-6" />

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">
                        &copy; {currentYear} Protaste Drinks B.V. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a
                            href="https://protaste-drinks.com/wp-content/uploads/2018/04/General-terms-and-conditions-of-sale-of-Protaste-Drinks-B.V..pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                            Terms & Conditions
                        </a>
                        <a
                            href="https://protaste-drinks.com/contact/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
