'use client';
import { motion } from 'framer-motion';

const stats = [
    { title: 'Clicks', value: '12,304' },
    { title: 'Conversions', value: '932' },
    { title: 'Commission', value: '$3,420.50' },
    { title: 'Advertisers', value: '45' },
];

export default function OverviewCards() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="p-6"
        >
            <h2 className="text-base md:text-lg font-medium text-gray-800 mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                    >
                        <h3 className="text-2xl md:text-3xl font-semibold text-gray-600 mb-2 leading-tight">{stat.title}</h3>
                        <p className="text-xl md:text-2xl font-bold text-violet-700 tracking-tight">{stat.value}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
