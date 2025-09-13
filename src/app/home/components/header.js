"use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Globe } from "lucide-react";

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

    const languageOptions = ["EN", "FR", "DE"];

    return (
        <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/imgs/logo.png"
                        alt="HMH Affiliate Marketing logo"
                        width={130}
                        height={130}
                        priority
                    />
                </Link>

                {/* Desktop navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <div key={item.label} className="relative group">
                            <button className="flex items-center gap-1 text-lg font-semibold text-gray-900 hover:text-blue-600">
                                {item.label} <ChevronDown className="h-4 w-4" />
                            </button>
                            <div className="invisible absolute left-0 top-full z-10 mt-2 w-48 rounded-md border bg-white py-2 shadow-lg opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                                {item.dropdown.map((subItem) => (
                                    <Link
                                        key={subItem}
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        {subItem}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Action buttons */}
                <div className="hidden items-center gap-4 md:flex">
                    {/* Language dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 rounded-lg border border-black px-3 py-2 text-sm font-medium text-black hover:bg-blue-600 hover:text-white transition">
                            <Globe className="h-4 w-4" /> EN <ChevronDown className="h-4 w-4" />
                        </button>
                        <div className="invisible absolute right-0 top-full mt-2 w-28 rounded-md border bg-white py-1 shadow-lg opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                            {languageOptions.map((lang) => (
                                <button
                                    key={lang}
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Link
                        href="#contact"
                        className="rounded-lg border border-black px-5 py-2 text-sm font-medium transition text-black hover:bg-blue-600 hover:text-white"
                    >
                        CONTACT&nbsp;US
                    </Link>
                    <Link
                        href="/login"
                        className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        GET&nbsp;STARTED
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile drawer */}
            {open && (
                <div className="md:hidden">
                    <div className="space-y-1 border-t px-4 pb-4 pt-3">
                        {navItems.map((item) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between px-2 py-2 text-base font-medium">
                                    {item.label}
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                                {item.dropdown.map((subItem) => (
                                    <Link
                                        key={subItem}
                                        href="#"
                                        className="block pl-6 pr-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        {subItem}
                                    </Link>
                                ))}
                            </div>
                        ))}
                        <div className="mt-3 flex flex-col gap-2">
                            <div className="relative">
                                <button className="flex w-full items-center justify-center gap-1 rounded-lg border border-black px-3 py-2 text-sm font-medium text-black">
                                    <Globe className="h-4 w-4 text-black" /> EN <ChevronDown className="h-4 w-4 text-black" />
                                </button>
                            </div>
                            <Link
                                href="#contact"
                                className="rounded-lg border border-black px-5 py-2 text-center text-sm font-medium hover:bg-gray-100"
                                onClick={() => setOpen(false)}
                            >
                                CONTACT US
                            </Link>
                            <Link
                                href="/login"
                                className="rounded-lg bg-blue-600 px-6 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
                                onClick={() => setOpen(false)}
                            >
                                GET STARTED
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
