"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* --- minimal variants --- */
const sectionFade = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const cols = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const iconIn = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function Footer() {
    const commonLinkCls = "hover:text-blue-600 transition";

    return (
        <motion.footer
            className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white"
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
        >
            {/* top grid */}
            <motion.div
                className="mx-auto max-w-7xl px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
                variants={cols}
            >
                {/* col‑1 : logo + links + subscribe */}
                <motion.div variants={fadeUp} className="lg:col-span-1">
                    {/* logo */}
                    <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                        <Image 
                            src="/imgs/logo.png" 
                            alt="HMH Logo" 
                            width={120} 
                            height={120}
                            className="transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    <p className="text-gray-300 mb-6 leading-relaxed">
                        Connecting brands and publishers worldwide with cutting-edge partnership marketing solutions.
                    </p>

                    <ul className="space-y-3 text-sm">
                        {[
                            "Our offers",
                            "Overview", 
                            "About Us",
                            "Contact Us",
                            "User Agreement",
                            "Privacy Policy",
                        ].map((txt) => (
                            <li key={txt} className={commonLinkCls}>
                                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{txt}</Link>
                            </li>
                        ))}
                    </ul>

                    {/* subscribe */}
                    <div className="mt-8">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input 
                                type="email" 
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button className="btn-primary px-6 py-3 whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                        <p className="mt-3 text-sm text-gray-400">Subscribe to our latest news and updates</p>
                    </div>
                </motion.div>

                {/* middle columns */}
                {[
                    {
                        title: "Services",
                        items: [
                            "Partnership Marketing",
                            "Campaign Management",
                            "Analytics & Reporting",
                            "Publisher Network",
                            "Brand Solutions",
                            "API Integration",
                        ],
                    },
                    {
                        title: "Company",
                        items: ["About Us", "Careers", "News", "Contact", "Academy", "Press Kit"],
                    },
                ].map(({ title, items }) => (
                    <motion.div key={title} variants={fadeUp}>
                        <h3 className="font-bold text-lg mb-6 relative pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-12 after:bg-blue-400">
                            {title}
                        </h3>
                        <ul className="space-y-3 text-sm">
                            {items.map((it) => (
                                <li key={it} className={commonLinkCls}>
                                    <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{it}</Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}

                {/* Resources + payment methods */}
                <motion.div variants={fadeUp}>
                    <h3 className="font-bold text-lg mb-6 relative pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-12 after:bg-blue-400">
                        Resources
                    </h3>
                    <ul className="space-y-3 text-sm mb-8">
                        {[
                            "Documentation",
                            "API Reference",
                            "Help Center",
                            "Community Forum",
                            "Blog",
                            "Case Studies",
                        ].map((it) => (
                            <li key={it} className={commonLinkCls}>
                                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{it}</Link>
                            </li>
                        ))}
                    </ul>

                    {/* payment methods */}
                    <h4 className="font-semibold mb-4 text-white">Payment Methods</h4>
                    <div className="grid grid-cols-3 gap-3">
                        {["visa", "jazzcash", "paypal", "easypaisa", "googlepay", "mastercard"].map(
                            (pm, i) => (
                                <motion.div 
                                    key={pm} 
                                    variants={iconIn} 
                                    custom={i}
                                    className="bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors duration-200"
                                >
                                    <Image
                                        src={`/imgs/${pm}.png`}
                                        alt={pm}
                                        width={40}
                                        height={28}
                                        className="object-contain"
                                    />
                                </motion.div>
                            ),
                        )}
                    </div>
                </motion.div>
            </motion.div>

            {/* bottom bar */}
            <motion.div
                className="border-t border-white/10 bg-black/20 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1, transition: { duration: 0.35 } }}
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-400">
                        ©2025 HMH.com All Rights Reserved
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </motion.div>
        </motion.footer>
    );
}
