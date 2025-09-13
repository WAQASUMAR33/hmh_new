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
            icon: <FaStore size={50} className="text-[#003366]" />,
            title: "Source and Sell\nWinning Products",
        },
        {
            id: 2,
            icon: <FaShoppingBag size={50} className="text-[#003366]" />,
            title: "Connect Store and List\nProducts",
        },
        {
            id: 3,
            icon: <FaSyncAlt size={50} className="text-[#003366]" />,
            title: "Auto-sync Store\nOrders to CJ and Pay\nfor Them",
        },
        {
            id: 4,
            icon: <FaTruck size={50} className="text-[#003366]" />,
            title: "Fulfill and Track\nCustomer Orders",
        },
    ];

    return (
        <motion.section
            className="bg-[#ecedfa] py-10 px-4 select-none"
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="max-w-[1250px] mx-auto">
                <motion.h2
                    className="text-center text-3xl md:text-4xl font-semibold mb-12 text-black"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    How to Start Dropshipping with HMH?
                </motion.h2>

                {/* Responsive Layout */}
                <motion.div
                    className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-0"
                    variants={container}
                >
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="flex flex-col md:flex-row items-center md:items-start"
                        >
                            {/* Card */}
                            <motion.div
                                variants={cardUp}
                                whileHover={{
                                    translateY: -2,
                                    boxShadow:
                                        "0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)",
                                }}
                                className="relative w-full md:w-[270px] min-h-[200px] bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center"
                            >
                                <div className="absolute top-0 left-0 bg-[#1a3cff] text-white text-sm px-2 py-1 rounded-br-xl font-bold">
                                    {step.id}
                                </div>
                                {step.icon}
                                <p className="mt-4 text-[16px] text-black whitespace-pre-line">
                                    {step.title}
                                </p>
                            </motion.div>

                            {/* Arrow (desktop) */}
                            {index !== steps.length - 1 && (
                                <motion.div
                                    variants={arrowFade}
                                    className="hidden md:flex mx-3 text-[#1a3cff]"
                                >
                                    <FaArrowRight size={24} />
                                </motion.div>
                            )}

                            {/* Arrow (mobile) */}
                            {index !== steps.length - 1 && (
                                <motion.div
                                    variants={arrowFade}
                                    className="md:hidden my-3 text-[#1a3cff]"
                                >
                                    <FaArrowRight size={24} className="rotate-90" />
                                </motion.div>
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* Footer Note */}
                <motion.div
                    className="mt-10 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0, transition: { duration: 0.45 } }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <div className="bg-white text-center text-black text-[16px] font-medium py-4 px-6 rounded-md shadow-md">
                        You may also place wholesale orders to have them stocked in HMH
                        warehouses, without a store.
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}
