"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* ---- minimal, reusable variants ---- */
const container = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.06, delayChildren: 0.08 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: "easeOut" },
    },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.98 },
    show: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.45, ease: "easeOut" },
    },
};

export default function BrandSolutions() {
    return (
        <motion.section
            className="py-16 px-4 select-none bg-white"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="card flex flex-col lg:flex-row-reverse items-center gap-12">
                    {/* Right Image */}
                    <motion.div className="w-full lg:w-[50%] flex justify-center" variants={scaleIn}>
                        <div className="relative">
                            <div className="relative w-[280px] h-[240px] md:w-[320px] md:h-[280px]">
                                <Image
                                    src="/imgs/brandsolution.png"
                                    alt="Brand Solutions Illustration"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            {/* Decorative background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl -z-10 transform rotate-3"></div>
                        </div>
                    </motion.div>

                    {/* Left Content */}
                    <div className="w-full lg:w-[50%] text-center lg:text-left space-y-6">
                        <motion.div variants={fadeUp} className="space-y-4">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-sm font-medium text-blue-700">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                For Brands
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Solutions for 
                                <span className="gradient-text"> brands</span>
                            </h2>
                        </motion.div>

                        <motion.p
                            className="text-lg text-gray-600 leading-relaxed"
                            variants={fadeUp}
                        >
                            Our platform connects brands and retailers with more than <span className="font-semibold text-blue-600">100,000 active publishers</span> all
                            over the world, using different digital business models. We develop innovations with new ideas
                            and future technologies to maximize your reach and ROI.
                        </motion.p>

                        {/* Features list */}
                        <motion.div variants={fadeUp} className="space-y-3">
                            {[
                                "Global publisher network access",
                                "Advanced tracking and analytics",
                                "Automated campaign management",
                                "24/7 dedicated support"
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href="#"
                                className="btn-primary text-base px-8 py-4 inline-flex items-center justify-center"
                            >
                                Join as Brand
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link
                                href="#"
                                className="btn-secondary text-base px-8 py-4 inline-flex items-center justify-center"
                            >
                                Learn More
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
