'use client';
import Sidebar from '../publisher/components/sidebar';
import Header from '../publisher/components/header';
import OverviewCards from '../publisher/components/overviewCards';

export default function PublisherDashboard() {
    return (
        <div className="min-h-screen bg-white text-black">
            <Sidebar />
            
            {/* Sticky top header */}
            <div className="sticky top-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60" style={{ marginLeft: 'var(--publisher-sidebar-width, 80px)' }}>
                <Header />
            </div>

            {/* Main content shifts with sidebar width via CSS var */}
            <div className="transition-all duration-300" style={{ marginLeft: 'var(--publisher-sidebar-width, 80px)' }}>
                <OverviewCards />
            </div>
        </div>
    );
}
