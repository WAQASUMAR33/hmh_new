'use client';
import Sidebar from '../publisher/components/sidebar';
import Header from '../publisher/components/header';
import OverviewCards from '../publisher/components/overviewCards';
import { TrendingUp, Users, Activity, Clock, ArrowUpRight, Eye, MousePointer, DollarSign, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublisherDashboard() {
    // Mock data for publisher-specific charts and activity
    const chartData = {
        performance: [
            { month: 'Jan', views: 45000, clicks: 1200, earnings: 850 },
            { month: 'Feb', views: 52000, clicks: 1350, earnings: 920 },
            { month: 'Mar', views: 48000, clicks: 1180, earnings: 780 },
            { month: 'Apr', views: 61000, clicks: 1650, earnings: 1120 },
            { month: 'May', views: 55000, clicks: 1420, earnings: 980 },
            { month: 'Jun', views: 67000, clicks: 1780, earnings: 1250 }
        ],
        opportunities: [
            { title: 'Tech Review Article', status: 'active', budget: 500, earned: 320, views: 12000, clicks: 450 },
            { title: 'Product Demo Video', status: 'completed', budget: 800, earned: 800, views: 25000, clicks: 890 },
            { title: 'Social Media Campaign', status: 'pending', budget: 300, earned: 0, views: 0, clicks: 0 }
        ]
    };

    const recentActivity = [
        { id: 1, type: 'opportunity', action: 'New opportunity "Gaming Review" available', time: '10 minutes ago', status: 'info' },
        { id: 2, type: 'payment', action: 'Payment of $850 received', time: '2 hours ago', status: 'success' },
        { id: 3, type: 'booking', action: 'Booking confirmed with TechCorp', time: '4 hours ago', status: 'success' },
        { id: 4, type: 'message', action: 'New message from AdvertiserXYZ', time: '6 hours ago', status: 'info' },
        { id: 5, type: 'content', action: 'Article "Tech Trends" published', time: '1 day ago', status: 'success' }
    ];

    const getActivityIcon = (type) => {
        switch (type) {
            case 'opportunity': return <FileText className="w-4 h-4" />;
            case 'payment': return <DollarSign className="w-4 h-4" />;
            case 'booking': return <Users className="w-4 h-4" />;
            case 'message': return <Activity className="w-4 h-4" />;
            case 'content': return <TrendingUp className="w-4 h-4" />;
            default: return <Activity className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'text-green-600 bg-green-100';
            case 'info': return 'text-blue-600 bg-blue-100';
            case 'warning': return 'text-yellow-600 bg-yellow-100';
            case 'error': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <Sidebar />
            
            {/* Sticky top header */}
            <div className="sticky top-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60" style={{ marginLeft: 'var(--publisher-sidebar-width, 80px)' }}>
                <Header />
            </div>

            {/* Main content shifts with sidebar width via CSS var */}
            <div className="transition-all duration-300" style={{ marginLeft: 'var(--publisher-sidebar-width, 80px)' }}>
                <div className="p-6 space-y-6">
                    {/* Overview Cards */}
                    <OverviewCards />

                    {/* Performance Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Content Performance */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl border border-blue-100/50 p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Content Performance</h3>
                                    <p className="text-sm text-gray-500">Views, clicks, and earnings trend</p>
                                </div>
                                <div className="flex items-center gap-2 text-green-600">
                                    <ArrowUpRight className="w-4 h-4" />
                                    <span className="text-sm font-medium">+18.7%</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {chartData.performance.map((item, index) => (
                                    <div key={item.month} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600">{item.month}</span>
                                            <span className="text-xs text-gray-500">${item.earnings}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1 bg-blue-100 rounded-full h-2 relative overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(item.views / 80000) * 100}%` }}
                                                    transition={{ delay: index * 0.1, duration: 0.8 }}
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                                />
                                            </div>
                                            <div className="flex-1 bg-green-100 rounded-full h-2 relative overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(item.clicks / 2000) * 100}%` }}
                                                    transition={{ delay: index * 0.1 + 0.1, duration: 0.8 }}
                                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>{item.views.toLocaleString()} views</span>
                                            <span>{item.clicks} clicks</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Views</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Clicks</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Active Opportunities */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl border border-blue-100/50 p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Active Opportunities</h3>
                                    <p className="text-sm text-gray-500">Current content opportunities</p>
                                </div>
                                <div className="flex items-center gap-2 text-blue-600">
                                    <FileText className="w-4 h-4" />
                                    <span className="text-sm font-medium">3 Available</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {chartData.opportunities.map((opportunity, index) => (
                                    <motion.div
                                        key={opportunity.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors duration-200"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-medium text-gray-800">{opportunity.title}</h4>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                opportunity.status === 'active' 
                                                    ? 'bg-green-100 text-green-600' 
                                                    : opportunity.status === 'completed'
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                                {opportunity.status}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Budget: ${opportunity.budget}</span>
                                                <span>Earned: ${opportunity.earned}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                                    style={{ width: `${(opportunity.earned / opportunity.budget) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>{opportunity.views.toLocaleString()} views</span>
                                                <span>{opportunity.clicks} clicks</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl border border-blue-100/50 p-6 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                                <p className="text-sm text-gray-500">Your latest content activities</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50/50 transition-colors duration-200"
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStatusColor(activity.status)}`}>
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                                    </div>
                                    <div className="text-xs text-gray-400">{activity.time}</div>
                                </motion.div>
                            ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                                View all activities →
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
