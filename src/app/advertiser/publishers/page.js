'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { motion } from 'framer-motion';
import { 
    Search, 
    Filter, 
    Users, 
    Eye, 
    MessageCircle, 
    Globe, 
    BarChart3,
    Building,
    MapPin,
    Calendar,
    ExternalLink
} from 'lucide-react';
import ChatModal from '@/app/components/ChatModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            staggerChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export default function PublisherDiscovery() {
    const [publishers, setPublishers] = useState([]);
    const [filteredPublishers, setFilteredPublishers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        monthlyViews: '',
        monthlyTraffic: '',
        websiteRegion: '',
        entityType: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedPublisher, setSelectedPublisher] = useState(null);
    const [showPublisherModal, setShowPublisherModal] = useState(false);
    
    // Chat functionality
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedPublisherForChat, setSelectedPublisherForChat] = useState(null);
    const [chatLoading, setChatLoading] = useState(false);

    useEffect(() => {
        fetchPublishers();
    }, []);

    useEffect(() => {
        filterPublishers();
    }, [publishers, searchTerm, filters]);

    const fetchPublishers = async () => {
        try {
            console.log('Fetching publishers...');
            const response = await fetch('/api/publishers', {
                credentials: 'include'
            });
            
            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Publishers data:', data);
                console.log('First publisher fields:', data.publishers?.[0] ? Object.keys(data.publishers[0]) : 'No publishers');
                setPublishers(data.publishers || []);
            } else {
                const errorData = await response.json();
                console.error('Failed to fetch publishers:', errorData);
                // Show error message to user
                alert(`Error: ${errorData.error || 'Failed to fetch publishers'}`);
            }
        } catch (error) {
            console.error('Error fetching publishers:', error);
            alert('Network error while fetching publishers');
        } finally {
            setLoading(false);
        }
    };

    const filterPublishers = () => {
        let filtered = publishers;

        // Search by name
        if (searchTerm) {
            filtered = filtered.filter(publisher => 
                publisher.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                publisher.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                publisher.companyLegalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                publisher.contactName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by monthly views
        if (filters.monthlyViews) {
            const [min, max] = filters.monthlyViews.split('-').map(Number);
            filtered = filtered.filter(publisher => {
                const views = publisher.monthlyPageViews || 0;
                if (max) {
                    return views >= min && views <= max;
                }
                return views >= min;
            });
        }

        // Filter by monthly traffic
        if (filters.monthlyTraffic) {
            const [min, max] = filters.monthlyTraffic.split('-').map(Number);
            filtered = filtered.filter(publisher => {
                const traffic = publisher.monthlyTraffic || 0;
                if (max) {
                    return traffic >= min && traffic <= max;
                }
                return traffic >= min;
            });
        }

        // Filter by website region
        if (filters.websiteRegion) {
            filtered = filtered.filter(publisher => 
                publisher.websiteRegion === filters.websiteRegion
            );
        }

        // Filter by entity type
        if (filters.entityType) {
            filtered = filtered.filter(publisher => 
                publisher.entityType === filters.entityType
            );
        }

        setFilteredPublishers(filtered);
    };

    const handlePublisherClick = (publisher) => {
        setSelectedPublisher(publisher);
        setShowPublisherModal(true);
    };

    const handleMessagePublisher = async (publisher) => {
        try {
            setChatLoading(true);
            // Open chat modal directly
            setSelectedPublisherForChat(publisher);
            setIsChatOpen(true);
        } catch (error) {
            console.error('Error opening chat:', error);
            toast.error('Failed to open chat');
        } finally {
            setChatLoading(false);
        }
    };

    const closeChat = () => {
        setIsChatOpen(false);
        setSelectedPublisherForChat(null);
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const getTrafficRange = (traffic) => {
        if (traffic >= 1000000) return '1M+';
        if (traffic >= 500000) return '500K-1M';
        if (traffic >= 100000) return '100K-500K';
        if (traffic >= 50000) return '50K-100K';
        if (traffic >= 10000) return '10K-50K';
        return 'Under 10K';
    };

    const getViewsRange = (views) => {
        if (views >= 5000000) return '5M+';
        if (views >= 1000000) return '1M-5M';
        if (views >= 500000) return '500K-1M';
        if (views >= 100000) return '100K-500K';
        if (views >= 50000) return '50K-100K';
        return 'Under 50K';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white text-black">
                <Sidebar />
                
                {/* Sticky top header */}
                <div className="sticky top-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60" style={{ marginLeft: 'var(--advertiser-sidebar-width, 80px)' }}>
                    <Header />
                </div>
                
                <div className="flex items-center justify-center min-h-[calc(100vh-80px)]" style={{ marginLeft: 'var(--advertiser-sidebar-width, 80px)' }}>
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading publishers...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black">
            <ToastContainer position="top-right" />
            <Sidebar />
            
            {/* Sticky top header */}
            <div className="sticky top-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60" style={{ marginLeft: 'var(--advertiser-sidebar-width, 80px)' }}>
                <Header />
            </div>
            
            <motion.div 
                className="p-6 bg-gray-50 overflow-y-auto" style={{ marginLeft: 'var(--advertiser-sidebar-width, 80px)' }}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <motion.div className="mb-8" variants={cardVariants}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">Discover Publishers</h1>
                                    <p className="text-gray-600">Find and connect with publishers for your campaigns</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Search and Filters */}
                        <motion.div className="mb-6" variants={cardVariants}>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                {/* Search Bar */}
                                <div className="flex gap-4 mb-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search publishers by name, company, or contact..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                                    >
                                        <Filter className="w-5 h-5" />
                                        Filters
                                    </button>
                                </div>

                                {/* Filters */}
                                {showFilters && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="border-t border-gray-200 pt-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Monthly Page Views
                                                </label>
                                                <select
                                                    value={filters.monthlyViews}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, monthlyViews: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">All ranges</option>
                                                    <option value="0-50000">Under 50K</option>
                                                    <option value="50000-100000">50K-100K</option>
                                                    <option value="100000-500000">100K-500K</option>
                                                    <option value="500000-1000000">500K-1M</option>
                                                    <option value="1000000-5000000">1M-5M</option>
                                                    <option value="5000000-999999999">5M+</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Monthly Traffic
                                                </label>
                                                <select
                                                    value={filters.monthlyTraffic}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, monthlyTraffic: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">All ranges</option>
                                                    <option value="0-10000">Under 10K</option>
                                                    <option value="10000-50000">10K-50K</option>
                                                    <option value="50000-100000">50K-100K</option>
                                                    <option value="100000-500000">100K-500K</option>
                                                    <option value="500000-1000000">500K-1M</option>
                                                    <option value="1000000-999999999">1M+</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Website Region
                                                </label>
                                                <select
                                                    value={filters.websiteRegion}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, websiteRegion: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">All regions</option>
                                                    <option value="USA">USA</option>
                                                    <option value="Canada">Canada</option>
                                                    <option value="UK">UK</option>
                                                    <option value="Europe">Europe</option>
                                                    <option value="Asia">Asia</option>
                                                    <option value="Global">Global</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Entity Type
                                                </label>
                                                <select
                                                    value={filters.entityType}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, entityType: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">All types</option>
                                                    <option value="LLC">LLC</option>
                                                    <option value="Corporation">Corporation</option>
                                                    <option value="Partnership">Partnership</option>
                                                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                                                    <option value="Non-Profit">Non-Profit</option>
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>

                        {/* Results Count */}
                        <motion.div className="mb-6" variants={cardVariants}>
                            <div className="flex items-center justify-between">
                                <p className="text-gray-600">
                                    Found {filteredPublishers.length} publisher{filteredPublishers.length !== 1 ? 's' : ''}
                                </p>
                                {searchTerm || Object.values(filters).some(f => f) && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilters({
                                                monthlyViews: '',
                                                monthlyTraffic: '',
                                                websiteRegion: '',
                                                entityType: ''
                                            });
                                        }}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        {/* Publishers Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPublishers.map((publisher, index) => (
                                <motion.div
                                    key={publisher.id}
                                    variants={cardVariants}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => handlePublisherClick(publisher)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {publisher.firstName?.[0]}{publisher.lastName?.[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {publisher.firstName} {publisher.lastName}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {publisher.companyLegalName}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <BarChart3 className="w-4 h-4" />
                                            <span>{formatNumber(publisher.monthlyPageViews || 0)} monthly views</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Users className="w-4 h-4" />
                                            <span>{formatNumber(publisher.monthlyTraffic || 0)} monthly visitors</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Globe className="w-4 h-4" />
                                            <span>{publisher.websiteRegion || 'Not specified'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Building className="w-4 h-4" />
                                            <span>{publisher.entityType || 'Not specified'}</span>
                                        </div>
                                        {(publisher.websiteUrl || publisher.website || publisher.url) && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <ExternalLink className="w-4 h-4 text-blue-600" />
                                                <a 
                                                    href={(publisher.websiteUrl || publisher.website || publisher.url).startsWith('http') ? (publisher.websiteUrl || publisher.website || publisher.url) : `https://${publisher.websiteUrl || publisher.website || publisher.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 hover:underline truncate"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {publisher.websiteUrl || publisher.website || publisher.url}
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePublisherClick(publisher);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMessagePublisher(publisher);
                                            }}
                                            disabled={chatLoading}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                        >
                                            {chatLoading ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            ) : (
                                                <MessageCircle className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {filteredPublishers.length === 0 && (
                            <motion.div className="text-center py-12" variants={cardVariants}>
                                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No publishers found</h3>
                                <p className="text-gray-500">
                                    Try adjusting your search terms or filters to find more publishers.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

            {/* Publisher Detail Modal */}
            {showPublisherModal && selectedPublisher && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                                    {selectedPublisher.firstName?.[0]}{selectedPublisher.lastName?.[0]}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {selectedPublisher.firstName} {selectedPublisher.lastName}
                                    </h2>
                                    <p className="text-gray-600">{selectedPublisher.companyLegalName}</p>
                                    <p className="text-sm text-gray-500">{selectedPublisher.contactName}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPublisherModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Company Overview</h3>
                                <p className="text-gray-600">{selectedPublisher.briefIntro}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BarChart3 className="w-5 h-5 text-blue-600" />
                                        <span className="font-semibold text-gray-800">Monthly Page Views</span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatNumber(selectedPublisher.monthlyPageViews || 0)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="w-5 h-5 text-green-600" />
                                        <span className="font-semibold text-gray-800">Monthly Traffic</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatNumber(selectedPublisher.monthlyTraffic || 0)}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Website Region</p>
                                        <p className="font-medium">{selectedPublisher.websiteRegion || 'Not specified'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Entity Type</p>
                                        <p className="font-medium">{selectedPublisher.entityType || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>

                            {(selectedPublisher.websiteUrl || selectedPublisher.website || selectedPublisher.url) && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ExternalLink className="w-5 h-5 text-blue-600" />
                                        <span className="font-semibold text-gray-800">Website</span>
                                    </div>
                                    <a 
                                        href={(selectedPublisher.websiteUrl || selectedPublisher.website || selectedPublisher.url).startsWith('http') ? (selectedPublisher.websiteUrl || selectedPublisher.website || selectedPublisher.url) : `https://${selectedPublisher.websiteUrl || selectedPublisher.website || selectedPublisher.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                                    >
                                        {selectedPublisher.websiteUrl || selectedPublisher.website || selectedPublisher.url}
                                    </a>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowPublisherModal(false);
                                        handleMessagePublisher(selectedPublisher);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Send Message
                                </button>
                                <button
                                    onClick={() => setShowPublisherModal(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Chat Modal */}
            {selectedPublisherForChat && (
                <ChatModal
                    isOpen={isChatOpen}
                    onClose={closeChat}
                    publisherId={selectedPublisherForChat.id}
                    publisher={selectedPublisherForChat}
                    opportunityTitle={`Chat with ${selectedPublisherForChat.firstName} ${selectedPublisherForChat.lastName}`}
                />
            )}
        </div>
    );
}
