"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ReadAboutUs() {
    const sources = [
        { src: "/imgs/readaboutus/forbes.png", alt: "Forbes" },
        { src: "/imgs/readaboutus/wikipedia.png", alt: "Wikipedia" },
        { src: "/imgs/readaboutus/guardian.png", alt: "The Guardian" },
        { src: "/imgs/readaboutus/business-insider.png", alt: "Business Insider" },
        { src: "/imgs/readaboutus/hellopartner.png", alt: "Hello Partner" },
    ];

    // animation variants
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    const stagger = {
        hidden: {},
        show: { transition: { staggerChildren: 0.12 } },
    };

    return (
        <section className="bg-[#f9f9f9] py-10 select-none">
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="max-w-[1280px] mx-auto px-6 text-center"
            >
                {/* Title */}
                <motion.h2
                    variants={fadeUp}
                    className="text-[24px] md:text-[28px] font-bold text-black mb-10"
                >
                    Read About Us
                </motion.h2>

                {/* Logos */}
                <motion.div
                    variants={stagger}
                    className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8"
                >
                    {sources.map((item, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeUp}
                            className="w-[160px] h-[80px] border border-gray-300 bg-white flex items-center justify-center px-4 rounded-md shadow-sm hover:shadow-md transition"
                        >
                            <Image
                                src={item.src}
                                alt={item.alt}
                                width={130}
                                height={50}
                                className="object-contain"
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
