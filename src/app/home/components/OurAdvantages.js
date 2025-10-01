"use client";

import {
    DollarSign,
    UserPlus,
    ClipboardList,
    RefreshCw,
    Truck,
    Shield,
    Globe,
    Trophy,
    Briefcase,
    Headphones,
} from "lucide-react";
import { motion } from "framer-motion";

/* --- animation presets --- */
const sectionFade = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const itemUp = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function OurAdvantages() {
    const advantages = [
        { title: "Free Setup/No Monthly Fee", Icon: DollarSign },
        { title: "Free Dedicated Personal Agent", Icon: UserPlus },
        { title: "Product Listing Service for Multiple Platforms", Icon: ClipboardList },
        { title: "Automatic Order Fulfillment And Processing", Icon: RefreshCw },
        { title: "Reliable Shipping Time And Reasonable Cost", Icon: Truck },
        { title: "Quality Inspection For Each Package", Icon: Shield },
        { title: "Global Warehouses & Suppliers", Icon: Globe },
        { title: "Winning Product Recommendation", Icon: Trophy },
        { title: "Professional Wholesale Service", Icon: Briefcase },
        { title: "7/24 Customer Support", Icon: Headphones },
    ];

    return (
        <motion.section
            className="relative overflow-hidden bg-white py-16 px-4 select-none"
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
        >
            {/* soft decorative glows */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-indigo-300/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-sky-300/30 blur-3xl" />

            <div className="relative max-w-[1250px] mx-auto">
                <div className="text-center mb-12">
                    <motion.h2
                        className="text-2xl md:text-3xl font-semibold text-black"
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.45 } }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        Our Advantages
                    </motion.h2>
                    <motion.p
                        className="mt-2 text-sm md:text-base text-slate-600"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1, transition: { duration: 0.35, delay: 0.05 } }}
                        viewport={{ once: true }}
                    >
                        Why teams choose HMH to launch, scale, and streamline operations.
                    </motion.p>
                </div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-7"
                    variants={container}
                >
                    {advantages.map(({ title, Icon }, i) => (
                        <motion.div
                            key={i}
                            variants={itemUp}
                            whileHover={{
                                y: -3,
                                boxShadow:
                                    "0 14px 32px rgba(0,0,0,0.06), 0 6px 14px rgba(0,0,0,0.05)",
                            }}
                            className="group relative flex items-start gap-4 rounded-xl border border-slate-200 bg-white/90 backdrop-blur px-5 py-4 shadow-sm ring-1 ring-transparent transition"
                        >
                            {/* icon badge */}
                            <div className="shrink-0 grid place-content-center h-10 w-10 rounded-full bg-[#E7E9FA] text-[#003366] ring-1 ring-[#6f7ff5]/30">
                                <Icon size={18} strokeWidth={2.2} />
                            </div>

                            {/* text */}
                            <p className="text-[15px] md:text-[16px] text-slate-900 leading-snug">
                                {title}
                            </p>

                            {/* accent on hover */}
                            <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-[#6f7ff5]/30 transition" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}
