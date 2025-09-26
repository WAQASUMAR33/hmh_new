'use client';
import Sidebar from '../advertiser/components/sidebar';
import Header from '../advertiser/components/header';
import OverviewCards from '../advertiser/components/overviewCards';

export default function advertiserDashboard() {
    return (
        <div className="min-h-screen bg-white text-black">
            <Sidebar />

            <div className="transition-all duration-300" style={{ marginLeft: 'var(--advertiser-sidebar-width, 80px)' }}>
                <Header />
                <OverviewCards />
            </div>
        </div>
    );
}
