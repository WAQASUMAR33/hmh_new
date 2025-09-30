'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, User, LogOut, MessageSquare, HelpCircle, CreditCard, Search } from 'lucide-react';
import Image from 'next/image';
import NotificationDropdown from '@/app/components/NotificationDropdown';

export default function Header({ title = "Publisher Dashboard", icon: Icon = User }) {
    const [userName, setUserName] = useState('');
    const [showNotif, setShowNotif] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            setUserName(fullName || 'User');
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotif(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfile(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex justify-between items-center px-6 py-4 bg-gradient-to-r from-white via-blue-50/30 to-white sticky top-0 z-30 border-b border-blue-100/50 backdrop-blur-sm"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5"></div>
            
            <div className="relative flex items-center gap-4">
                <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div>
                    <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {title}
                    </div>
                    <p className="text-sm text-blue-600/70 font-medium">Publisher Portal</p>
                </div>
            </div>

            <div className="relative flex items-center gap-4">
                {/* Search Bar */}
                <div className="hidden md:block relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 w-64 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-sm"
                        />
                    </div>
                </div>

                {/* Notification */}
                <NotificationDropdown />

                {/* Welcome message */}
                <div className="hidden lg:block text-right">
                    <p className="text-sm font-medium text-gray-700">Welcome back,</p>
                    <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {userName}
                    </p>
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button 
                        onClick={() => setShowProfile(!showProfile)}
                        className="relative group"
                    >
                        <div className="relative">
                            <Image
                                src="/avatar.jpg"
                                alt="Avatar"
                                width={40}
                                height={40}
                                className="rounded-full border-3 border-blue-200 shadow-lg group-hover:border-blue-400 transition-all duration-200"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                    </button>

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100/50 z-40 overflow-hidden"
                            >
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50">
                                    <p className="text-sm font-semibold text-gray-800">Welcome back!</p>
                                    <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        {userName}
                                    </p>
                                </div>
                                <ul className="py-2">
                                    <li className="px-4 py-3 hover:bg-blue-50/50 cursor-pointer flex items-center gap-3 transition-colors duration-200">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                            <User size={16} className="text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Profile</span>
                                    </li>
                                    <li className="px-4 py-3 hover:bg-blue-50/50 cursor-pointer flex items-center gap-3 transition-colors duration-200">
                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center">
                                            <HelpCircle size={16} className="text-emerald-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Help</span>
                                    </li>
                                    <li
                                        onClick={handleLogout}
                                        className="px-4 py-3 hover:bg-red-50/50 cursor-pointer flex items-center gap-3 transition-colors duration-200"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg flex items-center justify-center">
                                            <LogOut size={16} className="text-red-500" />
                                        </div>
                                        <span className="text-sm font-medium text-red-500">Logout</span>
                                    </li>
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
