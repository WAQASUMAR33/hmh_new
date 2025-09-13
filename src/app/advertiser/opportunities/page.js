'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar'; // adjust path if needed
import Header from '../components/header';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tag as TagIcon, DollarSign, Globe2, Eye, X, Calendar, MessageSquare } from 'lucide-react';
import ChatModal from '@/app/components/ChatModal';
import BookingRequestModal from '../../components/BookingRequestModal';

/* ---------------- Enhanced Animations ---------------- */
const heroStagger = { hidden: {}, visible: { transition: { delayChildren: 0.08, staggerChildren: 0.06 } } };
const fadeDown = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
const cardIn = { hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };
const modalBg = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } }, exit: { opacity: 0, transition: { duration: 0.2 } } };
const modalIn = { hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } }, exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } } };
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

/* ---------------- Enhanced Opportunity Card with Read More ---------------- */
function OpportunityCard({ it, openModal, router, openChat, chatLoading, openBookingModal }) {
    const start = it.availableFrom ? new Date(it.availableFrom) : null;
    const end = it.availableTo ? new Date(it.availableTo) : null;
    const [showFullSummary, setShowFullSummary] = useState(false);
    
    const summary = it.summary || '—';
    const isSummaryLong = summary.length > 120;
    const displaySummary = showFullSummary ? summary : summary.slice(0, 120) + (isSummaryLong ? '...' : '');

    return (
        <motion.div 
            className="group overflow-hidden rounded-2xl ring-1 ring-violet-200/60 shadow-lg bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            {/* Enhanced gradient header */}
            <div className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 px-4 py-3 text-white overflow-hidden">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-xs text-violet-100/90 mb-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                            {start ? start.toLocaleDateString() : 'Start: TBD'} <span className="opacity-80">→</span> {end ? end.toLocaleDateString() : 'End: TBD'}
                        </span>
                    </div>
                    <div className="text-lg font-bold truncate mb-1">
                        <button
                            onClick={() => router.push(`/opportunities/${it.id}`)}
                            className="text-left hover:text-violet-200 transition-colors w-full text-left"
                        >
                            {it.title || 'Untitled opportunity'}
                        </button>
                    </div>
                    <div className="text-[11px] text-violet-100/90">/{it.slug || 'your-slug'}</div>
                </div>
            </div>

            {/* Enhanced body */}
            <div className="p-4 bg-white/80 backdrop-blur flex-1 flex flex-col">
                {/* Enhanced badges row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 border border-violet-200 shadow-sm">
                        {it.placementType?.replace(/_/g, ' ') || '—'}
                    </span>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200 shadow-sm">
                        {it.pricingType || '—'}
                    </span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200 shadow-sm">
                        {it.basePrice ? `${it.currency} ${String(it.basePrice)}` : 'No base price'}
                    </span>
                    {it.monthlyTraffic != null && (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 shadow-sm">
                            {Number(it.monthlyTraffic).toLocaleString()} monthly
                        </span>
                    )}
                </div>

                {/* Enhanced divider */}
                <div className="my-3 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent" />

                {/* Enhanced summary with read more */}
                <div className="flex-1">
                    <p className="text-sm leading-6 text-gray-700 font-medium mb-2">
                        {displaySummary}
                    </p>
                    {isSummaryLong && (
                        <button
                            onClick={() => setShowFullSummary(!showFullSummary)}
                            className="text-violet-600 hover:text-violet-700 text-xs font-medium transition-colors"
                        >
                            {showFullSummary ? 'Show less' : 'Read more'}
                        </button>
                    )}
                </div>
            </div>

            {/* Enhanced footer actions */}
            <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white px-4 py-3 flex items-center justify-between">
                {/* Price Display */}
                <div className="flex items-center gap-2">
                    {it.basePrice ? (
                        <div className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-700">
                                {it.currency} {String(it.basePrice)}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Price not set</span>
                        </div>
                    )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        className="rounded-xl border border-violet-300 px-3 py-2 text-sm hover:bg-violet-50 text-violet-700 font-medium transition-colors"
                        onClick={() => openModal(it)}
                    >
                        Make Offer
                    </button>
                    <button
                        className="rounded-xl bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
                        onClick={() => openBookingModal(it)}
                    >
                        <Calendar className="w-4 h-4" />
                        Request Booking
                    </button>
                    <button
                        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2 text-sm text-white hover:from-violet-700 hover:to-indigo-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                        onClick={() => openChat(it)}
                        disabled={chatLoading}
                    >
                        {chatLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <MessageSquare className="w-4 h-4" />
                        )}
                        {chatLoading ? 'Loading...' : 'Chat'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

/* ---------------- Page ---------------- */
export default function AdvertiserOpportunitiesPage() {
    const router = useRouter();

    const [items, setItems] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filters
    const [q, setQ] = useState('');
    const [placementType, setPlacementType] = useState('ALL');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    // Modal
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(null);
    const [details, setDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    // Offer form
    const [offerName, setOfferName] = useState('');
    const [offerEmail, setOfferEmail] = useState('');
    const [offerMsg, setOfferMsg] = useState('');
    const [sending, setSending] = useState(false);

    // Chat
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [chatLoading, setChatLoading] = useState(false);

    // Booking Request
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedOpportunityForBooking, setSelectedOpportunityForBooking] = useState(null);

    // Build query string
    const queryParams = useMemo(() => {
        const sp = new URLSearchParams();
        if (q) sp.set('q', q.trim());
        if (placementType && placementType !== 'ALL') sp.set('placementType', placementType);
        if (minPrice) sp.set('minPrice', String(minPrice));
        if (maxPrice) sp.set('maxPrice', String(maxPrice));
        sp.set('status', 'PUBLISHED');
        sp.set('take', '20');
        return sp.toString();
    }, [q, placementType, minPrice, maxPrice]);

    const load = useCallback(
        async ({ reset = false, cursor = null } = {}) => {
            try {
                setLoading(true);
                const url = `/api/opportunities?${queryParams}` + (reset || !cursor ? '' : `&cursor=${cursor}`);
                const res = await fetch(url, { credentials: 'include' });
                const json = await res.json();

                if (!res.ok) {
                    toast.error(json?.message || 'Failed to load opportunities');
                    return;
                }

                if (reset) setItems(json.items || []);
                else setItems((prev) => [...prev, ...(json.items || [])]);

                setNextCursor(json.nextCursor);
            } catch (e) {
                console.error(e);
                toast.error('Failed to load opportunities');
            } finally {
                setLoading(false);
            }
        },
        [queryParams]
    );

    useEffect(() => {
        load({ reset: true });
    }, [load]);

    const onApply = () => load({ reset: true });
    const onClear = () => { setQ(''); setPlacementType('ALL'); setMinPrice(''); setMaxPrice(''); };
    const onLoadMore = () => nextCursor && load({ cursor: nextCursor });

    async function openModal(item) {
        setActiveItem(item);
        setOpen(true);
        setDetails(null);
        setDetailsLoading(true);
        try {
            const res = await fetch(`/api/opportunities/${item.id}`, { credentials: 'include' });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Failed to load details');
            setDetails(json.opportunity);
        } catch (e) {
            console.error(e);
            toast.error('Failed to load details');
        } finally {
            setDetailsLoading(false);
        }
    }

    function closeModal() {
        setOpen(false);
        setActiveItem(null);
        setDetails(null);
        setOfferName('');
        setOfferEmail('');
        setOfferMsg('');
        setSending(false);
    }

        async function openChat(opportunity) {
        // Open chat modal directly on the opportunities page
        setSelectedOpportunity(opportunity);
        setIsChatOpen(true);
    }

    function closeChat() {
        setIsChatOpen(false);
        setSelectedOpportunity(null);
    }

    async function sendOffer() {
        if (!offerName.trim() || !offerEmail.trim() || !offerMsg.trim()) {
            toast.error('Please fill your name, email, and message.');
            return;
        }
        try {
            setSending(true);
            const res = await fetch('/api/offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    opportunityId: activeItem?.id,
                    name: offerName.trim(),
                    email: offerEmail.trim(),
                    message: offerMsg.trim(),
                }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.message || 'Failed to send offer');
            toast.success('Offer sent to the publisher!');
            closeModal();
        } catch (e) {
            console.error(e);
            toast.error(e.message || 'Failed to send offer');
        } finally {
            setSending(false);
        }
    }

    function talkToPublisher() {
        closeModal();
        setSelectedOpportunity(activeItem);
        setIsChatOpen(true);
    }

    function openBookingModal(opportunity) {
        setSelectedOpportunityForBooking(opportunity);
        setIsBookingModalOpen(true);
    }

    function closeBookingModal() {
        setIsBookingModalOpen(false);
        setSelectedOpportunityForBooking(null);
    }

    const handleBookingCreated = (booking) => {
        toast.success('Booking request sent successfully!');
        // Optionally redirect to bookings page
        // router.push('/bookings');
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <Sidebar />
            {/* Sticky top header */}
            <div className="ml-20 sticky top-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <Header />
            </div>

            {/* Enhanced Hero with wide container - Less Bulky */}
            <motion.section
                variants={heroStagger}
                initial="hidden"
                animate="visible"
                className="relative ml-16 sm:ml-20 px-4 sm:px-8 pt-6 sm:pt-8"
            >
                <div className="max-w-[90rem] mx-auto relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white px-6 sm:px-8 py-6 shadow-lg">
                    <GlowOrbs />
                    <motion.div variants={fadeDown} className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                Discover Opportunities
                            </h1>
                        </div>
                        <motion.p variants={fadeDown} className="text-base sm:text-lg text-violet-100/90 max-w-2xl mb-3">
                            Search, filter, and find the perfect placements to promote your brand.
                        </motion.p>
                        <motion.div variants={fadeDown} className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-violet-100/80">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                <span className="text-sm">Premium Publishers</span>
                            </div>
                            <div className="flex items-center gap-2 text-violet-100/80">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span className="text-sm">Verified Opportunities</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Enhanced Filters — single line, responsive */}
            <motion.div className="ml-16 sm:ml-20 px-4 sm:px-8 mt-6" variants={cardIn} initial="hidden" animate="visible">
                <ToastContainer position="top-right" />
                <div className="max-w-[90rem] mx-auto rounded-3xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-6 sm:p-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Filter Opportunities</h2>
                    </div>
                    <div className="flex flex-wrap items-end gap-4">
                        {/* Enhanced Search */}
                        <div className="flex-1 min-w-[220px]">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Opportunities</label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Search by title, summary, description…"
                                    className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Enhanced Placement Type */}
                        <div className="w-48">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Placement Type</label>
                            <select
                                value={placementType}
                                onChange={(e) => setPlacementType(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                            >
                                {[
                                    'ALL',
                                    'HOMEPAGE_BANNER',
                                    'CATEGORY_BANNER',
                                    'SPONSORED_ARTICLE',
                                    'NEWSLETTER_FEATURE',
                                    'SOCIAL_POST',
                                    'REVIEW',
                                    'GIVEAWAY',
                                    'PODCAST_READ',
                                    'OTHER',
                                ].map((pt) => (
                                    <option key={pt} value={pt}>
                                        {pt.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Enhanced Min Price */}
                        <div className="w-36">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 pl-8 pr-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Enhanced Max Price */}
                        <div className="w-36">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 pl-8 pr-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                    placeholder="∞"
                                />
                            </div>
                        </div>

                        {/* Enhanced Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onApply}
                                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-white hover:from-violet-700 hover:to-indigo-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={onClear}
                                className="rounded-xl border border-gray-300 px-6 py-3 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Enhanced Results grid — wide container, 3 cards per row on large */}
            <motion.div className="ml-16 sm:ml-20 px-4 sm:px-8 mt-6 pb-12" variants={cardIn} initial="hidden" animate="visible">
                <div className="max-w-[90rem] mx-auto">
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Available Opportunities</h2>
                                <p className="text-sm text-gray-600">{items.length} opportunities found</p>
                            </div>
                        </div>
                        
                        {items.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                <span>All opportunities are verified and active</span>
                            </div>
                        )}
                    </div>

                    {items.length === 0 && !loading ? (
                        <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12 text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No opportunities found</h3>
                            <p className="text-gray-600 mb-4">Try adjusting your search filters or check back later for new opportunities.</p>
                            <button
                                onClick={onClear}
                                className="rounded-xl bg-violet-600 px-6 py-2 text-white hover:bg-violet-700 font-medium transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={staggerChildren}
                            initial="hidden"
                            animate="visible"
                        >
                            {items.map((it, index) => (
                                <motion.div
                                    key={it.id}
                                    variants={itemUp}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <OpportunityCard it={it} openModal={openModal} router={router} openChat={openChat} chatLoading={chatLoading} openBookingModal={openBookingModal} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {nextCursor && (
                        <motion.div 
                            className="mt-8 flex justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <button
                                onClick={onLoadMore}
                                disabled={loading}
                                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3 text-white hover:from-violet-700 hover:to-indigo-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Loading more opportunities...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                        Load More Opportunities
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* -------- Enhanced Modal - Centered and Wider -------- */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                        variants={modalBg}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* backdrop */}
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
                        
                        {/* dialog */}
                        <motion.div
                            variants={modalIn}
                            className="relative z-[61] w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            {/* Enhanced Header */}
                            <div className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white p-6">
                                <button
                                    onClick={closeModal}
                                    className="absolute right-4 top-4 rounded-full p-2 text-white/80 hover:bg-white/20 transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <motion.div variants={staggerChildren} initial="hidden" animate="visible">
                                    <motion.div variants={itemUp} className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">
                                                {activeItem?.title || 'Opportunity Details'}
                                            </h3>
                                            <div className="text-violet-100/90 text-sm">/{activeItem?.slug}</div>
                                        </div>
                                    </motion.div>

                                    {/* Enhanced meta pills */}
                                    <motion.div variants={itemUp} className="flex flex-wrap gap-2">
                                        <Pill variant="primary">
                                            <TagIcon className="mr-1.5 h-3.5 w-3.5" />
                                            {activeItem?.placementType?.replace(/_/g, ' ')}
                                        </Pill>
                                        <Pill variant="info">{activeItem?.pricingType}</Pill>
                                        {activeItem?.basePrice && (
                                            <Pill variant="success">
                                                <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                                                {activeItem?.currency} {String(activeItem.basePrice)}
                                            </Pill>
                                        )}
                                        {details?.monthlyTraffic != null && (
                                            <Pill variant="warning">
                                                {Number(details.monthlyTraffic).toLocaleString()} monthly visitors
                                            </Pill>
                                        )}
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Enhanced Content */}
                            <div className="p-6">
                                <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                    
                                    {/* Left Column - Opportunity Details */}
                                    <motion.div variants={itemUp} className="xl:col-span-2 space-y-4">
                                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Opportunity Overview
                                            </h4>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-700 mb-2">Summary</div>
                                                    <p className="text-sm text-gray-600 leading-relaxed">{activeItem?.summary || '—'}</p>
                                                </div>

                                                <div>
                                                    <div className="text-sm font-semibold text-gray-700 mb-2">Detailed Description</div>
                                                    <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-gray-100">
                                                        {detailsLoading ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-600"></div>
                                                                Loading details...
                                                            </div>
                                                        ) : (
                                                            details?.description || 'No detailed description available.'
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Key Information Cards */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar className="h-4 w-4 text-blue-600" />
                                                    <span className="text-sm font-semibold text-blue-800">Availability</span>
                                                </div>
                                                <div className="text-sm text-blue-700">
                                                    {details?.availableFrom ? new Date(details.availableFrom).toLocaleDateString() : 'TBD'} →
                                                    {details?.availableTo ? ` ${new Date(details.availableTo).toLocaleDateString()}` : ' TBD'}
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border border-emerald-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <DollarSign className="h-4 w-4 text-emerald-600" />
                                                    <span className="text-sm font-semibold text-emerald-800">Pricing Info</span>
                                                </div>
                                                <div className="text-sm text-emerald-700">
                                                    <div>Currency: {activeItem?.currency || '—'}</div>
                                                    <div>Type: {activeItem?.pricingType || '—'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tags and Categories */}
                                        {(details?.geos?.length || details?.verticals?.length) && (
                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                                                <h5 className="text-sm font-semibold text-purple-800 mb-3">Categories & Regions</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {details?.verticals?.slice(0, 5).map((v) => (
                                                        <Pill key={v} variant="primary">{v}</Pill>
                                                    ))}
                                                    {details?.geos?.slice(0, 5).map((g) => (
                                                        <Pill key={g} variant="info">
                                                            <Globe2 className="mr-1.5 h-3.5 w-3.5" />
                                                            {g}
                                                        </Pill>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Right Column - Enhanced Offer Form */}
                                    <motion.div variants={itemUp} className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-5 border border-violet-200">
                                        <div className="text-center mb-5">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                </svg>
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-800 mb-2">Make Your Offer</h4>
                                            <p className="text-sm text-gray-600">Send a compelling proposal to the publisher.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                                                <input
                                                    value={offerName}
                                                    onChange={(e) => setOfferName(e.target.value)}
                                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email *</label>
                                                <input
                                                    type="email"
                                                    value={offerEmail}
                                                    onChange={(e) => setOfferEmail(e.target.value)}
                                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                                    placeholder="your.email@company.com"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Proposal *</label>
                                                <textarea
                                                    rows={5}
                                                    value={offerMsg}
                                                    onChange={(e) => setOfferMsg(e.target.value)}
                                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors resize-none"
                                                    placeholder="Share your budget, campaign goals, timeline, and any specific requirements. Be detailed to increase your chances of acceptance!"
                                                />
                                            </div>

                                            {/* Tips Section */}
                                            <div className="bg-white/60 rounded-xl p-4 border border-violet-200">
                                                <h5 className="text-sm font-semibold text-violet-800 mb-2 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Pro Tips for Better Offers
                                                </h5>
                                                <ul className="text-xs text-violet-700 space-y-1">
                                                    <li>• Include your budget range and timeline</li>
                                                    <li>• Explain your campaign goals and target audience</li>
                                                    <li>• Mention any specific requirements or preferences</li>
                                                    <li>• Be professional but friendly in your tone</li>
                                                </ul>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="space-y-3 pt-4">
                                                <button
                                                    onClick={() => {
                                                        closeModal();
                                                        setSelectedOpportunity(activeItem);
                                                        setIsChatOpen(true);
                                                    }}
                                                    className="w-full rounded-xl border border-violet-300 px-6 py-3 text-violet-700 hover:bg-violet-50 font-semibold transition-colors"
                                                    type="button"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                        Chat with Publisher
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        closeModal();
                                                        openBookingModal(activeItem);
                                                    }}
                                                    className="w-full rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 font-semibold transition-colors"
                                                    type="button"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        Request Booking
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={sendOffer}
                                                    disabled={sending}
                                                    className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-white hover:from-violet-700 hover:to-indigo-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                                                    type="button"
                                                >
                                                    {sending ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                            Sending Offer...
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                            </svg>
                                                            Send Message
                                                        </div>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Booking Request Modal */}
            <BookingRequestModal
                isOpen={isBookingModalOpen}
                onClose={closeBookingModal}
                opportunity={selectedOpportunityForBooking}
                onBookingCreated={handleBookingCreated}
            />

            {/* Chat Modal */}
            {selectedOpportunity && (
                <ChatModal
                    isOpen={isChatOpen}
                    onClose={closeChat}
                    opportunityId={selectedOpportunity.id}
                    opportunityTitle={selectedOpportunity.title}
                    publisher={selectedOpportunity.publisher}
                />
            )}
        </div>
    );
}
