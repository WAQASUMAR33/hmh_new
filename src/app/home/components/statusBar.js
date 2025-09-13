"use client";
import { FaBullhorn, FaCloud, FaGlobe, FaProjectDiagram } from "react-icons/fa";
import { motion } from "framer-motion";

/* --- animation presets --- */
const sectionFade = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const rowStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } },
};
const itemUp = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function StatsBar() {
    return (
        <motion.section
            className="bg-[#E7E9FA] py-6 select-none"
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
        >
            <motion.div
                className="max-w-[1200px] mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-x-6 gap-y-6 text-center"
                variants={rowStagger}
            >
                {/* Stat Item */}
                <motion.div
                    variants={itemUp}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-3 min-w-[160px] sm:min-w-[180px]"
                >
                    <FaBullhorn className="text-[#6f7ff5] text-[28px] sm:text-[32px]" />
                    <div className="text-left">
                        <div className="text-[18px] sm:text-[20px] font-bold text-black leading-tight">12k+</div>
                        <div className="text-[14px] sm:text-[15px] text-black">Advertisers</div>
                    </div>
                </motion.div>

                <motion.div variants={itemUp} className="text-[#6f7ff5] text-[24px] sm:text-[28px] font-bold">+</motion.div>

                <motion.div
                    variants={itemUp}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-3 min-w-[160px] sm:min-w-[180px]"
                >
                    <FaCloud className="text-[#6f7ff5] text-[28px] sm:text-[32px]" />
                    <div className="text-left">
                        <div className="text-[18px] sm:text-[20px] font-bold text-black leading-tight">75k+</div>
                        <div className="text-[14px] sm:text-[15px] text-black">Publishers</div>
                    </div>
                </motion.div>

                <motion.div variants={itemUp} className="text-[#6f7ff5] text-[24px] sm:text-[28px] font-bold">+</motion.div>

                <motion.div
                    variants={itemUp}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-3 min-w-[160px] sm:min-w-[180px]"
                >
                    <FaGlobe className="text-[#6f7ff5] text-[28px] sm:text-[32px]" />
                    <div className="text-left">
                        <div className="text-[18px] sm:text-[20px] font-bold text-black leading-tight">65+</div>
                        <div className="text-[14px] sm:text-[15px] text-black">Networks</div>
                    </div>
                </motion.div>

                <motion.div variants={itemUp} className="text-[#6f7ff5] text-[24px] sm:text-[28px] font-bold">=</motion.div>

                <motion.div
                    variants={itemUp}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-3 min-w-[160px] sm:min-w-[180px]"
                >
                    <FaProjectDiagram className="text-[#6f7ff5] text-[28px] sm:text-[32px]" />
                    <div className="text-left">
                        <div className="text-[18px] sm:text-[20px] font-bold text-black leading-tight">1</div>
                        <div className="text-[14px] sm:text-[15px] text-black">Network</div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
