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
            className="relative overflow-hidden bg-white"
            variants={sectionIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 items-center gap-12"
                variants={container}
            >
                {/* Left content */}
                <div className="space-y-8">
                    <motion.div variants={fadeUp} className="space-y-4">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200/50 text-sm font-medium text-blue-700">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            Trusted by 10,000+ businesses worldwide
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            Global partnerships
                            <br />
                            <span className="gradient-text">that just work</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        variants={fadeUp}
                        className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl"
                    >
                        <span className="font-semibold text-blue-600">HMH</span> partnership marketing
                        platform helps advertisers and publishers of all sizes to grow their
                        businesses globally with cutting-edge technology and proven strategies.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="#"
                            className="btn-primary text-base px-8 py-4 inline-flex items-center justify-center"
                        >
                            Start as Brand
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            className="btn-secondary text-base px-8 py-4 inline-flex items-center justify-center"
                        >
                            Join as Publisher
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div variants={fadeUp} className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200/50">
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-gray-900">10K+</div>
                            <div className="text-sm text-gray-600">Active Publishers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-gray-900">500+</div>
                            <div className="text-sm text-gray-600">Brand Partners</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-gray-900">$50M+</div>
                            <div className="text-sm text-gray-600">Revenue Generated</div>
                        </div>
                    </motion.div>
                </div>

                {/* Right side: enhanced image with floating elements */}
                <motion.div
                    className="relative flex justify-center lg:justify-end"
                    variants={imgIn}
                >
                    <div className="relative">
                        {/* Main image with enhanced styling */}
                        <motion.div
                            className="relative z-10"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 220, damping: 20 }}
                        >
                            <Image
                                src="/imgs/hero.png"
                                alt="Hero visual showing partnership marketing platform"
                                width={680}
                                height={560}
                                className="rounded-2xl shadow-2xl max-w-full lg:max-w-[500px]"
                                priority
                            />
                        </motion.div>

                        {/* Floating decorative elements */}
                        <motion.div
                            className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-lg"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        ></motion.div>
                        <motion.div
                            className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full shadow-lg"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        ></motion.div>
                        <motion.div
                            className="absolute top-1/2 -left-8 w-8 h-8 bg-gradient-to-br from-pink-500 to-red-500 rounded-full shadow-lg"
                            animate={{ x: [0, -5, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        ></motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
