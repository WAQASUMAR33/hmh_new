"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* --- minimal variants --- */
const sectionFade = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const cols = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const iconIn = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function Footer() {
    const commonLinkCls = "hover:text-blue-600 transition";

    return (
        <motion.footer
            className="bg-[#ECEDFA] text-gray-900 border-t border-gray-300"
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
        >
            {/* top grid */}
            <motion.div
                className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-2 gap-y-10 gap-x-6 md:grid-cols-4 lg:gap-x-12"
                variants={cols}
            >
                {/* col‑1 : logo + links + subscribe */}
                <motion.div variants={fadeUp}>
                    {/* logo */}
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <Image src="/imgs/logo.png" alt="HMH Logo" width={110} height={110} />
                        <div className="leading-none" />
                    </Link>

                    <ul className="space-y-1 text-sm font-medium">
                        {[
                            "Our offers",
                            "Overview",
                            "About Us",
                            "Contact Us",
                            "User Agreement",
                            "Privacy Policy",
                        ].map((txt) => (
                            <li key={txt} className={commonLinkCls}>
                                <Link href="#">{txt}</Link>
                            </li>
                        ))}
                    </ul>

                    {/* subscribe */}
                    <button className="mt-6 w-40 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700">
                        Subscribe
                    </button>
                    <p className="mt-2 text-sm">Subscribe to our latest News</p>
                </motion.div>

                {/* middle columns */}
                {[
                    {
                        title: "Completion",
                        items: [
                            "Tracking Order",
                            "3PF Fulfillment",
                            "Fulfillment Fee",
                            "Quality Inspection",
                            "Custom Packing",
                        ],
                    },
                    {
                        title: "Company",
                        items: ["Location", "Career", "News", "History", "Academy", "For press"],
                    },
                ].map(({ title, items }) => (
                    <motion.div key={title} variants={fadeUp}>
                        <h3 className="font-semibold text-lg mb-3 relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-[0.5px] after:w-32 after:bg-black">
                            {title}
                        </h3>
                        <ul className="space-y-1 text-sm font-medium">
                            {items.map((it) => (
                                <li key={it} className={commonLinkCls}>
                                    <Link href="#">{it}</Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}

                {/* sourcing + payment methods */}
                <motion.div variants={fadeUp}>
                    <h3 className="font-semibold text-lg mb-3 relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-[0.5px] after:w-32 after:bg-black">
                        Sourcing
                    </h3>
                    <ul className="space-y-1 text-sm font-medium mb-6 md:mb-8 lg:mb-10">
                        {[
                            "Product Sourcing",
                            "Print on Demand",
                            "ODM",
                            "Global Product",
                            "Bulk Purchase",
                            "HMH Supplier",
                        ].map((it) => (
                            <li key={it} className={commonLinkCls}>
                                <Link href="#">{it}</Link>
                            </li>
                        ))}
                    </ul>

                    {/* payment methods */}
                    <h4 className="font-semibold mb-2">Payment Methods</h4>
                    <div className="grid grid-cols-3 gap-2">
                        {["visa", "jazzcash", "paypal", "easypaisa", "googlepay", "mastercard"].map(
                            (pm, i) => (
                                <motion.div key={pm} variants={iconIn} custom={i}>
                                    <Image
                                        src={`/imgs/${pm}.png`}
                                        alt={pm}
                                        width={46}
                                        height={32}
                                        className="object-contain"
                                    />
                                </motion.div>
                            ),
                        )}
                    </div>
                </motion.div>
            </motion.div>

            {/* bottom bar */}
            <motion.div
                className="border-t border-gray-300 text-center text-xs py-4 bg-gray-200"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1, transition: { duration: 0.35 } }}
                viewport={{ once: true, amount: 0.2 }}
            >
                ©2025 HMH.com All Rights Reserved
            </motion.div>
        </motion.footer>
    );
}
