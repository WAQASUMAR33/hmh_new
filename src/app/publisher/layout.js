'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function PublisherLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        let role = null;
        try {
            role = userString ? JSON.parse(userString)?.role?.toLowerCase() : null;
        } catch {
            role = null;
        }
        
        if (!token || !userString || role !== 'publisher') {
            router.push('/login');
            return;
        }

        // Check if user is trying to access admin routes
        if (pathname.startsWith('/admin')) {
            router.push('/publisher/dashboard');
            return;
        }

        // Check if account is suspended (mock check - in real app, this would come from API)
        const mockSuspensionData = {
            isSuspended: false, // Set to true to test suspension
            suspensionReason: 'Violation of terms of service'
        };

        if (mockSuspensionData.isSuspended && pathname !== '/publisher/suspended') {
            router.push('/publisher/suspended');
            return;
        }

        // If user is on suspended page but not actually suspended, redirect to dashboard
        if (!mockSuspensionData.isSuspended && pathname === '/publisher/suspended') {
            router.push('/publisher/dashboard');
            return;
        }
    }, [pathname, router]);

    return (
        <div className="publisher-layout">
            {children}
        </div>
    );
}

