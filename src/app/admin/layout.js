'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;
        
        // Skip auth check for login page
        if (pathname === '/admin/login') {
            return;
        }

        // Check if user is authenticated as admin
        const adminToken = localStorage.getItem('adminToken');
        const userRole = localStorage.getItem('userRole');
        
        // Allow all admin roles
        const allowedRoles = ['admin', 'super_admin', 'manager'];
        
        if (!adminToken || !allowedRoles.includes(userRole)) {
            console.log('Admin layout auth failed:', { adminToken, userRole, allowedRoles });
            router.push('/admin/login');
            return;
        }

        console.log('Admin layout auth successful:', { adminToken, userRole });
    }, [pathname, router]);

    return (
        <div className="admin-layout">
            {children}
        </div>
    );
}

