'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, User, LogOut, MessageSquare, HelpCircle, CreditCard } from 'lucide-react';
import Image from 'next/image';
import NotificationDropdown from '@/app/components/NotificationDropdown';

export default function Header() {
    const [userName, setUserName] = useState('');
    const [showNotif, setShowNotif] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
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
            className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-30"
        >
            <h1 className="text-xl font-semibold text-gray-800">
                Welcome, <span className="text-violet-600">{userName}</span>
            </h1>

            <div className="flex items-center gap-6 relative">
                {/* Notification */}
                <NotificationDropdown />

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
