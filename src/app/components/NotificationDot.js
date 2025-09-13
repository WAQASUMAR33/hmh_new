'use client';

import { useState, useEffect } from 'react';

const NotificationDot = ({ className = "" }) => {
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        const checkUnreadNotifications = async () => {
            try {
                const response = await fetch('/api/notifications?unread=true');
                const data = await response.json();
                
                if (response.ok) {
                    setHasUnread((data.data || []).length > 0);
                }
            } catch (error) {
                console.error('Error checking notifications:', error);
            }
        };

        checkUnreadNotifications();
        // Poll every 30 seconds
        const interval = setInterval(checkUnreadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!hasUnread) return null;

    return (
        <div className={`absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ${className}`} />
    );
};

export default NotificationDot;
