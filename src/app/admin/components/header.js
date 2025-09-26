'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, User, LogOut, MessageSquare, HelpCircle, CreditCard } from 'lucide-react';
import Image from 'next/image';

export default function Header({ title = "Admin Dashboard", icon: Icon = User }) {
    const [userName, setUserName] = useState('');
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            setUserName(fullName || 'Admin User');
        } else {
            setUserName('Admin User');
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfile(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-30"
        >
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                    <div className="text-[2rem] font-bold text-gray-800">{title}</div>
                    <p className="text-[0.9rem] text-gray-500">Admin Portal</p>
                </div>
            </div>

            <div className="flex items-center gap-6 relative">
                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button onClick={() => setShowProfile(!showProfile)}>
                        <Image
                            src="/avatar.jpg"
                            alt="Avatar"
                            width={35}
                            height={35}
                            className="rounded-full border-2 border-violet-600"
                        />
                    </button>

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-4 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-40"
                            >
                                <div className="p-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
                                    Welcome {userName}!
                                </div>
                                <ul className="text-sm text-gray-600 divide-y divide-gray-100">
                                    <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                                        <User size={16} /> Profile
                                    </li>
                                    <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                                        <Settings size={16} /> Settings
                                    </li>
                                    <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                                        <HelpCircle size={16} /> Help
                                    </li>
                                    <li
                                        onClick={handleLogout}
                                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                    >
                                        <LogOut size={16} className="text-red-500" />
                                        <span className="text-red-500">Logout</span>
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
