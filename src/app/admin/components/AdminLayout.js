"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './sidebar';
import Header from './header';

export default function AdminLayout({ children, title, icon: Icon }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        const role = localStorage.getItem('userRole');
        if (!adminToken || role !== 'admin') {
            router.push('/admin/login');
            return;
        }
        setIsAuthenticated(true);
    }, [router]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying admin access...</p>
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

