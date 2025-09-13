"use client";

import { FaStore, FaShoppingBag, FaSyncAlt, FaTruck } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";

/* --- minimal, reusable variants --- */
const sectionFade = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};
const cardUp = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};
const arrowFade = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function HowToStart() {
    const steps = [
        {
            id: 1,
            icon: <FaStore size={40} className="text-white" />,
            title: "Source Winning Products",
            description: "Discover trending products from our curated catalog of verified suppliers and winning items.",
            gradient: "from-blue-500 to-blue-600",
            bgGradient: "from-blue-50 to-blue-100"
        },
        {
            id: 2,
            icon: <FaShoppingBag size={40} className="text-white" />,
            title: "Connect Your Store",
            description: "Seamlessly integrate your e-commerce platform and list products with our one-click setup.",
            gradient: "from-green-500 to-green-600",
            bgGradient: "from-green-50 to-green-100"
        },
        {
            id: 3,
            icon: <FaSyncAlt size={40} className="text-white" />,
            title: "Auto-Sync Orders",
            description: "Automatically sync orders to our system and process payments with our secure payment gateway.",
            gradient: "from-purple-500 to-purple-600",
            bgGradient: "from-purple-50 to-purple-100"
        },
        {
            id: 4,
            icon: <FaTruck size={40} className="text-white" />,
            title: "Fulfill & Track",
            description: "We handle fulfillment, shipping, and provide real-time tracking for your customers.",
            gradient: "from-orange-500 to-orange-600",
            bgGradient: "from-orange-50 to-orange-100"
        },
    ];

    return (
        <motion.section
            className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20 px-4 select-none"
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-indigo-200 text-sm font-medium text-indigo-700 mb-6">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                        Get Started
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        How to Start <span className="gradient-text">Dropshipping</span> with HMH?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Launch your dropshipping business in 4 simple steps with our comprehensive platform and expert support.
                    </p>
                </motion.div>

                {/* Steps Layout */}
                <motion.div
                    className="relative"
                    variants={container}
                >
                    {/* Desktop Connection Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 via-purple-200 to-orange-200 transform -translate-y-1/2 z-0"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                    {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                variants={cardUp}
                                className="group"
                            >
                                {/* Step Card */}
                                <motion.div
                                    whileHover={{
                                        y: -8,
                                        transition: { type: "spring", stiffness: 300, damping: 20 }
                                    }}
                                    className="relative"
                                >
                                    <div className="card p-8 text-center h-full hover:shadow-2xl transition-all duration-300">
                                        {/* Step Number */}
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                {step.id}
                                            </div>
                                        </div>

                                        {/* Icon Container */}
                                        <motion.div
                                            className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${step.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                                            whileHover={{ rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            {step.icon}
                                        </motion.div>

                                        {/* Content */}
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed text-sm">
                                                {step.description}
                                            </p>
                                        </div>

                                        {/* Decorative Background */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                    </div>
                                </motion.div>

                                {/* Arrow (Mobile) */}
                            {index !== steps.length - 1 && (
                                <motion.div
                                    variants={arrowFade}
                                        className="lg:hidden flex justify-center my-6"
                                >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                                            <FaArrowRight size={16} className="text-white rotate-90" />
                                        </div>
                                </motion.div>
                            )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </motion.section>
    );
}
