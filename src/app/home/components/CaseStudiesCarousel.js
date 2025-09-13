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
            className="csc bg-white py-14 px-4 select-none"
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
        >
            <div className="max-w-[1250px] mx-auto">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    onSwiper={(s) => (swiperRef.current = s)}
                    onBeforeInit={(swiper) => {
                        swiper.params.pagination = {
                            ...(swiper.params.pagination || {}),
                            el: dotsRef.current,
                            clickable: true,
                            bulletClass:
                                "csc-bullet w-4 h-4 rounded-full border-2 border-black mx-1 inline-block",
                            bulletActiveClass: "is-active",
                        };
                    }}
                    slidesPerView={1}
                    loop
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{
                        el: dotsRef.current,
                        clickable: true,
                        bulletClass:
                            "csc-bullet w-4 h-4 rounded-full border-2 border-black mx-1 inline-block",
                        bulletActiveClass: "is-active",
                    }}
                    className="rounded-xl"
                >
                    {slides.map((s, i) => (
                        <SwiperSlide key={i}>
                            <motion.div
                                className="bg-[#ECEDFA] rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
                                variants={slideWrap}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.4 }}
                            >
                                {/* Logo */}
                                <motion.div className="w-full md:w-[30%] flex justify-center items-center" variants={scaleIn}>
                                    <div className="relative w-[100px] h-[100px]">
                                        <Image src={s.logo} alt={s.title} fill className="object-contain" />
                                    </div>
                                </motion.div>

                                {/* Content */}
                                <div className="w-full md:w-[70%] text-black text-left">
                                    <motion.h3 className="text-xl md:text-2xl font-bold mb-2" variants={fadeUp}>
                                        {s.title}
                                    </motion.h3>
                                    <motion.p className="text-[16px] leading-snug whitespace-pre-line mb-4" variants={fadeUp}>
                                        {s.desc}
                                    </motion.p>
                                    <motion.a href={s.link} className="text-[18px] font-bold text-blue-700 hover:underline inline-block" variants={fadeUp}>
                                        Learn more &gt;
                                    </motion.a>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Dots only */}
                <motion.div
                    className="mt-6 flex justify-center items-center"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div ref={dotsRef} className="csc-dots" />
                </motion.div>
            </div>

            {/* Scoped styles (namespaced to .csc) */}
            <style jsx global>{`
        .csc .csc-dots.swiper-pagination {
          /* force center */
          position: static !important;
          width: auto !important;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin: 0 auto;
        }
        .csc .csc-bullet {
          opacity: 1;
          background: transparent;
        }
        .csc .csc-bullet.is-active {
          background: black;
        }
      `}</style>
        </motion.section>
    );
}
