"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* --- variants --- */
const sectionIn = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const imgIn = {
    hidden: { opacity: 0, x: 18, scale: 0.98 },
    show: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.55, ease: "easeOut" },
    },
};

export default function Hero() {
    return (
        <motion.section
            className="bg-white border border-gray-300"
            variants={sectionIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
        >
            <motion.div
                className="mx-auto max-w-7xl px-4 md:py-10 grid grid-cols-1 md:grid-cols-2 items-center gap-10"
                variants={container}
            >
                {/* Left content */}
                <div>
                    <motion.h1
                        variants={fadeUp}
                        className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
                    >
                        Global partnerships
                        <br />
                        that just work
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        className="mt-4 text-gray-700 text-base md:text-lg"
                    >
                        <span className="font-semibold">HMH</span> partnership marketing
                        platform helps advertisers and publishers of all sizes to grow their
                        businesses globally.
                    </motion.p>

                    <motion.div variants={fadeUp}>
                        <Link
                            href="#"
                            className="mt-6 inline-block rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            For Brands
                        </Link>
                    </motion.div>
                </div>

                {/* Right side: single composite image */}
                <motion.div
                    className="flex justify-end"
                    variants={imgIn}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                >
                    <Image
                        src="/imgs/hero.png"
                        alt="Hero visual"
                        width={680}
                        height={560}
                        className="rounded-lg max-w-full md:max-w-[400px]"
                        priority
                    />
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
