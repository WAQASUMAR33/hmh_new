'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
    Search, 
    Filter, 
    Calendar, 
    DollarSign,
    Clock,
    User,
    FileText,
    ArrowRight,
    ChevronDown,
    MessageSquare,
    RefreshCw,
    Plus,
    Eye,
    CheckCircle,
    XCircle,
    AlertCircle,
    Play,
    CheckSquare,
    AlertTriangle
} from 'lucide-react';
import BookingCard from '../../components/BookingCard';
import ChatModal from '../../components/ChatModal';

/* ---------------- Enhanced Animations ---------------- */
const heroStagger = { hidden: {}, visible: { transition: { delayChildren: 0.08, staggerChildren: 0.06 } } };
const fadeDown = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
const cardIn = { hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };
const staggerChildren = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const itemUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };

/* Enhanced Glow orbs behind hero band */
function GlowOrbs() {
    return (
        <>
            <motion.span className="pointer-events-none absolute -top-10 -left-8 h-48 w-48 rounded-full bg-violet-400/50 blur-3xl"
                initial={{ y: 0 }} animate={{ y: [-6, 6, -6] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.span className="pointer-events-none absolute -bottom-12 right-10 h-56 w-56 rounded-full bg-indigo-400/50 blur-3xl"
                initial={{ y: 0 }} animate={{ y: [8, -8, 8] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.span className="pointer-events-none absolute top-6 right-1/3 h-40 w-40 rounded-full bg-blue-400/40 blur-3xl"
                initial={{ y: 0 }} animate={{ y: [-10, 10, -10] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.span className="pointer-events-none absolute top-1/2 left-1/4 h-32 w-32 rounded-full bg-purple-400/30 blur-2xl"
                initial={{ y: 0 }} animate={{ y: [5, -5, 5] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        </>
    );
}

function StatusBadge({ status }) {
    const variants = {
        PENDING: 'bg-amber-100 border-amber-200 text-amber-700',
        ACCEPTED: 'bg-blue-100 border-blue-200 text-blue-700',
        PAID: 'bg-emerald-100 border-emerald-200 text-emerald-700',
        IN_PROGRESS: 'bg-purple-100 border-purple-200 text-purple-700',
        DELIVERED: 'bg-indigo-100 border-indigo-200 text-indigo-700',
        COMPLETED: 'bg-green-100 border-green-200 text-green-700',
        CANCELLED: 'bg-red-100 border-red-200 text-red-700',
        DISPUTED: 'bg-orange-100 border-orange-200 text-orange-700',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${variants[status] || variants.PENDING}`}>
            {status.replace('_', ' ')}
        </span>
    );
}

function Pill({ children, variant = 'default' }) {
    const variants = {
        default: 'inline-flex items-center rounded-full border border-gray-200 bg-white/70 px-2.5 py-1 text-xs text-gray-700',
        primary: 'inline-flex items-center rounded-full bg-violet-100 border border-violet-200 px-2.5 py-1 text-xs text-violet-700 font-medium',
        success: 'inline-flex items-center rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-1 text-xs text-emerald-700 font-medium',
        info: 'inline-flex items-center rounded-full bg-blue-100 border border-blue-200 px-2.5 py-1 text-xs text-blue-700 font-medium',
        warning: 'inline-flex items-center rounded-full bg-amber-100 border border-amber-200 px-2.5 py-1 text-xs text-amber-700 font-medium'
    };
    return <span className={variants[variant]}>{children}</span>;
}

export default function PublisherBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        search: ''
    });

    // Chat
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [chatLoading, setChatLoading] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user, filters]);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/debug/user', { credentials: 'include' });
            const data = await response.json();
            if (data.authenticated) {
                setUser(data.user);
            } else {
                toast.error('Please log in to view bookings');
                router.push('/login');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            toast.error('Failed to load user data');
        }
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);

            const response = await fetch(`/api/bookings?${params}`, { credentials: 'include' });
            const data = await response.json();

            if (response.ok) {
                setBookings(data.data || []);
            } else {
                toast.error(data.message || 'Failed to load bookings');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = (updatedBooking) => {
        setBookings(prev => 
            prev.map(booking => 
                booking.id === updatedBooking.id ? updatedBooking : booking
            )
        );
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            search: ''
        });
    };

    const getStatusCounts = () => {
        const counts = {};
        bookings.forEach(booking => {
            counts[booking.status] = (counts[booking.status] || 0) + 1;
        });
        return counts;
    };

    const filteredBookings = bookings.filter(booking => {
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const title = booking.opportunity?.title?.toLowerCase() || '';
            const notes = booking.notes?.toLowerCase() || '';
            if (!title.includes(searchTerm) && !notes.includes(searchTerm)) {
                return false;
            }
        }
        return true;
    });

    const statusCounts = getStatusCounts();

    const openChat = async (booking) => {
        setSelectedBooking(booking);
        setIsChatOpen(true);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black">
            <Sidebar />
            {/* Sticky top header */}
            <div className="sticky top-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60" style={{ marginLeft: 'var(--publisher-sidebar-width, 80px)' }}>
                <Header />
            </div>

            {/* Enhanced Hero with wide container */}
            <motion.section
                variants={heroStagger}
                initial="hidden"
                animate="visible"
                className="relative px-4 sm:px-8 pt-6 sm:pt-8" style={{ marginLeft: 'var(--publisher-sidebar-width, 80px)' }}
            >
                <div className="max-w-[90rem] mx-auto relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white px-6 sm:px-8 py-6 shadow-lg">
                    <GlowOrbs />
                    <motion.div variants={fadeDown} className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                My Bookings
                            </h1>
                        </div>
                        <motion.p variants={fadeDown} className="text-base sm:text-lg text-violet-100/90 max-w-2xl mb-3">
                            Manage your publishing bookings and track their progress with advertisers.
                        </motion.p>
                        <motion.div variants={fadeDown} className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-violet-100/80">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                <span className="text-sm">Active Bookings</span>
                            </div>
                            <div className="flex items-center gap-2 text-violet-100/80">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span className="text-sm">Revenue Tracking</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            <motion.div className="px-4 sm:px-8 mt-6" style={{ marginLeft: 'var(--publisher-sidebar-width, 80px)' }} variants={cardIn} initial="hidden" animate="visible">
                <ToastContainer position="top-right" />
                
                <div className="max-w-[90rem] mx-auto">
                    {/* Status Summary Cards */}
                    <motion.div 
                        variants={staggerChildren}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8"
                    >
                        {Object.entries(statusCounts).map(([status, count]) => (
                            <motion.div 
                                key={status}
                                variants={itemUp}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition-shadow"
                            >
                                <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                                <StatusBadge status={status} />
                            </motion.div>
                        ))}
                        {Object.keys(statusCounts).length === 0 && (
                            <motion.div 
                                variants={itemUp}
                                className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
                            >
                                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                                <p className="text-gray-600">
                                    Your opportunities will appear here when advertisers request bookings.
                                </p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Filters */}
                    <motion.div 
                        variants={cardIn}
                        initial="hidden"
                        animate="visible"
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <Filter className="w-5 h-5 text-violet-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Filters & Search</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search bookings..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                                />
                            </div>

                            {/* Status Filter */}
                            <div>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="ACCEPTED">Accepted</option>
                                    <option value="PAID">Paid</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="DISPUTED">Disputed</option>
                                </select>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={clearFilters}
                                    className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Clear
                                </button>
                                <motion.button
                                    onClick={fetchBookings}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-4 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bookings List */}
                    <motion.div 
                        variants={staggerChildren}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        {loading ? (
                            <motion.div 
                                variants={itemUp}
                                className="flex items-center justify-center py-12"
                            >
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                            </motion.div>
                        ) : filteredBookings.length === 0 ? (
                            <motion.div 
                                variants={itemUp}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
                            >
                                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-900 mb-2">
                                    No bookings found
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {filters.status || filters.search 
                                        ? 'Try adjusting your filters to see more results.'
                                        : 'You don\'t have any publishing bookings yet.'
                                    }
                                </p>
                            </motion.div>
                        ) : (
                            filteredBookings.map((booking, index) => (
                                <motion.div
                                    key={booking.id}
                                    variants={itemUp}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <BookingCard
                                        booking={booking}
                                        userRole={user.role}
                                        onStatusUpdate={handleStatusUpdate}
                                        onOpenChat={openChat}
                                    />
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                </div>

                {/* Chat Modal */}
                <AnimatePresence>
                    {isChatOpen && selectedBooking && (
                        <ChatModal
                            isOpen={isChatOpen}
                            onClose={() => setIsChatOpen(false)}
                            opportunityId={selectedBooking.opportunityId}
                            bookingId={selectedBooking.id}
                            opportunityTitle={selectedBooking.opportunity?.title}
                            publisher={selectedBooking.publisher}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
