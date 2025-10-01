"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* --- minimal variants --- */
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const scaleIn = {
    hidden: { opacity: 0, scale: 0.98 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function PublisherSolutions() {
    return (
        <motion.section
            className="py-16 px-4 select-none bg-white"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="card flex flex-col lg:flex-row items-center gap-12">
                    {/* Left Image */}
                    <motion.div className="w-full lg:w-[50%] flex justify-center" variants={scaleIn}>
                        <div className="relative">
                            <div className="relative w-[280px] h-[240px] md:w-[320px] md:h-[280px]">
                                <Image
                                    src="/imgs/publishers-solution.png"
                                    alt="Publisher Solutions Illustration"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            {/* Decorative background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl -z-10 transform -rotate-3"></div>
                        </div>
                    </motion.div>

                    {/* Right Content */}
                    <div className="w-full lg:w-[50%] text-center lg:text-left space-y-6">
                        <motion.div variants={fadeUp} className="space-y-4">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 border border-green-200 text-sm font-medium text-green-700">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                For Publishers
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Solutions for 
                                <span className="gradient-text"> publishers</span>
                            </h2>
                        </motion.div>

                        <motion.p
                            className="text-lg text-gray-600 leading-relaxed"
                            variants={fadeUp}
                        >
                            Content websites, influencers and creators, price comparison sites, subnetworks,
                            deal and cashback services, email marketers, and media buyers can open new
                            revenue streams with <span className="font-semibold text-green-600">HMH&apos;s portfolio of brands</span> across 40+ categories.
                        </motion.p>

                        {/* Features list */}
                        <motion.div variants={fadeUp} className="space-y-3">
                            {[
                                "Access to 500+ premium brands",
                                "Advanced tracking and reporting",
                                "Flexible payment options",
                                "Dedicated account management"
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href="#"
                                className="btn-primary text-base px-8 py-4 inline-flex items-center justify-center"
                            >
                                Join as Publisher
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
