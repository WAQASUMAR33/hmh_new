'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    BarChart2,
    Gift,
    Grid,
    Wrench,
    User,
    LifeBuoy,
    ChevronRight,
    Box,
    ActivitySquare,
    MessageSquare,
    Calendar,
    Pin,
    PinOff,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import NotificationDot from '@/app/components/NotificationDot';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/publisher' },
    { name: 'Profile', icon: User, path: '/publisher/profile' },

    {
        name: 'Advertisers', icon: Gift, subItems: [
            { name: 'My Programs', path: '/dashboard/publisher/advertisers/my-programs' },
            { name: 'Closed Programs', path: '/dashboard/publisher/advertisers/closed' },
            { name: 'Join Programs', path: '/dashboard/publisher/advertisers/join' },
            { name: 'Partner Recommendations', path: '/dashboard/publisher/advertisers/recommendations' },
            { name: 'Program Commission Rates', path: '/dashboard/publisher/advertisers/commissions' },
        ]
    },

    // NEW: Oppurtunities (as requested, keeping your spelling and path)
    { name: 'Oppurtunities', icon: Box, path: '/publisher/opportunities' },
    { name: 'Bookings', icon: Calendar, path: '/publisher/bookings' },
    { name: 'Inbox', icon: MessageSquare, path: '/publisher/inbox' },

    {
        name: 'Toolbox', icon: Wrench, subItems: [
            {
                name: 'Links & Tools', subItems: [
                    { name: 'Link Builder', path: '/dashboard/publisher/toolbox/link-builder' },
                    { name: 'My Creative', path: '/dashboard/publisher/toolbox/my-creative' },
                    { name: 'Create-a-Feed', path: '/dashboard/publisher/toolbox/create-feed' },
                    { name: 'Publisher MasterTag', path: '/dashboard/publisher/toolbox/mastertag' },
                    { name: 'Service Partner Directory', path: '/dashboard/publisher/toolbox/partner-directory' },
                    { name: 'MyAwin Chrome Extension', path: '/dashboard/publisher/toolbox/chrome-extension' },
                    { name: 'Transaction Notifications', path: '/dashboard/publisher/toolbox/transaction-notifications' },
                ]
            },
            {
                name: 'Promotional', subItems: [
                    { name: 'My Offers', path: '/dashboard/publisher/toolbox/offers' },
                    { name: 'Opportunity Marketplace', path: '/dashboard/publisher/toolbox/marketplace' },
                    { name: 'Advertiser News', path: '/dashboard/publisher/toolbox/news' },
                    { name: 'Email Campaign Approvals', path: '/dashboard/publisher/toolbox/email-approvals' },
                    { name: 'Exposure Planner', path: '/dashboard/publisher/toolbox/exposure-planner' },
                ]
            },
        ]
    },

    {
        name: 'Reports', icon: BarChart2, subItems: [
            {
                name: 'Advertiser Performance', subItems: [
                    { name: 'Today', path: '/dashboard/publisher/reports/advertiser/today' },
                    { name: 'Week', path: '/dashboard/publisher/reports/advertiser/week' },
                    { name: 'Month', path: '/dashboard/publisher/reports/advertiser/month' },
                    { name: 'Year', path: '/dashboard/publisher/reports/advertiser/year' },
                ]
            },
            {
                name: 'Product Performance', subItems: [
                    { name: 'Today', path: '/dashboard/publisher/reports/product/today' },
                    { name: 'Week', path: '/dashboard/publisher/reports/product/week' },
                    { name: 'Month', path: '/dashboard/publisher/reports/product/month' },
                    { name: 'Year', path: '/dashboard/publisher/reports/product/year' },
                ]
            },
            {
                name: 'Performance Over Time', subItems: [
                    { name: 'Today', path: '/dashboard/publisher/reports/time/today' },
                    { name: 'Week', path: '/dashboard/publisher/reports/time/week' },
                    { name: 'Month', path: '/dashboard/publisher/reports/time/month' },
                    { name: 'Year', path: '/dashboard/publisher/reports/time/year' },
                ]
            },
            {
                name: 'Commission Group Performance', subItems: [
                    { name: 'Today', path: '/dashboard/publisher/reports/group/today' },
                    { name: 'Week', path: '/dashboard/publisher/reports/group/week' },
                    { name: 'Month', path: '/dashboard/publisher/reports/group/month' },
                    { name: 'Year', path: '/dashboard/publisher/reports/group/year' },
                ]
            },
            {
                name: 'Creative Performance', subItems: [
                    { name: 'Today', path: '/dashboard/publisher/reports/creative/today' },
                    { name: 'Week', path: '/dashboard/publisher/reports/creative/week' },
                    { name: 'Month', path: '/dashboard/publisher/reports/creative/month' },
                    { name: 'Year', path: '/dashboard/publisher/reports/creative/year' },
                ]
            },
            {
                name: 'Device Performance', subItems: [
                    { name: 'Today', path: '/dashboard/publisher/reports/device/today' },
                    { name: 'Week', path: '/dashboard/publisher/reports/device/week' },
                    { name: 'Month', path: '/dashboard/publisher/reports/device/month' },
                    { name: 'Year', path: '/dashboard/publisher/reports/device/year' },
                ]
            },
            { name: 'Click References', path: '/dashboard/publisher/reports/click-references' },
            {
                name: 'Payment', subItems: [
                    { name: 'Overview', path: '/dashboard/publisher/reports/payment/overview' },
                    { name: 'History', path: '/dashboard/publisher/reports/payment/history' },
                ]
            },
            {
                name: 'Transactions', subItems: [
                    { name: 'Today', path: '/dashboard/publisher/reports/transactions/today' },
                    { name: 'Week', path: '/dashboard/publisher/reports/transactions/week' },
                    { name: 'Month', path: '/dashboard/publisher/reports/transactions/month' },
                    { name: 'Year', path: '/dashboard/publisher/reports/transactions/year' },
                ]
            },
        ]
    },

    {
        name: 'Support', icon: LifeBuoy, subItems: [
            { name: 'Contact Support', path: '/dashboard/publisher/support/contact' },
            { name: 'Videos', path: '/dashboard/publisher/support/videos' },
            { name: 'Help Center', path: '/dashboard/publisher/support/help-center' },
            { name: 'Photo Guides', path: '/dashboard/publisher/support/photos' },
        ]
    },

    { name: 'Activity', icon: ActivitySquare, path: '/dashboard/publisher/activity' },
];

const SidebarItem = ({ item, isHovered, pathname, level = 0 }) => {
    const [open, setOpen] = useState(false);
    const isActive = (path) => pathname === path;
    const hasSubItems = item.subItems && item.subItems.length > 0;

    const paddingLeft = `${level * 12 + 16}px`;

    return (
        <li className="relative">
            {hasSubItems ? (
                <div
                    onClick={() => setOpen(!open)}
                    className={`flex items-center px-4 py-3 cursor-pointer transition group ${isActive(item.path) ? 'bg-violet-600 bg-opacity-20 border-l-4 border-violet-500' : 'hover:bg-gray-700'
                        } ${isHovered ? 'justify-between' : 'justify-center'}`}
                    style={{ paddingLeft }}
                >
                    <div className="flex items-center gap-3 w-full">
                        {item.icon && <item.icon className="text-violet-400 w-5 h-5" />}
                        {isHovered && <span className="text-sm text-gray-200">{item.name}</span>}
                    </div>
                    {isHovered && (
                        <ChevronRight
                            className={`text-gray-400 w-4 h-4 transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
                        />
                    )}
                </div>
            ) : (
                <Link
                    href={item.path}
                    className={`flex items-center px-4 py-3 transition group relative ${isActive(item.path) ? 'bg-violet-600 bg-opacity-20 border-l-4 border-violet-500' : 'hover:bg-gray-700'
                        } ${isHovered ? 'justify-between' : 'justify-center'}`}
                    style={{ paddingLeft }}
                >
                    <div className="flex items-center gap-3 w-full">
                        <div className="relative">
                            {item.icon && <item.icon className="text-violet-400 w-5 h-5" />}
                            {item.name === 'Inbox' && <NotificationDot />}
                        </div>
                        {isHovered && <span className="text-sm text-gray-200">{item.name}</span>}
                    </div>
                </Link>
            )}

            <AnimatePresence>
                {hasSubItems && open && isHovered && (
                    <motion.ul
                        className="space-y-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {item.subItems.map((subItem, index) => (
                            <SidebarItem
                                key={index}
                                item={subItem}
                                isHovered={isHovered}
                                pathname={pathname}
                                level={level + 1}
                            />
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </li>
    );
};

export default function Sidebar() {
    const pathname = usePathname();
    const [isHovered, setIsHovered] = useState(false);
    const [pinned, setPinned] = useState(false);

    // Load persisted pin state
    useEffect(() => {
        const saved = localStorage.getItem('publisherSidebarPinned');
        if (saved === 'true') setPinned(true);
    }, []);

    // Determine live width
    const sidebarWidth = useMemo(() => (pinned ? 260 : (isHovered ? 260 : 80)), [pinned, isHovered]);

    // Sync CSS var for layout push
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--publisher-sidebar-width', `${sidebarWidth}px`);
        }
    }, [sidebarWidth]);

    const handleMouseEnter = () => {
        if (!pinned) setIsHovered(true);
    };
    const handleMouseLeave = () => {
        if (!pinned) setIsHovered(false);
    };

    const togglePin = () => {
        const next = !pinned;
        setPinned(next);
        localStorage.setItem('publisherSidebarPinned', next ? 'true' : 'false');
        if (next) setIsHovered(true);
    };

    return (
        <motion.div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            animate={{ width: sidebarWidth }}
            transition={{ duration: 0.25 }}
            className="h-screen bg-[#1f2937] bg-gradient-to-b from-[#1f2937] to-[#111827] text-white border-r border-black/50 shadow-xl fixed top-0 left-0 z-50 overflow-y-auto backdrop-blur-sm"
        >
            <div className="flex items-center justify-between h-16 border-b border-gray-700/60 px-4">
                <Image
                    src="/imgs/logo.png"
                    alt="Logo"
                    width={isHovered || pinned ? 120 : 30}
                    height={30}
                    className="transition-all duration-200 object-contain drop-shadow"
                />
                {(isHovered || pinned) && (
                    <button
                        aria-label={pinned ? 'Unpin sidebar' : 'Pin sidebar'}
                        onClick={togglePin}
                        className="p-2 rounded-md hover:bg-gray-700/50 transition-colors"
                        title={pinned ? 'Unpin' : 'Pin'}
                    >
                        {pinned ? <Pin className="w-4 h-4 text-violet-300" /> : <PinOff className="w-4 h-4 text-gray-300" />}
                    </button>
                )}
            </div>
            <ul className="mt-4 space-y-1.5">
                {menuItems.map((item, index) => (
                    <SidebarItem
                        key={index}
                        item={item}
                        isHovered={isHovered || pinned}
                        pathname={pathname}
                    />
                ))}
            </ul>
        </motion.div>
    );
}
