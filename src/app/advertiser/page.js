'use client';
import Sidebar from '../advertiser/components/sidebar';
import Header from '../advertiser/components/header';
import OverviewCards from '../advertiser/components/overviewCards';

export default function advertiserDashboard() {
    return (
        <div className="min-h-screen bg-white text-black">
            <Sidebar />

            <div className="ml-20 transition-all duration-300">
                <Header />
                <OverviewCards />
            </div>
        </div>
    );
}
