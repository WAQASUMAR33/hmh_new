'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    UserCheck,
    FileText,
    Bell,
    Settings,
    Shield,
    ChevronRight,
    BarChart3,
    ActivitySquare,
    AlertTriangle,
    UserPlus,
    Trash2,
    MessageSquare,
    Pin,
    PinOff,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Publishers', icon: Users, path: '/admin/publishers' },
    { name: 'Advertisers', icon: UserCheck, path: '/admin/advertisers' },
    { name: 'Opportunities', icon: FileText, path: '/admin/opportunities' },
    { name: 'Appeals', icon: Bell, path: '/admin/appeals' },
    { name: 'User Management', icon: UserPlus, path: '/admin/users' },
    
    {
        name: 'Reports', icon: BarChart3, subItems: [
            {
                name: 'Platform Analytics', subItems: [
                    { name: 'User Growth', path: '/admin/reports/user-growth' },
                    { name: 'Revenue Analytics', path: '/admin/reports/revenue' },
                    { name: 'Opportunity Performance', path: '/admin/reports/opportunities' },
                    { name: 'Booking Statistics', path: '/admin/reports/bookings' },
                ]
            },
            {
                name: 'User Reports', subItems: [
                    { name: 'Publisher Performance', path: '/admin/reports/publishers' },
                    { name: 'Advertiser Activity', path: '/admin/reports/advertisers' },
                    { name: 'Suspension Reports', path: '/admin/reports/suspensions' },
                    { name: 'Appeal Reports', path: '/admin/reports/appeals' },
                ]
            },
            {
                name: 'Financial Reports', subItems: [
                    { name: 'Transaction Overview', path: '/admin/reports/transactions' },
                    { name: 'Payment Status', path: '/admin/reports/payments' },
                    { name: 'Platform Fees', path: '/admin/reports/fees' },
                    { name: 'Refund Reports', path: '/admin/reports/refunds' },
                ]
            },
        ]
    },

    {
        name: 'System', icon: Settings, subItems: [
            {
                name: 'Configuration', subItems: [
                    { name: 'Platform Settings', path: '/admin/system/settings' },
                    { name: 'Email Templates', path: '/admin/system/email-templates' },
                    { name: 'Notification Settings', path: '/admin/system/notifications' },
                    { name: 'Payment Settings', path: '/admin/system/payments' },
                ]
            },
            {
                name: 'Maintenance', subItems: [
                    { name: 'Database Management', path: '/admin/system/database' },
                    { name: 'Cache Management', path: '/admin/system/cache' },
                    { name: 'Logs & Monitoring', path: '/admin/system/logs' },
                    { name: 'Backup & Restore', path: '/admin/system/backup' },
                ]
            },
        ]
    },

    { name: 'Activity Log', icon: ActivitySquare, path: '/admin/activity' },
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
                    className={`flex items-center px-4 py-3 cursor-pointer transition group ${
                        isActive(item.path) ? 'bg-violet-600 bg-opacity-20 border-l-4 border-violet-500' : 'hover:bg-gray-700'
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
                    className={`flex items-center px-4 py-3 transition group relative ${
                        isActive(item.path) ? 'bg-violet-600 bg-opacity-20 border-l-4 border-violet-500' : 'hover:bg-gray-700'
                    } ${isHovered ? 'justify-between' : 'justify-center'}`}
                    style={{ paddingLeft }}
                >
                    <div className="flex items-center gap-3 w-full">
                        <div className="relative">
                            {item.icon && <item.icon className="text-violet-400 w-5 h-5" />}
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

    useEffect(() => {
        const saved = localStorage.getItem('adminSidebarPinned');
        if (saved === 'true') setPinned(true);
    }, []);

    const sidebarWidth = useMemo(() => (pinned ? 260 : (isHovered ? 260 : 80)), [pinned, isHovered]);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--admin-sidebar-width', `${sidebarWidth}px`);
        }
    }, [sidebarWidth]);

    const handleMouseEnter = () => { if (!pinned) setIsHovered(true); };
    const handleMouseLeave = () => { if (!pinned) setIsHovered(false); };
    const togglePin = () => {
        const next = !pinned;
        setPinned(next);
        localStorage.setItem('adminSidebarPinned', next ? 'true' : 'false');
        if (next) setIsHovered(true);
    };

    return (
        <motion.div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            animate={{ width: sidebarWidth }}
            transition={{ duration: 0.25 }}
            className="h-screen bg-[#1f2937] text-white border-r border-black shadow-lg fixed top-0 left-0 z-50 overflow-y-auto"
        >
            <div className="flex items-center justify-between h-16 border-b border-gray-700 px-4">
                <Image
                    src="/imgs/logo.png"
                    alt="HMH Logo"
                    width={isHovered || pinned ? 120 : 30}
                    height={30}
                    className="transition-all duration-200 object-contain"
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
            <ul className="mt-4 space-y-2">
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
