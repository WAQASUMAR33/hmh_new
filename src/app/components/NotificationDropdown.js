'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageSquare, X, Check } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds (reduced frequency to avoid spam when DB is down)
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/notifications?unread=true');
            
            if (!response.ok) {
                // If API returns error, clear notifications
                setNotifications([]);
                setUnreadCount(0);
                return;
            }
            
            const data = await response.json();
            setNotifications(data.data || []);
            setUnreadCount(data.data?.length || 0);
        } catch (error) {
            // Silently handle network errors - clear notifications when DB is down
            console.warn('Notifications unavailable:', error.message);
            setNotifications([]);
            setUnreadCount(0);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId })
            });

            if (response.ok) {
                setNotifications(prev => 
                    prev.map(n => 
                        n.id === notificationId ? { ...n, isRead: true } : n
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            } else {
                console.warn('Failed to mark notification as read - API error');
            }
        } catch (error) {
            console.warn('Failed to mark notification as read - network error:', error.message);
        }
    };

    const markAllAsRead = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });

            if (response.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadCount(0);
                toast.success('All notifications marked as read');
            } else {
                console.warn('Failed to mark all notifications as read - API error');
                toast.error('Failed to mark notifications as read');
            }
        } catch (error) {
            console.warn('Failed to mark all notifications as read - network error:', error.message);
            toast.error('Failed to mark notifications as read');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        
        // Navigate to inbox with the specific conversation open
        if (notification.opportunityId) {
            // Get user role from localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            const inboxPath = user?.role === 'PUBLISHER' ? '/publisher/inbox' : '/advertiser/inbox';
            router.push(`${inboxPath}?opportunityId=${notification.opportunityId}&openChat=true`);
        }
        
        setIsOpen(false);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    disabled={loading}
                                    className="text-sm text-violet-600 hover:text-violet-700 font-medium disabled:opacity-50"
                                >
                                    {loading ? 'Marking...' : 'Mark all read'}
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No new notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {notifications.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                !notification.isRead ? 'bg-violet-50' : ''
                                            }`}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <Image
                                                        src={notification.sender?.image || '/avatar.jpg'}
                                                        alt={notification.sender?.firstName || 'User'}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {notification.title}
                                                        </p>
                                                        <span className="text-xs text-gray-500">
                                                            {formatTime(notification.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {notification.content}
                                                    </p>
                                                    {notification.opportunity && (
                                                        <p className="text-xs text-violet-600 mt-1">
                                                            {notification.opportunity.title}
                                                        </p>
                                                    )}
                                                </div>
                                                {!notification.isRead && (
                                                    <div className="flex-shrink-0">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        const user = JSON.parse(localStorage.getItem('user'));
                                        const inboxPath = user?.role === 'PUBLISHER' ? '/publisher/inbox' : '/advertiser/inbox';
                                        router.push(inboxPath);
                                    }}
                                    className="w-full text-center text-sm text-violet-600 hover:text-violet-700 font-medium"
                                >
                                    View all notifications
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default NotificationDropdown;
