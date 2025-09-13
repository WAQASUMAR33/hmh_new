"use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";

/**
 * Pixel‑perfect header component (JavaScript edition)
 * — Exact replica of the reference bar
 * — Built for Next.js (App Router) + TailwindCSS
 * — Responsive: desktop nav + mobile slide‑down drawer
 */

export default function Header({children}) {
    const [open, setOpen] = useState(false);

    const navItems = [
        {
            label: "For advertisers",
            href: "#advertisers",
            dropdown: ["Traffic Sources", "Campaign Management", "Tracking Tools"],
        },
        {
            label: "For publishers",
            href: "#publishers",
            dropdown: ["Monetization", "Offers", "Support"],
        },
        {
            label: "Resources",
            href: "#resources",
            dropdown: ["Blog", "Case Studies", "Help Center"],
        },
    ];


    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative">
                        <Image
                            src="/imgs/logo.png"
                            alt="HMH Affiliate Marketing logo"
                            width={100}
                            height={100}
                            priority
                            className="transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </Link>

                {/* Desktop navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <div key={item.label} className="relative group">
                            <button className="flex items-center gap-1.5 text-base font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2">
                                {item.label} <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                            </button>
                            <div className="invisible absolute left-0 top-full z-10 mt-3 w-56 rounded-xl border border-gray-200/50 bg-white/95 backdrop-blur-md py-3 shadow-xl opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                {item.dropdown.map((subItem) => (
                                    <Link
                                        key={subItem}
                                        href="#"
                                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg mx-2"
                                    >
                                        {subItem}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Action buttons */}
                <div className="hidden items-center gap-3 md:flex">
                    <Link
                        href="#contact"
                        className="btn-secondary text-sm px-5 py-2.5"
                    >
                        Contact Us
                    </Link>
                    <Link
                        href="/login"
                        className="btn-primary text-sm px-6 py-2.5"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
                </button>
            </div>

            {/* Mobile drawer */}
            {open && (
                <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
                    <div className="space-y-1 px-4 pb-6 pt-4">
                        {navItems.map((item) => (
                            <div key={item.label} className="border-b border-gray-100 pb-3 mb-3">
                                <div className="flex items-center justify-between px-2 py-3 text-base font-semibold text-gray-800">
                                    {item.label}
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                </div>
                                <div className="space-y-1">
                                    {item.dropdown.map((subItem) => (
                                        <Link
                                            key={subItem}
                                            href="#"
                                            className="block pl-6 pr-2 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200"
                                        >
                                            {subItem}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="mt-6 flex flex-col gap-3">
                            <Link
                                href="#contact"
                                className="btn-secondary text-center py-3"
                                onClick={() => setOpen(false)}
                            >
                                Contact Us
                            </Link>
                            <Link
                                href="/login"
                                className="btn-primary text-center py-3"
                                onClick={() => setOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
