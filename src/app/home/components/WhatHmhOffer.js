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
            icon: <FaSearch className="text-[#003366]" size={40} />,
            title: "Sourcing",
            desc: "Simplify product sourcing, allowing you to easily find and connect with reliable suppliers, all in one place.",
        },
        {
            icon: <FaTruck className="text-[#003366]" size={40} />,
            title: "3PL Fulfillment",
            desc: "Enjoy hassle-free order processing and lightning-fast global shipping for your own products stocked in HMH’s warehouse.",
        },
        {
            icon: <FaBoxOpen className="text-[#003366]" size={40} />,
            title: "Custom Packing",
            desc: "Elevate your brand with custom packaging that reflects your unique style.",
        },
        {
            icon: <FaUserCog className="text-[#003366]" size={40} />,
            title: "ODM Power",
            desc: "Collaborate with HMH’s top manufacturers to develop your exclusive, high-quality products.",
        },
        {
            icon: <FaPrint className="text-[#003366]" size={40} />,
            title: "Print on demand",
            desc: "Bring your creative visions to life with custom-printed merchandise.",
        },
        {
            icon: <FaPhotoVideo className="text-[#003366]" size={40} />,
            title: "Photo/Video Shooting service",
            desc: "Captivate your audience with professional product photos and engaging videos provided by HMH.",
        },
    ];

    return (
        <motion.section
            className="bg-white py-14 px-4 select-none"
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
        >
            <div className="max-w-[1250px] mx-auto">
                <motion.h2
                    className="text-center text-2xl md:text-3xl font-semibold mb-10 text-black"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0, transition: { duration: 0.45 } }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    What HMH Offer?
                </motion.h2>

                <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6" variants={container}>
                    {services.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={cardUp}
                            whileHover={{
                                y: -4,
                                boxShadow:
                                    "0 12px 28px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05)",
                            }}
                            className="border border-gray-300 rounded-md p-6 bg-white shadow-sm flex flex-col items-start text-left gap-4 h-full"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                            >
                                {item.icon}
                            </motion.div>
                            <h3 className="text-lg font-semibold text-[#003366]">{item.title}</h3>
                            <p className="text-gray-700 text-[15px] leading-snug">{item.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}
