'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
    Search, 
    Filter, 
    MoreVertical, 
    UserX, 
    UserCheck, 
    Eye,
    Shield,
    ArrowLeft,
    LogOut,
    Calendar,
    MapPin,
    Mail,
    Phone,
    Building,
    DollarSign
} from 'lucide-react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';

export default function AdvertiserManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRegion, setFilterRegion] = useState('all');
    const [advertisers, setAdvertisers] = useState([]);
    const [selectedAdvertiser, setSelectedAdvertiser] = useState(null);
    const [showSuspensionModal, setShowSuspensionModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [suspensionReason, setSuspensionReason] = useState('');
    const router = useRouter();

    // Mock data for advertisers
    const mockAdvertisers = [
        {
            id: 1,
            name: 'TechCorp Solutions',
            contactPerson: 'David Wilson',
            email: 'david.wilson@techcorp.com',
            phone: '+1-555-0201',
            region: 'North America',
            status: 'active',
            joinDate: '2024-01-10',
            totalCampaigns: 12,
            activeCampaigns: 8,
            totalSpent: 45000,
            lastActive: '2024-01-21',
            companySize: 'Large (500+ employees)'
        },
        {
            id: 2,
            name: 'Fashion Forward Ltd',
            contactPerson: 'Lisa Martinez',
            email: 'lisa.m@fashionforward.com',
            phone: '+1-555-0202',
            region: 'Europe',
            status: 'suspended',
            joinDate: '2023-12-15',
            totalCampaigns: 5,
            activeCampaigns: 0,
            totalSpent: 12000,
            lastActive: '2024-01-15',
            companySize: 'Medium (50-200 employees)',
            suspensionReason: 'Payment issues'
        },
        {
            id: 3,
            name: 'Green Energy Co',
            contactPerson: 'Robert Kim',
            email: 'robert.kim@greenenergy.com',
            phone: '+1-555-0203',
            region: 'Asia',
            status: 'active',
            joinDate: '2023-11-20',
            totalCampaigns: 18,
            activeCampaigns: 12,
            totalSpent: 78000,
            lastActive: '2024-01-20',
            companySize: 'Large (500+ employees)'
        },
        {
            id: 4,
            name: 'Local Bakery Chain',
            contactPerson: 'Maria Rodriguez',
            email: 'maria.r@localbakery.com',
            phone: '+1-555-0204',
            region: 'North America',
            status: 'active',
            joinDate: '2024-01-05',
            totalCampaigns: 3,
            activeCampaigns: 2,
            totalSpent: 3500,
            lastActive: '2024-01-19',
            companySize: 'Small (10-50 employees)'
        },
        {
            id: 5,
            name: 'Digital Marketing Pro',
            contactPerson: 'Ahmed Al-Rashid',
            email: 'ahmed@digitalmarketingpro.com',
            phone: '+1-555-0205',
            region: 'Middle East',
            status: 'suspended',
            joinDate: '2023-10-30',
            totalCampaigns: 7,
            activeCampaigns: 0,
            totalSpent: 15000,
            lastActive: '2024-01-10',
            companySize: 'Medium (50-200 employees)',
            suspensionReason: 'Violation of advertising policies'
        }
    ];

    useEffect(() => {
        fetchAdvertisers();
    }, []);

    const fetchAdvertisers = async () => {
        try {
            const response = await fetch('/api/admin/users?role=ADVERTISER');
            const result = await response.json();
            
            if (result.success) {
                // Transform the data to match the expected format
                const transformedAdvertisers = result.data.map(user => ({
                    id: user.id,
                    name: user.brandName || `${user.firstName} ${user.lastName}`,
                    contactPerson: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    phone: user.phoneNumber || 'N/A',
                    region: user.country || 'N/A',
                    status: user.isSuspended ? 'suspended' : (user.isActivated ? 'active' : 'inactive'),
                    joinDate: new Date(user.createdAt).toISOString().split('T')[0],
                    totalCampaigns: user._count?.advertiserBookings || 0,
                    activeCampaigns: user.isSuspended ? 0 : (user._count?.advertiserBookings || 0),
                    totalSpent: 0, // Would need to calculate from bookings
                    lastActive: new Date(user.updatedAt).toISOString().split('T')[0],
                    companySize: 'N/A', // Not available in current schema
                    suspensionReason: user.isSuspended ? (user.suspensionReason || '') : ''
                }));
                setAdvertisers(transformedAdvertisers);
            } else {
                // Fallback to mock data
                setAdvertisers(mockAdvertisers);
            }
        } catch (error) {
            console.error('Error fetching advertisers:', error);
            // Fallback to mock data
            setAdvertisers(mockAdvertisers);
        }
    };

    const filteredAdvertisers = advertisers.filter(advertiser => {
        const matchesSearch = advertiser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            advertiser.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            advertiser.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || advertiser.status === filterStatus;
        const matchesRegion = filterRegion === 'all' || advertiser.region === filterRegion;
        
        return matchesSearch && matchesStatus && matchesRegion;
    });

    const handleViewProfile = (advertiser) => {
        setSelectedAdvertiser(advertiser);
        setShowProfileModal(true);
    };

    const handleSuspendAccount = (advertiser) => {
        setSelectedAdvertiser(advertiser);
        setShowSuspensionModal(true);
    };

    const confirmSuspension = async () => {
        if (!suspensionReason.trim()) {
            toast.error('Please provide a reason for suspension');
            return;
        }

        try {
            const response = await fetch('/api/admin/suspend-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: selectedAdvertiser.id,
                    suspensionReason: suspensionReason,
                    suspendedBy: 'admin' // In real app, this would be the actual admin user ID
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Update advertiser status
                setAdvertisers(prev => prev.map(a => 
                    a.id === selectedAdvertiser.id 
                        ? { ...a, status: 'suspended', suspensionReason, activeCampaigns: 0 }
                        : a
                ));

                toast.success(`Account suspended: ${selectedAdvertiser.name}. Email notification sent.`);
                setShowSuspensionModal(false);
                setSuspensionReason('');
                setSelectedAdvertiser(null);
            } else {
                toast.error(data.error || 'Failed to suspend account');
            }
        } catch (error) {
            console.error('Error suspending account:', error);
            toast.error('Error suspending account');
        }
    };

    const handleUnsuspendAccount = async (advertiser) => {
        try {
            const response = await fetch('/api/admin/suspend-user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: advertiser.id,
                    unsuspendedBy: 'admin' // In real app, this would be the actual admin user ID
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setAdvertisers(prev => prev.map(a => 
                    a.id === advertiser.id 
                        ? { ...a, status: 'active', suspensionReason: '' }
                        : a
                ));

                toast.success(`Account unsuspended: ${advertiser.name}`);
            } else {
                toast.error(data.error || 'Failed to unsuspend account');
            }
        } catch (error) {
            console.error('Error unsuspending account:', error);
            toast.error('Error unsuspending account');
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'active') {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
        } else {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Suspended</span>;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AdminLayout title="Advertiser Management" icon={UserCheck}>
            <ToastContainer />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search advertisers by name, contact person, or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                            </select>
                            
                            <select
                                value={filterRegion}
                                onChange={(e) => setFilterRegion(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Regions</option>
                                <option value="North America">North America</option>
                                <option value="Europe">Europe</option>
                                <option value="Asia">Asia</option>
                                <option value="Middle East">Middle East</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Advertisers Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Advertisers ({filteredAdvertisers.length})
                        </h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaigns</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAdvertisers.map((advertiser) => (
                                    <motion.tr
                                        key={advertiser.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {advertiser.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{advertiser.name}</div>
                                                    <div className="text-sm text-gray-500">{advertiser.companySize}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{advertiser.contactPerson}</div>
                                            <div className="text-sm text-gray-500">{advertiser.email}</div>
                                            <div className="text-sm text-gray-500">{advertiser.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                                {advertiser.region}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(advertiser.status)}
                                            {advertiser.status === 'suspended' && advertiser.suspensionReason && (
                                                <div className="text-xs text-red-600 mt-1">{advertiser.suspensionReason}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <div>{advertiser.activeCampaigns}/{advertiser.totalCampaigns} active</div>
                                                <div className="text-xs text-gray-500">Total: {advertiser.totalCampaigns}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatCurrency(advertiser.totalSpent)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleViewProfile(advertiser)}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="View Profile"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {advertiser.status === 'active' ? (
                                                    <button
                                                        onClick={() => handleSuspendAccount(advertiser)}
                                                        className="text-red-600 hover:text-red-900 p-1"
                                                        title="Suspend Account"
                                                    >
                                                        <UserX className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUnsuspendAccount(advertiser)}
                                                        className="text-green-600 hover:text-green-900 p-1"
                                                        title="Unsuspend Account"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Profile View Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Advertiser Profile: {selectedAdvertiser?.name}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowProfileModal(false);
                                    setSelectedAdvertiser(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Company Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                    <div className="text-sm text-gray-900">{selectedAdvertiser?.name}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                                    <div className="text-sm text-gray-900">{selectedAdvertiser?.contactPerson}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="text-sm text-gray-900">{selectedAdvertiser?.email}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <div className="text-sm text-gray-900">{selectedAdvertiser?.phone}</div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                                    <div className="flex items-center">
                                        {getStatusBadge(selectedAdvertiser?.status)}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                                    <div className="text-sm text-gray-900">{selectedAdvertiser?.region}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                                    <div className="text-sm text-gray-900">{selectedAdvertiser?.joinDate}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Active</label>
                                    <div className="text-sm text-gray-900">{selectedAdvertiser?.lastActive}</div>
                                </div>
                            </div>
                        </div>

                        {/* Campaign Metrics */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Campaign Metrics</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-blue-600">{selectedAdvertiser?.totalCampaigns}</div>
                                    <div className="text-sm text-gray-600">Total Campaigns</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-green-600">{selectedAdvertiser?.activeCampaigns}</div>
                                    <div className="text-sm text-gray-600">Active Campaigns</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-yellow-600">{formatCurrency(selectedAdvertiser?.totalSpent)}</div>
                                    <div className="text-sm text-gray-600">Total Spent</div>
                                </div>
                            </div>
                        </div>

                        {/* Company Details */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Company Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                                    <div className="text-sm text-gray-900">{selectedAdvertiser?.companySize}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                                    <div className="text-sm text-gray-900">{selectedAdvertiser?.id}</div>
                                </div>
                            </div>
                        </div>

                        {/* Suspension Information */}
                        {selectedAdvertiser?.status === 'suspended' && selectedAdvertiser?.suspensionReason && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-lg font-medium text-red-600 mb-2">Suspension Details</h4>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="text-sm text-red-800">
                                        <strong>Reason:</strong> {selectedAdvertiser.suspensionReason}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => {
                                    setShowProfileModal(false);
                                    setSelectedAdvertiser(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Suspension Modal */}
            {showSuspensionModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Suspend Account: {selectedAdvertiser?.name}
                        </h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Suspension
                            </label>
                            <textarea
                                value={suspensionReason}
                                onChange={(e) => setSuspensionReason(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Enter the reason for suspending this account..."
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowSuspensionModal(false);
                                    setSuspensionReason('');
                                    setSelectedAdvertiser(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSuspension}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                                Suspend Account
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AdminLayout>
    );
}
