"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { motion } from "framer-motion";

/* --- minimal variants --- */
const sectionFade = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const slideWrap = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const scaleIn = {
    hidden: { opacity: 0, scale: 0.98 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

// Slides (same)
const slides = [
    {
        logo: "/imgs/warfare.png", title: "Consumer electronics platform", desc: `A top electronic platform active in Poland bosst GMV by 138% YOY with tracking
Promo codes and HMH influencer and coupon partnership.`, link: "#"
    },
    { logo: "/imgs/bandlab.png", title: "BandLab", desc: `How BandLab scaled user acquisition 120% through a strategic coupon drive.`, link: "#" },
    { logo: "/imgs/disnep.png", title: "Disnep Streaming", desc: `Boosted annual passes with 95 % retention using HMH promo technology.`, link: "#" },
    { logo: "/imgs/paypal.png", title: "PayPal", desc: `Cross-border GMV up 48 % after integrating HMH merchant campaigns.`, link: "#" },
    { logo: "/imgs/visa.png", title: "Visa", desc: `Visa Black cardholders redeemed 70 % more perks via exclusive HMH offers.`, link: "#" },
    { logo: "/imgs/mastercard.png", title: "Mastercard", desc: `Global cashback uplifted 63 % YOY through HMH influencer bundles.`, link: "#" },
];

export default function CaseStudiesCarousel() {
    const swiperRef = useRef(null);
    const dotsRef = useRef(null);

    return (
        <motion.section
            className="csc bg-white py-20 px-4 select-none"
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
                        Success Stories
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Client <span className="gradient-text">Case Studies</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Discover how leading brands achieved remarkable growth and success with HMH&apos;s partnership marketing solutions.
                    </p>
                </motion.div>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    onSwiper={(s) => (swiperRef.current = s)}
                    onBeforeInit={(swiper) => {
                        swiper.params.pagination = {
                            ...(swiper.params.pagination || {}),
                            el: dotsRef.current,
                            clickable: true,
                            bulletClass:
                                "csc-bullet w-3 h-3 rounded-full border-2 border-blue-300 mx-1 inline-block transition-all duration-300",
                            bulletActiveClass: "is-active",
                        };
                    }}
                    slidesPerView={1}
                    loop
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    pagination={{
                        el: dotsRef.current,
                        clickable: true,
                        bulletClass:
                            "csc-bullet w-3 h-3 rounded-full border-2 border-blue-300 mx-1 inline-block transition-all duration-300",
                        bulletActiveClass: "is-active",
                    }}
                    className="rounded-2xl shadow-xl"
                >
                    {slides.map((s, i) => (
                        <SwiperSlide key={i}>
                            <motion.div
                                className="bg-white rounded-2xl p-8 md:p-12 flex flex-col lg:flex-row items-center gap-8 shadow-lg border border-gray-100"
                                variants={slideWrap}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.4 }}
                            >
                                {/* Logo Section */}
                                <motion.div className="w-full lg:w-[35%] flex justify-center items-center" variants={scaleIn}>
                                    <div className="relative w-[120px] h-[120px] bg-gray-50 rounded-2xl p-6 shadow-md border border-gray-100">
                                        <Image 
                                            src={s.logo} 
                                            alt={s.title} 
                                            fill 
                                            className="object-contain" 
                                        />
                                    </div>
                                </motion.div>

                                {/* Content Section */}
                                <div className="w-full lg:w-[65%] text-gray-900 text-left space-y-6">
                                    <motion.div variants={fadeUp}>
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-medium text-blue-700 mb-4">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                            Case Study
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                                            {s.title}
                                        </h3>
                                    </motion.div>
                                    
                                    <motion.p 
                                        className="text-lg text-gray-600 leading-relaxed whitespace-pre-line" 
                                        variants={fadeUp}
                                    >
                                        {s.desc}
                                    </motion.p>
                                    
                                    <motion.div variants={fadeUp}>
                                        <a 
                                            href={s.link} 
                                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors duration-200 group"
                                        >
                                            Read Full Case Study
                                            <svg 
                                                className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </a>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Enhanced Dots */}
                <motion.div
                    className="mt-8 flex justify-center items-center"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div ref={dotsRef} className="csc-dots" />
                </motion.div>

            </div>

            {/* Enhanced Scoped Styles */}
            <style jsx global>{`
        .csc .csc-dots.swiper-pagination {
          position: static !important;
          width: auto !important;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin: 0 auto;
        }
        .csc .csc-bullet {
          opacity: 1;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .csc .csc-bullet:hover {
          border-color: #3b82f6;
          transform: scale(1.1);
        }
        .csc .csc-bullet.is-active {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-color: #3b82f6;
          transform: scale(1.2);
        }
      `}</style>
        </motion.section>
    );
}
