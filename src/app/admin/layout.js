'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === '/admin/login') {
            return;
        }

        // Check if user is authenticated as admin
        const adminToken = localStorage.getItem('adminToken');
        const userRole = localStorage.getItem('userRole');
        
        if (!adminToken || userRole !== 'admin') {
            router.push('/admin/login');
            return;
        }

        // Check if user is trying to access admin routes without proper role
        const regularUserToken = localStorage.getItem('userToken');
        const regularUserRole = localStorage.getItem('userRole');
        
        if (regularUserToken && regularUserRole && regularUserRole !== 'admin') {
            // Clear regular user session and redirect to login
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            router.push('/admin/login');
            return;
        }
    }, [pathname, router]);

    return (
        <div className="admin-layout">
            {children}
        </div>
    );
}

