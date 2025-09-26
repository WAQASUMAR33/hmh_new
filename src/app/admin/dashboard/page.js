'use client';
import AdminLayout from '../components/AdminLayout';
import OverviewCards from '../components/overviewCards';
import { LayoutDashboard } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <AdminLayout title="Admin Dashboard" icon={LayoutDashboard}>
            <OverviewCards />
        </AdminLayout>
    );
}
