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
            className="py-10 px-4 select-none"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="max-w-[1250px] mx-auto bg-white rounded-xl border border-gray-300 p-6 md:p-10 flex flex-col md:flex-row-reverse items-center gap-6 md:gap-10">
                {/* Right Image (reversed) */}
                <motion.div className="w-full md:w-[50%] flex justify-center" variants={scaleIn}>
                    <div className="relative w-[220px] h-[200px] md:w-[260px] md:h-[240px]">
                        <Image
                            src="/imgs/publishers-solution.png"
                            alt="Publishers Illustration"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </motion.div>

                {/* Left Content */}
                <div className="w-full md:w-[50%] text-center md:text-justify">
                    <motion.h2
                        className="text-[22px] md:text-[24px] font-bold text-black mb-3"
                        variants={fadeUp}
                    >
                        Solutions for publishers
                    </motion.h2>

                    <motion.p
                        className="text-[16px] md:text-[17px] text-[#333] leading-relaxed mb-5"
                        variants={fadeUp}
                    >
                        Content websites, influencers and creators, price comparison sites, subnetworks,
                        deal and cashback services, email marketers, and media buyers can open new
                        revenue streams with Admitad’s portfolio of brands across 40+ categories.
                    </motion.p>

                    <motion.div variants={fadeUp}>
                        <Link
                            href="#"
                            className="inline-block bg-[#001aff] hover:bg-[#0012cc] transition-colors text-white font-bold text-[16px] px-6 py-3 rounded-lg"
                        >
                            Join as a Publisher
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}
