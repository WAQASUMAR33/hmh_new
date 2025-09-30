"use client";

import { FaSearch, FaTruck, FaBoxOpen, FaUserCog, FaPrint, FaPhotoVideo } from "react-icons/fa";
import { motion } from "framer-motion";

/* --- animation presets --- */
const sectionFade = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};
const cardUp = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function WhatHMHOffer() {
    const services = [
        {
            icon: <FaSearch className="text-white" size={32} />,
            title: "Product Sourcing",
            desc: "Simplify product sourcing with our global network of verified suppliers. Find and connect with reliable manufacturers all in one place.",
            gradient: "from-blue-500 to-blue-600",
            bgGradient: "from-blue-50 to-blue-100"
        },
        {
            icon: <FaTruck className="text-white" size={32} />,
            title: "3PL Fulfillment",
            desc: "Enjoy hassle-free order processing and lightning-fast global shipping for your products stocked in our state-of-the-art warehouses.",
            gradient: "from-green-500 to-green-600",
            bgGradient: "from-green-50 to-green-100"
        },
        {
            icon: <FaBoxOpen className="text-white" size={32} />,
            title: "Custom Packaging",
            desc: "Elevate your brand with premium custom packaging solutions that reflect your unique style and enhance customer experience.",
            gradient: "from-purple-500 to-purple-600",
            bgGradient: "from-purple-50 to-purple-100"
        },
        {
            icon: <FaUserCog className="text-white" size={32} />,
            title: "ODM Development",
            desc: "Collaborate with our top-tier manufacturers to develop exclusive, high-quality products tailored to your brand requirements.",
            gradient: "from-orange-500 to-orange-600",
            bgGradient: "from-orange-50 to-orange-100"
        },
        {
            icon: <FaPrint className="text-white" size={32} />,
            title: "Print on Demand",
            desc: "Bring your creative visions to life with our advanced print-on-demand services for custom merchandise and promotional items.",
            gradient: "from-pink-500 to-pink-600",
            bgGradient: "from-pink-50 to-pink-100"
        },
        {
            icon: <FaPhotoVideo className="text-white" size={32} />,
            title: "Media Production",
            desc: "Captivate your audience with professional product photography and engaging video content created by our expert media team.",
            gradient: "from-indigo-500 to-indigo-600",
            bgGradient: "from-indigo-50 to-indigo-100"
        },
    ];

    return (
        <motion.section
            className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-4 select-none"
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-blue-200 text-sm font-medium text-blue-700 mb-6">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Our Services
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        What <span className="gradient-text">HMH Offers</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Comprehensive solutions for brands and publishers to scale their business globally with cutting-edge technology and expert support.
                    </p>
                </motion.div>

                {/* Services Grid */}
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={container}>
                    {services.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={cardUp}
                            whileHover={{
                                y: -8,
                                transition: { type: "spring", stiffness: 300, damping: 20 }
                            }}
                            className="group relative"
                        >
                            <div className="card h-full p-8 hover:shadow-2xl transition-all duration-300">
                                {/* Icon Container */}
                                <motion.div
                                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                                    whileHover={{ rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    {item.icon}
                                </motion.div>

                                {/* Content */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>

                                {/* Decorative Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA Section */}
                <motion.div 
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Ready to Transform Your Business?
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Join thousands of successful businesses that trust HMH for their global expansion and partnership marketing needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn-primary px-8 py-4 text-base">
                                Get Started Today
                            </button>
                            <button className="btn-secondary px-8 py-4 text-base">
                                Schedule a Demo
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}
