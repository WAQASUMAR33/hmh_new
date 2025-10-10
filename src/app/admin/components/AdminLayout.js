"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './sidebar';
import Header from './header';

export default function AdminLayout({ children, title, icon: Icon }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;
        
        const checkAuth = () => {
            const adminToken = localStorage.getItem('adminToken');
            const role = localStorage.getItem('userRole');
            
            console.log('AdminLayout Auth Check:', {
                adminToken,
                role,
                pathname,
                windowLocation: window.location.pathname
            });
            
            // Check if user is authenticated
            if (!adminToken) {
                console.log('No admin token found, redirecting to login');
                router.push('/admin/login');
                setIsLoading(false);
                return;
            }
            
            // Allow any authenticated admin-area role
            const allowedRoles = ['admin', 'super_admin', 'manager'];
            if (!role || !allowedRoles.includes(role)) {
                console.log('Invalid role:', { role, allowedRoles });
                router.push('/admin/login');
                setIsLoading(false);
                return;
            }
            
            console.log('Authentication successful for role:', role);
            setIsAuthenticated(true);
            setIsLoading(false);
        };

        // Small delay to ensure localStorage is available
        const timer = setTimeout(checkAuth, 100);
        
        return () => clearTimeout(timer);
    }, [router, pathname]);

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black">
            <Sidebar />
            
            {/* Sticky top header */}
            <div className="sticky top-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60" style={{ marginLeft: 'var(--admin-sidebar-width, 80px)' }}>
                <Header title={title} icon={Icon} />
            </div>
            
            <div className="transition-all duration-300" style={{ marginLeft: 'var(--admin-sidebar-width, 80px)' }}>
                {children}
            </div>
        </div>
    );
}

