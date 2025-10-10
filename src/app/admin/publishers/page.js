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
    Users
} from 'lucide-react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';

export default function PublisherManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRegion, setFilterRegion] = useState('all');
    const [publishers, setPublishers] = useState([]);
    const [selectedPublisher, setSelectedPublisher] = useState(null);
    const [showSuspensionModal, setShowSuspensionModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [suspensionReason, setSuspensionReason] = useState('');
    const router = useRouter();

    // Mock data for publishers
    const mockPublishers = [
        {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+1-555-0123',
            region: 'North America',
            website: 'techblog.com',
            status: 'active',
            joinDate: '2024-01-15',
            totalOpportunities: 45,
            completedOpportunities: 38,
            rating: 4.8,
            lastActive: '2024-01-20'
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            phone: '+1-555-0124',
            region: 'Europe',
            website: 'https://lifestyleblog.eu',
            status: 'suspended',
            joinDate: '2023-11-22',
            totalOpportunities: 23,
            completedOpportunities: 20,
            rating: 4.2,
            lastActive: '2024-01-18',
            suspensionReason: 'Violation of terms of service'
        },
        {
            id: 3,
            name: 'Michael Chen',
            email: 'm.chen@email.com',
            phone: '+1-555-0125',
            region: 'Asia',
            website: 'gamingreviews.asia',
            status: 'active',
            joinDate: '2023-12-05',
            totalOpportunities: 67,
            completedOpportunities: 62,
            rating: 4.9,
            lastActive: '2024-01-21'
        },
        {
            id: 4,
            name: 'Emily Davis',
            email: 'emily.davis@email.com',
            phone: '+1-555-0126',
            region: 'North America',
            website: null, // No website provided
            status: 'active',
            joinDate: '2024-01-08',
            totalOpportunities: 12,
            completedOpportunities: 10,
            rating: 4.5,
            lastActive: '2024-01-20'
        },
        {
            id: 5,
            name: 'Ahmed Hassan',
            email: 'ahmed.h@email.com',
            phone: '+1-555-0127',
            region: 'Middle East',
            website: 'https://businessinsights.me',
            status: 'suspended',
            joinDate: '2023-10-15',
            totalOpportunities: 34,
            completedOpportunities: 28,
            rating: 3.8,
            lastActive: '2024-01-15',
            suspensionReason: 'Inappropriate content'
        }
    ];

    useEffect(() => {
        fetchPublishers();
    }, []);

    const fetchPublishers = async () => {
        try {
            const response = await fetch('/api/publishers');
            const result = await response.json();
            
            if (result.success) {
                // Transform the data to match the expected format
                const transformedPublishers = result.publishers.map(user => ({
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    phone: user.phoneNumber || 'N/A',
                    region: user.websiteRegion || 'N/A',
                    website: user.website || null,
                    status: user.isSuspended ? 'suspended' : 'active',
                    joinDate: new Date(user.createdAt).toISOString().split('T')[0],
                    totalOpportunities: 0, // Would need to fetch from opportunities API
                    completedOpportunities: 0, // Would need to fetch from bookings API
                    rating: 4.5, // Default rating - would need to implement rating system
                    lastActive: new Date(user.createdAt).toISOString().split('T')[0],
                    suspensionReason: user.isSuspended ? (user.suspensionReason || '') : ''
                }));
                setPublishers(transformedPublishers);
            } else {
                // Fallback to mock data
                setPublishers(mockPublishers);
            }
        } catch (error) {
            console.error('Error fetching publishers:', error);
            // Fallback to mock data
            setPublishers(mockPublishers);
        }
    };

    const filteredPublishers = publishers.filter(publisher => {
        const matchesSearch = publisher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            publisher.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || publisher.status === filterStatus;
        const matchesRegion = filterRegion === 'all' || publisher.region === filterRegion;
        
        return matchesSearch && matchesStatus && matchesRegion;
    });

    const handleViewProfile = (publisher) => {
        setSelectedPublisher(publisher);
        setShowProfileModal(true);
    };

    const handleSuspendAccount = (publisher) => {
        setSelectedPublisher(publisher);
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
                    userId: selectedPublisher.id,
                    suspensionReason: suspensionReason,
                    suspendedBy: 'admin' // In real app, this would be the actual admin user ID
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Update publisher status
                setPublishers(prev => prev.map(p => 
                    p.id === selectedPublisher.id 
                        ? { ...p, status: 'suspended', suspensionReason }
                        : p
                ));

                toast.success(`Account suspended: ${selectedPublisher.name}. Email notification sent.`);
                setShowSuspensionModal(false);
                setSuspensionReason('');
                setSelectedPublisher(null);
            } else {
                toast.error(data.error || 'Failed to suspend account');
            }
        } catch (error) {
            console.error('Error suspending account:', error);
            toast.error('Error suspending account');
        }
    };

    const handleUnsuspendAccount = async (publisher) => {
        try {
            const response = await fetch('/api/admin/suspend-user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: publisher.id,
                    unsuspendedBy: 'admin' // In real app, this would be the actual admin user ID
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setPublishers(prev => prev.map(p => 
                    p.id === publisher.id 
                        ? { ...p, status: 'active', suspensionReason: '' }
                        : p
                ));

                toast.success(`Account unsuspended: ${publisher.name}`);
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

    return (
        <AdminLayout title="Publisher Management" icon={Users}>
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
                                    placeholder="Search publishers by name or email..."
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

                {/* Publishers Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Publishers ({filteredPublishers.length})
                        </h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publisher</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPublishers.map((publisher) => (
                                    <motion.tr
                                        key={publisher.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {publisher.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{publisher.name}</div>
                                                    <div className="text-sm text-gray-500">ID: {publisher.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{publisher.email}</div>
                                            <div className="text-sm text-gray-500">{publisher.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                                {publisher.region}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(publisher.status)}
                                            {publisher.status === 'suspended' && publisher.suspensionReason && (
                                                <div className="text-xs text-red-600 mt-1">{publisher.suspensionReason}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <div>{publisher.completedOpportunities}/{publisher.totalOpportunities} completed</div>
                                                <div className="text-xs text-gray-500">Rating: {publisher.rating}/5</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleViewProfile(publisher)}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="View Profile"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {publisher.status === 'active' ? (
                                                    <button
                                                        onClick={() => handleSuspendAccount(publisher)}
                                                        className="text-red-600 hover:text-red-900 p-1"
                                                        title="Suspend Account"
                                                    >
                                                        <UserX className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUnsuspendAccount(publisher)}
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
                                Publisher Profile: {selectedPublisher?.name}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowProfileModal(false);
                                    setSelectedPublisher(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="text-sm text-gray-900">{selectedPublisher?.name}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="text-sm text-gray-900">{selectedPublisher?.email}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <div className="text-sm text-gray-900">{selectedPublisher?.phone}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                                    <div className="text-sm text-gray-900">{selectedPublisher?.region}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                    <div className="text-sm">
                                        {selectedPublisher?.website ? (
                                            <a 
                                                href={selectedPublisher.website.startsWith('http') ? selectedPublisher.website : `https://${selectedPublisher.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                {selectedPublisher.website}
                                            </a>
                                        ) : (
                                            <span className="text-gray-500">No website provided</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                                    <div className="flex items-center">
                                        {getStatusBadge(selectedPublisher?.status)}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                                    <div className="text-sm text-gray-900">{selectedPublisher?.joinDate}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Active</label>
                                    <div className="text-sm text-gray-900">{selectedPublisher?.lastActive}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                                    <div className="text-sm text-gray-900">{selectedPublisher?.id}</div>
                                </div>
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-blue-600">{selectedPublisher?.totalOpportunities}</div>
                                    <div className="text-sm text-gray-600">Total Opportunities</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-green-600">{selectedPublisher?.completedOpportunities}</div>
                                    <div className="text-sm text-gray-600">Completed</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-yellow-600">{selectedPublisher?.rating}/5</div>
                                    <div className="text-sm text-gray-600">Rating</div>
                                </div>
                            </div>
                        </div>

                        {/* Suspension Information */}
                        {selectedPublisher?.status === 'suspended' && selectedPublisher?.suspensionReason && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-lg font-medium text-red-600 mb-2">Suspension Details</h4>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="text-sm text-red-800">
                                        <strong>Reason:</strong> {selectedPublisher.suspensionReason}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => {
                                    setShowProfileModal(false);
                                    setSelectedPublisher(null);
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
                            Suspend Account: {selectedPublisher?.name}
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
                                    setSelectedPublisher(null);
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
