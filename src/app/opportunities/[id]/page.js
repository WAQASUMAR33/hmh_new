'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Globe2, Tag as TagIcon, DollarSign, MessageSquare, User, Building, Clock, MapPin, TrendingUp, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookingRequestModal from '../../components/BookingRequestModal';
import ChatModal from '../../components/ChatModal';

const Pill = ({ children, variant = "default" }) => {
    const variants = {
        default: "bg-gray-100 text-gray-800",
        primary: "bg-violet-100 text-violet-800",
        info: "bg-blue-100 text-blue-800",
        success: "bg-green-100 text-green-800"
    };
    
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
            {children}
        </span>
    );
};

export default function OpportunityDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);

    useEffect(() => {
        fetchOpportunity();
        fetchUser();
    }, [id]);

    const fetchOpportunity = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/opportunities/${id}`);
            const data = await response.json();

            if (response.ok) {
                setOpportunity(data.opportunity);
            } else {
                toast.error(data.message || 'Failed to load opportunity');
                router.push('/advertiser/opportunities');
            }
        } catch (error) {
            console.error('Error fetching opportunity:', error);
            toast.error('Failed to load opportunity');
            router.push('/advertiser/opportunities');
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/user/me');
            const data = await response.json();
            if (response.ok && data.user) {
                setUser(data.user);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const openBookingModal = () => {
        if (!user) {
            toast.error('Please log in to request a booking');
            router.push('/login');
            return;
        }
        setIsBookingModalOpen(true);
    };

    const closeBookingModal = () => {
        setIsBookingModalOpen(false);
    };

    const openChatModal = () => {
        if (!user) {
            toast.error('Please log in to chat with the publisher');
            router.push('/login');
            return;
        }
        setIsChatModalOpen(true);
    };

    const closeChatModal = () => {
        setIsChatModalOpen(false);
    };

    const handleBookingCreated = (booking) => {
        toast.success('Booking request sent successfully!');
        router.push('/bookings');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!opportunity) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Opportunity Not Found</h2>
                    <p className="text-gray-600 mb-4">The opportunity you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                    <button
                        onClick={() => router.push('/advertiser/opportunities')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Back to Opportunities
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{opportunity.title}</h1>
                        <p className="text-lg text-gray-600 mb-6">{opportunity.summary}</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed">{opportunity.description}</p>
                            </div>
                        </motion.div>

                        {/* Requirements & Deliverables */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {opportunity.requirements && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <TagIcon className="w-5 h-5 text-blue-600" />
                                        Requirements
                                    </h3>
                                    <div className="prose prose-gray max-w-none">
                                        <p className="text-gray-700">{opportunity.requirements}</p>
                                    </div>
                                </div>
                            )}

                            {opportunity.deliverables && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                        Deliverables
                                    </h3>
                                    <div className="prose prose-gray max-w-none">
                                        <p className="text-gray-700">{opportunity.deliverables}</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Categories & Regions */}
                        {(opportunity.verticals?.length || opportunity.geos?.length) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories & Regions</h3>
                                <div className="flex flex-wrap gap-2">
                                    {opportunity.verticals?.map((vertical) => (
                                        <Pill key={vertical} variant="primary">{vertical}</Pill>
                                    ))}
                                    {opportunity.geos?.map((geo) => (
                                        <Pill key={geo} variant="info">
                                            <Globe2 className="mr-1.5 h-3.5 w-3.5" />
                                            {geo}
                                        </Pill>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publisher Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Publisher
                            </h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {opportunity.publisher?.firstName?.[0]}{opportunity.publisher?.lastName?.[0]}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {opportunity.publisher?.firstName} {opportunity.publisher?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-600">{opportunity.publisher?.email}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Pricing & Availability */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Availability</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Price:</span>
                                    <span className="font-semibold text-gray-900">
                                        {opportunity.currency} {opportunity.basePrice}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Type:</span>
                                    <span className="font-medium text-gray-900">{opportunity.pricingType}</span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Placement:</span>
                                    <span className="font-medium text-gray-900">{opportunity.placementType}</span>
                                </div>
                                
                                {opportunity.monthlyTraffic && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Monthly Traffic:</span>
                                        <span className="font-medium text-gray-900">{opportunity.monthlyTraffic}</span>
                                    </div>
                                )}
                            </div>

                            {(opportunity.availableFrom || opportunity.availableTo) && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">Availability</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {opportunity.availableFrom ? new Date(opportunity.availableFrom).toLocaleDateString() : 'TBD'} →
                                        {opportunity.availableTo ? ` ${new Date(opportunity.availableTo).toLocaleDateString()}` : ' TBD'}
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="space-y-3"
                        >
                            <button
                                onClick={openBookingModal}
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <Calendar className="w-5 h-5" />
                                Request Booking
                            </button>
                            
                            <button
                                onClick={openChatModal}
                                className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Chat with Publisher
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Booking Request Modal */}
            <BookingRequestModal
                isOpen={isBookingModalOpen}
                onClose={closeBookingModal}
                opportunity={opportunity}
                onBookingCreated={handleBookingCreated}
            />

            {/* Chat Modal */}
            <ChatModal
                isOpen={isChatModalOpen}
                onClose={closeChatModal}
                opportunityId={opportunity?.id}
                opportunityTitle={opportunity?.title}
                publisher={opportunity?.publisher}
            />

            <ToastContainer />
        </div>
    );
}
