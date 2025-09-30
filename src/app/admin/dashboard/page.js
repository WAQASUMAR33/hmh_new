'use client';
import AdminLayout from '../components/AdminLayout';
import OverviewCards from '../components/overviewCards';
import { LayoutDashboard, TrendingUp, Users, Activity, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    // Mock data for charts and recent activity
    const chartData = {
        revenue: [
            { month: 'Jan', value: 45000 },
            { month: 'Feb', value: 52000 },
            { month: 'Mar', value: 48000 },
            { month: 'Apr', value: 61000 },
            { month: 'May', value: 55000 },
            { month: 'Jun', value: 67000 }
        ],
        users: [
            { month: 'Jan', publishers: 120, advertisers: 85 },
            { month: 'Feb', publishers: 135, advertisers: 92 },
            { month: 'Mar', publishers: 128, advertisers: 88 },
            { month: 'Apr', publishers: 145, advertisers: 105 },
            { month: 'May', publishers: 138, advertisers: 98 },
            { month: 'Jun', publishers: 152, advertisers: 112 }
        ]
    };

    const recentActivity = [
        { id: 1, type: 'user', action: 'New publisher registered', user: 'John Doe', time: '2 minutes ago', status: 'success' },
        { id: 2, type: 'booking', action: 'New booking created', user: 'TechCorp', time: '15 minutes ago', status: 'success' },
        { id: 3, type: 'appeal', action: 'Appeal submitted', user: 'Sarah Wilson', time: '1 hour ago', status: 'warning' },
        { id: 4, type: 'payment', action: 'Payment processed', user: 'Marketing Inc', time: '2 hours ago', status: 'success' },
        { id: 5, type: 'suspension', action: 'Account suspended', user: 'SpamUser123', time: '3 hours ago', status: 'error' }
    ];

    const getActivityIcon = (type) => {
        switch (type) {
            case 'user': return <Users className="w-4 h-4" />;
            case 'booking': return <TrendingUp className="w-4 h-4" />;
            case 'appeal': return <Activity className="w-4 h-4" />;
            case 'payment': return <TrendingUp className="w-4 h-4" />;
            case 'suspension': return <Users className="w-4 h-4" />;
            default: return <Activity className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'text-green-600 bg-green-100';
            case 'warning': return 'text-yellow-600 bg-yellow-100';
            case 'error': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <AdminLayout title="Admin Dashboard" icon={LayoutDashboard}>
            <div className="p-6 space-y-6">
                {/* Overview Cards */}
                <OverviewCards />

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl border border-violet-100/50 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
                                <p className="text-sm text-gray-500">Monthly revenue overview</p>
                            </div>
                            <div className="flex items-center gap-2 text-green-600">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="text-sm font-medium">+12.5%</span>
                            </div>
                        </div>
                        
                        {/* Simple Bar Chart */}
                        <div className="space-y-4">
                            {chartData.revenue.map((item, index) => (
                                <div key={item.month} className="flex items-center gap-4">
                                    <div className="w-12 text-sm text-gray-600">{item.month}</div>
                                    <div className="flex-1 bg-gray-100 rounded-full h-3 relative overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.value / 70000) * 100}%` }}
                                            transition={{ delay: index * 0.1, duration: 0.8 }}
                                            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
                                        />
                                    </div>
                                    <div className="w-16 text-sm font-medium text-gray-800">${(item.value / 1000).toFixed(0)}k</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* User Growth Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl border border-violet-100/50 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">User Growth</h3>
                                <p className="text-sm text-gray-500">Publishers vs Advertisers</p>
                            </div>
                            <div className="flex items-center gap-2 text-blue-600">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="text-sm font-medium">+8.2%</span>
                            </div>
                        </div>
                        
                        {/* Line Chart Representation */}
                        <div className="space-y-4">
                            {chartData.users.map((item, index) => (
                                <div key={item.month} className="flex items-center gap-4">
                                    <div className="w-12 text-sm text-gray-600">{item.month}</div>
                                    <div className="flex-1 flex gap-2">
                                        <div className="flex-1 bg-blue-100 rounded-full h-2 relative overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.publishers / 200) * 100}%` }}
                                                transition={{ delay: index * 0.1, duration: 0.8 }}
                                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                            />
                                        </div>
                                        <div className="flex-1 bg-purple-100 rounded-full h-2 relative overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.advertisers / 150) * 100}%` }}
                                                transition={{ delay: index * 0.1 + 0.1, duration: 0.8 }}
                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-20 text-xs text-gray-600">
                                        P: {item.publishers} | A: {item.advertisers}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Legend */}
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                                <span className="text-sm text-gray-600">Publishers</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
                                <span className="text-sm text-gray-600">Advertisers</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl border border-violet-100/50 p-6 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                            <p className="text-sm text-gray-500">Latest system activities</p>
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
                                    <p className="text-xs text-gray-500">by {activity.user}</p>
                                </div>
                                <div className="text-xs text-gray-400">{activity.time}</div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <button className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors duration-200">
                            View all activities →
                        </button>
                    </div>
                </motion.div>
            </div>
        </AdminLayout>
    );
}
