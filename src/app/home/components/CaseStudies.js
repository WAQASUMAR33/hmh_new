"use client";

import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const container = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

export default function CaseStudies() {
    return (
        <motion.section
            className="bg-white py-14 px-4 select-none"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="max-w-[900px] mx-auto text-center">
                <motion.h2
                    className="text-2xl md:text-3xl font-bold text-black mb-4"
                    variants={fadeUp}
                >
                    Case Studies
                </motion.h2>

                <motion.p
                    className="text-[17px] md:text-[18px] text-gray-800 mb-6 leading-snug"
                    variants={fadeUp}
                >
                    Partnerships work. But don’t just take our word for it
                    <br />
                    check out these case studies
                </motion.p>

                <motion.a
                    href="#"
                    className="text-[17px] font-semibold text-blue-700 hover:underline inline-block"
                    variants={fadeUp}
                >   
                    See more case studies &gt;
                </motion.a>
            </div>
        </motion.section>
    );
}
