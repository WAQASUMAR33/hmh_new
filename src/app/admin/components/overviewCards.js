'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, FileText, Bell, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            staggerChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export default function OverviewCards() {
    const [stats, setStats] = useState({
        totalPublishers: 0,
        totalAdvertisers: 0,
        totalOpportunities: 0,
        totalBookings: 0,
        totalRevenue: 0,
        pendingAppeals: 0,
        suspendedAccounts: 0,
        activeUsers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminStats();
    }, []);

    const fetchAdminStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            const result = await response.json();
            if (result.success) {
                setStats(result.data);
            } else {
                throw new Error('Failed to fetch stats');
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            setStats({
                totalPublishers: 0,
                totalAdvertisers: 0,
                totalOpportunities: 0,
                totalBookings: 0,
                totalRevenue: 0,
                pendingAppeals: 0,
                suspendedAccounts: 0,
                activeUsers: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const statsCards = [
        { title: 'Total Publishers', value: stats.totalPublishers.toLocaleString(), icon: Users, chip: '+12%', chipColor: 'success' },
        { title: 'Total Advertisers', value: stats.totalAdvertisers.toLocaleString(), icon: UserCheck, chip: '+8%', chipColor: 'success' },
        { title: 'Active Opportunities', value: stats.totalOpportunities.toLocaleString(), icon: FileText, chip: '+15%', chipColor: 'success' },
        { title: 'Total Bookings', value: stats.totalBookings.toLocaleString(), icon: CheckCircle, chip: '+22%', chipColor: 'success' },
        { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, chip: '+18%', chipColor: 'success' },
        { title: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: TrendingUp, chip: '+5%', chipColor: 'default' },
        { title: 'Suspended Accounts', value: stats.suspendedAccounts.toLocaleString(), icon: AlertTriangle, chip: '-2%', chipColor: 'error' },
        { title: 'Pending Appeals', value: stats.pendingAppeals.toLocaleString(), icon: Bell, chip: '+3', chipColor: 'warning' }
    ];

    if (loading) {
        return (
            <div className="p-6 bg-gray-50">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
                    <p className="text-gray-600">Loading platform statistics...</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            className="p-6 bg-gray-50"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="mb-8" variants={cardVariants}>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
                <p className="text-gray-600">Real-time insights into your platform performance</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        variants={cardVariants}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                stat.chipColor === 'success' ? 'bg-green-100 text-green-800' :
                                stat.chipColor === 'error' ? 'bg-red-100 text-red-800' :
                                stat.chipColor === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {stat.chip}
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}


