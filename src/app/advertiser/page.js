'use client';
import Sidebar from '../advertiser/components/sidebar';
import Header from '../advertiser/components/header';
import OverviewCards from '../advertiser/components/overviewCards';
import { TrendingUp, Users, Activity, Clock, ArrowUpRight, Eye, MousePointer, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function advertiserDashboard() {
    // Mock data for advertiser-specific charts and activity
    const chartData = {
        performance: [
            { month: 'Jan', clicks: 1200, conversions: 45, spend: 2500 },
            { month: 'Feb', clicks: 1350, conversions: 52, spend: 2800 },
            { month: 'Mar', clicks: 1180, conversions: 38, spend: 2200 },
            { month: 'Apr', clicks: 1650, conversions: 68, spend: 3200 },
            { month: 'May', clicks: 1420, conversions: 55, spend: 2900 },
            { month: 'Jun', clicks: 1780, conversions: 72, spend: 3600 }
        ],
        campaigns: [
            { name: 'Tech Blog Campaign', status: 'active', budget: 5000, spent: 3200, clicks: 1200, conversions: 45 },
            { name: 'Social Media Push', status: 'paused', budget: 3000, spent: 1800, clicks: 850, conversions: 28 },
            { name: 'Video Content', status: 'active', budget: 8000, spent: 4200, clicks: 2100, conversions: 89 }
        ]
    };

    const recentActivity = [
        { id: 1, type: 'campaign', action: 'Campaign "Tech Blog" reached 1000 clicks', time: '5 minutes ago', status: 'success' },
        { id: 2, type: 'booking', action: 'New booking with TechReview.com', time: '1 hour ago', status: 'success' },
        { id: 3, type: 'payment', action: 'Payment of $2,500 processed', time: '2 hours ago', status: 'success' },
        { id: 4, type: 'message', action: 'New message from PublisherXYZ', time: '3 hours ago', status: 'info' },
        { id: 5, type: 'report', action: 'Monthly report generated', time: '1 day ago', status: 'info' }
    ];

    const getActivityIcon = (type) => {
        switch (type) {
            case 'campaign': return <TrendingUp className="w-4 h-4" />;
            case 'booking': return <Users className="w-4 h-4" />;
            case 'payment': return <DollarSign className="w-4 h-4" />;
            case 'message': return <Activity className="w-4 h-4" />;
            case 'report': return <Eye className="w-4 h-4" />;
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

            <div className="transition-all duration-300" style={{ marginLeft: 'var(--advertiser-sidebar-width, 80px)' }}>
                <Header />
                
                <div className="p-6 space-y-6">
                    {/* Overview Cards */}
                    <OverviewCards />

                    {/* Performance Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Campaign Performance */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl border border-blue-100/50 p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Campaign Performance</h3>
                                    <p className="text-sm text-gray-500">Clicks and conversions trend</p>
                                </div>
                                <div className="flex items-center gap-2 text-green-600">
                                    <ArrowUpRight className="w-4 h-4" />
                                    <span className="text-sm font-medium">+15.3%</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {chartData.performance.map((item, index) => (
                                    <div key={item.month} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600">{item.month}</span>
                                            <span className="text-xs text-gray-500">${item.spend}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1 bg-blue-100 rounded-full h-2 relative overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(item.clicks / 2000) * 100}%` }}
                                                    transition={{ delay: index * 0.1, duration: 0.8 }}
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                                />
                                            </div>
                                            <div className="flex-1 bg-green-100 rounded-full h-2 relative overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(item.conversions / 100) * 100}%` }}
                                                    transition={{ delay: index * 0.1 + 0.1, duration: 0.8 }}
                                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>{item.clicks} clicks</span>
                                            <span>{item.conversions} conversions</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Clicks</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Conversions</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Active Campaigns */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl border border-blue-100/50 p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Active Campaigns</h3>
                                    <p className="text-sm text-gray-500">Current campaign status</p>
                                </div>
                                <div className="flex items-center gap-2 text-blue-600">
                                    <MousePointer className="w-4 h-4" />
                                    <span className="text-sm font-medium">3 Active</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {chartData.campaigns.map((campaign, index) => (
                                    <motion.div
                                        key={campaign.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors duration-200"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-medium text-gray-800">{campaign.name}</h4>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                campaign.status === 'active' 
                                                    ? 'bg-green-100 text-green-600' 
                                                    : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                                {campaign.status}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Budget: ${campaign.budget.toLocaleString()}</span>
                                                <span>Spent: ${campaign.spent.toLocaleString()}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                                    style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>{campaign.clicks} clicks</span>
                                                <span>{campaign.conversions} conversions</span>
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
                                <p className="text-sm text-gray-500">Your latest campaign activities</p>
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
