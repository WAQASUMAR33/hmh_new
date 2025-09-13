"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const insights = [
    {
        img: "/imgs/insight1.png",
        date: "June 9, 2025",
        title: "Best Affiliate Networks in 2025: the Ultimate Comparison Guide",
    },
    {
        img: "/imgs/insight2.png",
        date: "June 9, 2025",
        title: "Fast payments are back: Instant Payout Lite returns to Admitad",
    },
];

// Animation presets
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.12,
        },
    },
};

export default function IndustryInsights() {
    return (
        <motion.section
            className="bg-white py-14 px-4 select-none"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={container}
        >
            <div className="max-w-[1250px] mx-auto text-center">
                <motion.h2
                    className="text-2xl md:text-3xl font-extrabold text-black mb-2"
                    variants={fadeUp}
                >
                    Industry insights
                </motion.h2>

                <motion.a
                    href="#"
                    variants={fadeUp}
                    className="inline-block text-blue-700 font-semibold text-[16px] md:text-[17px] hover:underline"
                >
                    See more insights &gt;
                </motion.a>

                <motion.div
                    className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 text-left"
                    variants={container}
                >
                    {insights.map((item, i) => (
                        <motion.article
                            key={i}
                            variants={fadeUp}
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 250, damping: 22 }}
                            className="group"
                        >
                            {/* Image wrapper with gentle reveal + hover zoom */}
                            <motion.div
                                className="relative w-full h-[260px] md:h-[350px] rounded overflow-hidden"
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Image
                                    src={item.img}
                                    alt={item.title}
                                    fill
                                    className="object-cover will-change-transform transition-transform duration-500 group-hover:scale-[1.03]"
                                    sizes="(min-width: 768px) 600px, 100vw"
                                    priority={i === 0}
                                />
                                {/* Subtle gradient at bottom for legibility if needed later */}
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />
                            </motion.div>

                            <motion.p
                                className="text-[15px] text-[#666] mt-4 font-medium"
                                variants={fadeUp}
                            >
                                {item.date}
                            </motion.p>

                            <motion.h3
                                className="text-[18px] md:text-[20px] font-extrabold text-black leading-snug mt-1"
                                variants={fadeUp}
                            >
                                {item.title}
                            </motion.h3>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}
