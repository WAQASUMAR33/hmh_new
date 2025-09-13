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
            className="bg-white py-10 select-none"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
        >
            <div className="max-w-[1300px] mx-auto px-6 text-center">
                <motion.h2
                    className="text-[22px] md:text-[26px] font-semibold text-black mb-8"
                    variants={fadeUp}
                >
                    Trusted by the World’s Largest Brands
                </motion.h2>

                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-8 items-center justify-items-center"
                    variants={container}
                >
                    {brandLogos.map((logo, index) => (
                        <motion.div
                            key={index}
                            variants={fadeUp}
                            whileHover={{ scale: 1.08 }}
                            transition={{ type: "spring", stiffness: 220, damping: 18 }}
                            className="w-[100px] h-[100px] relative"
                        >
                            <Image
                                src={`/imgs/${logo}`}
                                alt={`Brand ${index + 1}`}
                                fill
                                className="object-contain"
                                sizes="100px"
                                priority={index < 4} // preload first row logos
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}
