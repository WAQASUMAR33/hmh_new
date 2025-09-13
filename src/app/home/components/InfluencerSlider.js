"use client";

import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { useSwipeable } from "react-swipeable";
import { motion } from "framer-motion";

const slides = [
    {
        tag: "BRAND",
        title: "Influencer marketing with Takefluence",
        desc: "Increase Brand awareness and sales with content creators. Push your offerings through social media influencers and bloggers.",
        image: "/imgs/slides/brand.png",
    },
    {
        tag: "CREATORS",
        title: "Work with Top Creators",
        desc: "Partner with top creators and tap into highly engaged niche audiences across social platforms.",
        image: "/imgs/slides/brand.png",
    },
    {
        tag: "PERFORMANCE",
        title: "Drive measurable influencer ROI",
        desc: "Combine creator reach with data to optimize engagement, visibility, and ROI.",
        image: "/imgs/slides/brand.png",
    },
    {
        tag: "EXPAND",
        title: "Scale campaigns globally",
        desc: "Leverage global creators to expand into new markets with minimal effort.",
        image: "/imgs/slides/brand.png",
    },
];

export default function InfluencerSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(
            () => setCurrent((p) => (p + 1) % slides.length),
            5000
        );
        return () => clearInterval(interval);
    }, []);

    const handlers = useSwipeable({
        onSwipedLeft: () => setCurrent((p) => (p + 1) % slides.length),
        onSwipedRight: () => setCurrent((p) => (p - 1 + slides.length) % slides.length),
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    // Motion variants
    const wrapperVariants = useMemo(
        () => ({
            hidden: { opacity: 0, y: 20 },
            show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut" },
            },
        }),
        []
    );

    const activeCard = useMemo(
        () => ({
            inactive: { opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.25 } },
            active: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.45, ease: "easeOut" },
            },
        }),
        []
    );

    const textStagger = useMemo(
        () => ({
            show: {
                transition: { staggerChildren: 0.08, delayChildren: 0.05 },
            },
        }),
        []
    );

    const textItem = useMemo(
        () => ({
            hidden: { opacity: 0, y: 14 },
            show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
        }),
        []
    );

    return (
        <motion.section
            className="py-10 px-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={wrapperVariants}
        >
            <div
                {...handlers}
                className="max-w-[1250px] mx-auto bg-[#ECEDFA]  rounded-xl overflow-hidden relative min-h-[460px]"
            >
                {/* Slide container (kept as-is for your carousel logic) */}
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                        width: `${slides.length * 100}%`,
                        transform: `translateX(-${(100 / slides.length) * current}%)`,
                    }}
                >
                    {slides.map((slide, index) => {
                        const isActive = current === index;
                        return (
                            <div
                                key={index}
                                className="w-full md:flex items-center gap-6 md:gap-10 px-6 py-10 flex-shrink-0"
                                style={{ width: `${100 / slides.length}%` }}
                            >
                                {/* Left content */}
                                <motion.div
                                    className="w-full md:w-1/2"
                                    variants={activeCard}
                                    initial="inactive"
                                    animate={isActive ? "active" : "inactive"}
                                >
                                    <motion.div
                                        variants={textStagger}
                                        initial="hidden"
                                        animate={isActive ? "show" : "hidden"}
                                    >
                                        <motion.p
                                            variants={textItem}
                                            className="text-[#999] text-[16px] font-bold uppercase tracking-wide mb-2"
                                        >
                                            {slide.tag}
                                        </motion.p>
                                        <motion.h2
                                            variants={textItem}
                                            className="text-[28px] md:text-[32px] font-extrabold text-black leading-snug mb-4"
                                        >
                                            {slide.title}
                                        </motion.h2>
                                        <motion.p variants={textItem} className="text-[17px] text-[#555] mb-6">
                                            {slide.desc}
                                        </motion.p>
                                        <motion.button
                                            variants={textItem}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-[#001aff] hover:bg-[#0012cc] text-white font-bold text-[16px] px-6 py-3 rounded-lg"
                                        >
                                            Learn more
                                        </motion.button>
                                    </motion.div>
                                </motion.div>

                                {/* Right image */}
                                <motion.div
                                    className="w-full md:w-1/2 flex justify-center mt-6 md:mt-0"
                                    variants={activeCard}
                                    initial="inactive"
                                    animate={isActive ? "active" : "inactive"}
                                >
                                    <motion.div
                                        className="relative w-[280px] h-[240px] md:w-[340px] md:h-[280px]"
                                        initial={{ opacity: 0, y: 18, rotate: -1 }}
                                        animate={
                                            isActive
                                                ? {
                                                    opacity: 1,
                                                    y: 0,
                                                    rotate: 0,
                                                    transition: { duration: 0.5, ease: "easeOut", delay: 0.05 },
                                                }
                                                : { opacity: 0, y: 18, rotate: -1 }
                                        }
                                        whileHover={{ y: -4 }}
                                    >
                                        <Image src={slide.image} alt={slide.title} fill className="object-contain" />
                                    </motion.div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Dots */}
                <div className="absolute bottom-[28px] left-1/2 -translate-x-1/2 flex gap-3 z-10">
                    {slides.map((_, index) => (
                        <motion.button
                            key={index}
                            onClick={() => setCurrent(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`w-[12px] h-[12px] rounded-full border border-black ${current === index ? "bg-black" : "bg-transparent"
                                }`}
                        />
                    ))}
                </div>
                    
                {/* Arrows (inside box) */}
                <div className="absolute bottom-[20px] w-full flex justify-between px-10 z-10">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full text-xl"
                        aria-label="Previous slide"
                    >
                        &#8592;
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrent((p) => (p + 1) % slides.length)}
                        className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full text-xl"
                        aria-label="Next slide"
                    >
                        &#8594;
                    </motion.button>
                </div>
            </div>
        </motion.section>
    );
}
