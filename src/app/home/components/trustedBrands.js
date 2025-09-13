"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function TrustedBrands() {
    const brandLogos = [
        "visa.png",
        "mastercard.png",
        "oracle.png",
        "mixer.png",
        "warfare.png",
        "replit.png",
        "x.png",
        "disnep.png",
        "bandlab.png",
        "samsung.png",
        "ios.png",
        "huawei.png",
        "galaxy.png",
        "mastercard.png",
    ];

    const fadeUp = {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
    };

    const container = {
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
    };

    return (
        <motion.section
            className="bg-gray-50 py-16 select-none"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
        >
            <div className="max-w-7xl mx-auto px-4 text-center">
                <motion.div variants={fadeUp} className="mb-12">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 mb-6">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Trusted Partners
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Trusted by the World&apos;s 
                        <span className="gradient-text"> Largest Brands</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join thousands of successful businesses that trust HMH for their partnership marketing needs
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center"
                    variants={container}
                >
                    {brandLogos.map((logo, index) => (
                        <motion.div
                            key={index}
                            variants={fadeUp}
                            whileHover={{ 
                                scale: 1.1,
                                y: -5,
                                transition: { type: "spring", stiffness: 300, damping: 20 }
                            }}
                            className="group relative"
                        >
                            <div className="w-24 h-24 md:w-28 md:h-28 relative bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center p-4 transition-all duration-300 group-hover:shadow-xl group-hover:border-blue-200">
                                <Image
                                    src={`/imgs/${logo}`}
                                    alt={`Brand ${index + 1}`}
                                    fill
                                    className="object-contain p-2 filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                    sizes="(max-width: 768px) 96px, 112px"
                                    priority={index < 4}
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Additional trust indicators */}
                <motion.div 
                    variants={fadeUp}
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                >
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
                        <div className="text-gray-600">Uptime Guarantee</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
                        <div className="text-gray-600">Expert Support</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">ISO 27001</div>
                        <div className="text-gray-600">Security Certified</div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}
