'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
    Search, 
    Filter, 
    CheckCircle, 
    XCircle,
    Eye,
    Shield,
    ArrowLeft,
    LogOut,
    Calendar,
    User,
    MessageSquare,
    Clock,
    AlertTriangle,
    Bell
} from 'lucide-react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';

export default function AppealsManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [appeals, setAppeals] = useState([]);
    const [selectedAppeal, setSelectedAppeal] = useState(null);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const router = useRouter();

    // Mock data for appeals
    const mockAppeals = [
        {
            id: 1,
            userId: 2,
            userName: 'Sarah Johnson',
            userEmail: 'sarah.j@email.com',
            userType: 'publisher',
            appealDate: '2024-01-20',
            status: 'pending',
            originalSuspensionReason: 'Violation of terms of service',
            appealMessage: 'I believe my account was suspended unfairly. I was not aware that the content I posted violated the terms. I have reviewed the guidelines and will ensure all future content complies with the platform rules. Please reconsider my suspension.',
            adminResponse: '',
            responseDate: null
        },
        {
            id: 2,
            userId: 5,
            userName: 'Ahmed Hassan',
            userEmail: 'ahmed.h@email.com',
            userType: 'publisher',
            appealDate: '2024-01-19',
            status: 'approved',
            originalSuspensionReason: 'Inappropriate content',
            appealMessage: 'I apologize for the content that led to my suspension. I have removed all inappropriate content and have implemented stricter content review processes. I understand the importance of maintaining a professional environment.',
            adminResponse: 'Appeal approved. Account has been unsuspended. Please ensure all content follows our guidelines.',
            responseDate: '2024-01-20'
        },
        {
            id: 3,
            userId: 2,
            userName: 'Fashion Forward Ltd',
            userEmail: 'lisa.m@fashionforward.com',
            userType: 'advertiser',
            appealDate: '2024-01-18',
            status: 'rejected',
            originalSuspensionReason: 'Payment issues',
            appealMessage: 'We have resolved our payment issues and have updated our payment method. We are committed to maintaining good standing with the platform and ensuring all payments are made on time.',
            adminResponse: 'Appeal rejected. Multiple payment failures and insufficient documentation provided. Please contact support for further assistance.',
            responseDate: '2024-01-19'
        },
        {
            id: 4,
            userId: 6,
            userName: 'Digital Marketing Pro',
            userEmail: 'ahmed@digitalmarketingpro.com',
            userType: 'advertiser',
            appealDate: '2024-01-21',
            status: 'pending',
            originalSuspensionReason: 'Violation of advertising policies',
            appealMessage: 'I believe there was a misunderstanding regarding our advertising content. We have reviewed our campaigns and made necessary adjustments to ensure compliance. We value our partnership with the platform.',
            adminResponse: '',
            responseDate: null
        }
    ];

    useEffect(() => {
        fetchAppeals();
    }, []);

    const fetchAppeals = async () => {
        try {
            const response = await fetch('/api/appeals');
            const data = await response.json();
            
            if (data.success) {
                setAppeals(data.appeals);
            } else {
                console.error('Failed to fetch appeals:', data.error);
                // Fallback to mock data
                setAppeals(mockAppeals);
            }
        } catch (error) {
            console.error('Error fetching appeals:', error);
            // Fallback to mock data
            setAppeals(mockAppeals);
        }
    };

    const filteredAppeals = appeals.filter(appeal => {
        const matchesSearch = appeal.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            appeal.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            appeal.appealMessage.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || appeal.status === filterStatus;
        const matchesType = filterType === 'all' || appeal.userType === filterType;
        
        return matchesSearch && matchesStatus && matchesType;
    });

    const handleViewAppeal = (appeal) => {
        setSelectedAppeal(appeal);
        setShowViewModal(true);
    };

    const handleRespondToAppeal = (appeal) => {
        setSelectedAppeal(appeal);
        setShowResponseModal(true);
    };

    const handleApproveAppeal = async () => {
        if (!responseMessage.trim()) {
            toast.error('Please provide a response message');
            return;
        }

        try {
            const response = await fetch(`/api/appeals/${selectedAppeal.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'APPROVED',
                    adminResponse: responseMessage,
                    respondedBy: 'admin' // In real app, this would be the actual admin user ID
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setAppeals(prev => prev.map(a => 
                    a.id === selectedAppeal.id 
                        ? { 
                            ...a, 
                            status: 'approved', 
                            adminResponse: responseMessage,
                            responseDate: new Date().toISOString().split('T')[0]
                          }
                        : a
                ));

                toast.success(`Appeal approved for ${selectedAppeal.userName}. Email notification sent.`);
                setShowResponseModal(false);
                setResponseMessage('');
                setSelectedAppeal(null);
            } else {
                toast.error(data.error || 'Failed to approve appeal');
            }
        } catch (error) {
            console.error('Error approving appeal:', error);
            toast.error('Error approving appeal');
        }
    };

    const handleRejectAppeal = async () => {
        if (!responseMessage.trim()) {
            toast.error('Please provide a response message');
            return;
        }

        try {
            const response = await fetch(`/api/appeals/${selectedAppeal.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'REJECTED',
                    adminResponse: responseMessage,
                    respondedBy: 'admin' // In real app, this would be the actual admin user ID
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setAppeals(prev => prev.map(a => 
                    a.id === selectedAppeal.id 
                        ? { 
                            ...a, 
                            status: 'rejected', 
                            adminResponse: responseMessage,
                            responseDate: new Date().toISOString().split('T')[0]
                          }
                        : a
                ));

                toast.success(`Appeal rejected for ${selectedAppeal.userName}. Email notification sent.`);
                setShowResponseModal(false);
                setResponseMessage('');
                setSelectedAppeal(null);
            } else {
                toast.error(data.error || 'Failed to reject appeal');
            }
        } catch (error) {
            console.error('Error rejecting appeal:', error);
            toast.error('Error rejecting appeal');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
            case 'approved':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
            case 'rejected':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    const getUserTypeBadge = (type) => {
        if (type === 'publisher') {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Publisher</span>;
        } else {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Advertiser</span>;
        }
    };

    return (
        <AdminLayout title="Appeals Management" icon={Bell}>
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
                                    placeholder="Search appeals by user name, email, or message..."
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
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Types</option>
                                <option value="publisher">Publisher</option>
                                <option value="advertiser">Advertiser</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Appeals Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Appeals ({filteredAppeals.length})
                        </h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suspension Reason</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appeal Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAppeals.map((appeal) => (
                                    <motion.tr
                                        key={appeal.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {appeal.userName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{appeal.userName}</div>
                                                    <div className="text-sm text-gray-500">{appeal.userEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getUserTypeBadge(appeal.userType)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {appeal.originalSuspensionReason}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(appeal.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(appeal.appealDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleViewAppeal(appeal)}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {appeal.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleRespondToAppeal(appeal)}
                                                        className="text-green-600 hover:text-green-900 p-1"
                                                        title="Respond to Appeal"
                                                    >
                                                        <MessageSquare className="w-4 h-4" />
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

            {/* Response Modal */}
            {showResponseModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                <MessageSquare className="w-5 h-5 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Respond to Appeal
                            </h3>
                        </div>
                        
                        <div className="mb-6">
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Appeal Details</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div><strong>User:</strong> {selectedAppeal?.userName} ({selectedAppeal?.userType})</div>
                                    <div><strong>Suspension Reason:</strong> {selectedAppeal?.originalSuspensionReason}</div>
                                    <div><strong>Appeal Date:</strong> {selectedAppeal?.appealDate}</div>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Appeal Message</h4>
                                <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700">
                                    {selectedAppeal?.appealMessage}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Response
                            </label>
                            <textarea
                                value={responseMessage}
                                onChange={(e) => setResponseMessage(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your response to this appeal..."
                            />
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowResponseModal(false);
                                    setResponseMessage('');
                                    setSelectedAppeal(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectAppeal}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <XCircle className="w-4 h-4" />
                                Reject Appeal
                            </button>
                            <button
                                onClick={handleApproveAppeal}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Approve Appeal
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* View Details Modal */}
            {showViewModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <Eye className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Appeal Details
                                </h3>
                            </div>
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    setSelectedAppeal(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            {/* User Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">User Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                                        <p className="text-sm text-gray-900">{selectedAppeal?.userName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                                        <p className="text-sm text-gray-900">{selectedAppeal?.userEmail}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Account Type</label>
                                        <div className="mt-1">
                                            {getUserTypeBadge(selectedAppeal?.userType)}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Appeal Date</label>
                                        <p className="text-sm text-gray-900">
                                            {selectedAppeal?.appealDate ? new Date(selectedAppeal.appealDate).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Suspension Information */}
                            <div className="bg-red-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Suspension Information</h4>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Reason for Suspension</label>
                                    <p className="text-sm text-red-700 font-medium">{selectedAppeal?.originalSuspensionReason}</p>
                                </div>
                            </div>

                            {/* Appeal Message */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Appeal Message</h4>
                                <div className="bg-white rounded-lg p-4 border border-blue-200">
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {selectedAppeal?.appealMessage}
                                    </p>
                                </div>
                            </div>

                            {/* Status and Response */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Status & Response</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Current Status</label>
                                        <div className="mt-1">
                                            {getStatusBadge(selectedAppeal?.status)}
                                        </div>
                                    </div>
                                    
                                    {selectedAppeal?.adminResponse && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Admin Response</label>
                                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                    {selectedAppeal.adminResponse}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {selectedAppeal?.responseDate && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Response Date</label>
                                            <p className="text-sm text-gray-900">
                                                {new Date(selectedAppeal.responseDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    setSelectedAppeal(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                            {selectedAppeal?.status === 'pending' && (
                                <button
                                    onClick={() => {
                                        setShowViewModal(false);
                                        handleRespondToAppeal(selectedAppeal);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Respond to Appeal
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AdminLayout>
    );
}
