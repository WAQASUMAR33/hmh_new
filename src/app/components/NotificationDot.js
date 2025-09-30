'use client';

import { useState, useEffect } from 'react';

const NotificationDot = ({ className = "" }) => {
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        const checkUnreadNotifications = async () => {
            try {
                const response = await fetch('/api/notifications?unread=true');
                
                if (!response.ok) {
                    // If API returns error, don't show notifications
                    setHasUnread(false);
                    return;
                }
                
                const data = await response.json();
                setHasUnread((data.data || []).length > 0);
            } catch (error) {
                // Silently handle network errors - don't show notifications when DB is down
                console.warn('Notifications unavailable:', error.message);
                setHasUnread(false);
            }
        };

        checkUnreadNotifications();
        // Poll every 30 seconds (reduced frequency to avoid spam when DB is down)
        const interval = setInterval(checkUnreadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!hasUnread) return null;

    return (
        <div className={`absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ${className}`} />
    );
};

export default NotificationDot;
