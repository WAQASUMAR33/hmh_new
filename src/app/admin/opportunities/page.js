'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
    Search, 
    Filter, 
    Trash2, 
    Eye,
    Shield,
    ArrowLeft,
    LogOut,
    Calendar,
    MapPin,
    DollarSign,
    Users,
    AlertTriangle,
    CheckCircle,
    XCircle,
    FileText
} from 'lucide-react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';

export default function OpportunityManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [opportunities, setOpportunities] = useState([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');
    const router = useRouter();

    // Mock data for opportunities
    const mockOpportunities = [
        {
            id: 1,
            title: 'Tech Product Launch Campaign',
            advertiser: 'TechCorp Solutions',
            category: 'Technology',
            status: 'active',
            budget: 15000,
            duration: '30 days',
            targetAudience: 'Tech enthusiasts, 25-45',
            description: 'Promote our new AI-powered smartphone with advanced features',
            createdDate: '2024-01-15',
            applications: 23,
            approvedApplications: 15,
            region: 'North America'
        },
        {
            id: 2,
            title: 'Fashion Brand Awareness',
            advertiser: 'Fashion Forward Ltd',
            category: 'Fashion',
            status: 'active',
            budget: 8500,
            duration: '21 days',
            targetAudience: 'Fashion-conscious women, 18-35',
            description: 'Showcase our latest spring collection with sustainable materials',
            createdDate: '2024-01-12',
            applications: 18,
            approvedApplications: 12,
            region: 'Europe'
        },
        {
            id: 3,
            title: 'Inappropriate Content Campaign',
            advertiser: 'Questionable Ads Inc',
            category: 'Other',
            status: 'flagged',
            budget: 5000,
            duration: '14 days',
            targetAudience: 'General audience',
            description: 'This campaign contains inappropriate content and should be removed',
            createdDate: '2024-01-20',
            applications: 5,
            approvedApplications: 0,
            region: 'Global',
            flagReason: 'Contains inappropriate content'
        },
        {
            id: 4,
            title: 'Green Energy Solutions',
            advertiser: 'Green Energy Co',
            category: 'Environment',
            status: 'active',
            budget: 12000,
            duration: '45 days',
            targetAudience: 'Environmentally conscious consumers',
            description: 'Promote renewable energy solutions for homes and businesses',
            createdDate: '2024-01-18',
            applications: 31,
            approvedApplications: 25,
            region: 'Asia'
        },
        {
            id: 5,
            title: 'Spam Campaign',
            advertiser: 'Spam Company',
            category: 'Other',
            status: 'flagged',
            budget: 2000,
            duration: '7 days',
            targetAudience: 'Everyone',
            description: 'This appears to be a spam campaign with misleading information',
            createdDate: '2024-01-21',
            applications: 2,
            approvedApplications: 0,
            region: 'Global',
            flagReason: 'Spam and misleading content'
        },
        {
            id: 6,
            title: 'Local Bakery Promotion',
            advertiser: 'Local Bakery Chain',
            category: 'Food & Beverage',
            status: 'active',
            budget: 3000,
            duration: '14 days',
            targetAudience: 'Local community, food lovers',
            description: 'Promote our fresh baked goods and new menu items',
            createdDate: '2024-01-19',
            applications: 8,
            approvedApplications: 6,
            region: 'North America'
        }
    ];

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const fetchOpportunities = async () => {
        try {
            const response = await fetch('/api/admin/opportunities');
            const result = await response.json();
            
            if (result.success) {
                // Transform the data to match the expected format
                const transformedOpportunities = result.data.map(opp => ({
                    id: opp.id,
                    title: opp.title,
                    advertiser: opp.publisher.brandName || `${opp.publisher.firstName} ${opp.publisher.lastName}`,
                    category: opp.placementType,
                    status: opp.status.toLowerCase(),
                    budget: parseFloat(opp.basePrice || 0),
                    duration: '30 days', // Default duration
                    targetAudience: 'General audience', // Default
                    description: opp.summary || opp.description || 'No description available',
                    createdDate: new Date(opp.createdAt).toISOString().split('T')[0],
                    applications: opp._count.offers,
                    approvedApplications: opp._count.bookings,
                    region: 'Global', // Default
                    flagReason: opp.status === 'DRAFT' ? 'Draft opportunity' : ''
                }));
                setOpportunities(transformedOpportunities);
            } else {
                // Fallback to mock data
                setOpportunities(mockOpportunities);
            }
        } catch (error) {
            console.error('Error fetching opportunities:', error);
            // Fallback to mock data
            setOpportunities(mockOpportunities);
        }
    };

    const filteredOpportunities = opportunities.filter(opportunity => {
        const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            opportunity.advertiser.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || opportunity.status === filterStatus;
        const matchesCategory = filterCategory === 'all' || opportunity.category === filterCategory;
        
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const handleDeleteOpportunity = (opportunity) => {
        setSelectedOpportunity(opportunity);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!deleteReason.trim()) {
            toast.error('Please provide a reason for deletion');
            return;
        }

        // Remove opportunity from list
        setOpportunities(prev => prev.filter(o => o.id !== selectedOpportunity.id));

        toast.success(`Opportunity deleted: ${selectedOpportunity.title}`);
        setShowDeleteModal(false);
        setDeleteReason('');
        setSelectedOpportunity(null);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
            case 'flagged':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Flagged</span>;
            case 'completed':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Completed</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
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
        <AdminLayout title="Opportunity Management" icon={FileText}>
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
                                    placeholder="Search opportunities by title, advertiser, or description..."
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
                                <option value="flagged">Flagged</option>
                                <option value="completed">Completed</option>
                            </select>
                            
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Categories</option>
                                <option value="Technology">Technology</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Environment">Environment</option>
                                <option value="Food & Beverage">Food & Beverage</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Opportunities Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Opportunities ({filteredOpportunities.length})
                        </h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opportunity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advertiser</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOpportunities.map((opportunity) => (
                                    <motion.tr
                                        key={opportunity.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                <div className="text-sm font-medium text-gray-900 truncate">{opportunity.title}</div>
                                                <div className="text-sm text-gray-500 truncate">{opportunity.description}</div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    <Calendar className="w-3 h-3 inline mr-1" />
                                                    {new Date(opportunity.createdDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{opportunity.advertiser}</div>
                                            <div className="text-sm text-gray-500">{opportunity.region}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {opportunity.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(opportunity.status)}
                                            {opportunity.status === 'flagged' && opportunity.flagReason && (
                                                <div className="text-xs text-red-600 mt-1">{opportunity.flagReason}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatCurrency(opportunity.budget)}
                                            </div>
                                            <div className="text-sm text-gray-500">{opportunity.duration}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {opportunity.approvedApplications}/{opportunity.applications} approved
                                            </div>
                                            <div className="text-xs text-gray-500">Total: {opportunity.applications}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => setSelectedOpportunity(opportunity)}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOpportunity(opportunity)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    title="Delete Opportunity"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
                    >
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Delete Opportunity
                            </h3>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-3">
                                Are you sure you want to delete this opportunity?
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                <div className="text-sm font-medium text-gray-900">{selectedOpportunity?.title}</div>
                                <div className="text-sm text-gray-500">{selectedOpportunity?.advertiser}</div>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Deletion
                            </label>
                            <textarea
                                value={deleteReason}
                                onChange={(e) => setDeleteReason(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Enter the reason for deleting this opportunity..."
                            />
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteReason('');
                                    setSelectedOpportunity(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                                Delete Opportunity
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AdminLayout>
    );
}
