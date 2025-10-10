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
    Plus, 
    Edit, 
    Eye, 
    EyeOff, 
    Trash2, 
    Calendar,
    DollarSign,
    Tag,
    TrendingUp,
    Users,
    FileText,
    ArrowRight,
    ChevronDown
} from 'lucide-react';

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
        DRAFT: 'bg-gray-100 border-gray-200 text-gray-700',
        PUBLISHED: 'bg-emerald-100 border-emerald-200 text-emerald-700',
        PAUSED: 'bg-amber-100 border-amber-200 text-amber-700',
        ARCHIVED: 'bg-red-100 border-red-200 text-red-700',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${variants[status] || variants.DRAFT}`}>
            {status}
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



export default function PublisherOpportunitiesPage() {
    const router = useRouter();

    const [items, setItems] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(true);

    const [q, setQ] = useState('');
    const [status, setStatus] = useState('ALL');

    const [selectedOpportunity, setSelectedOpportunity] = useState(null);

    // Build query string when filters change
    const queryParams = useMemo(() => {
        const sp = new URLSearchParams();
        if (q) sp.set('q', q);
        if (status) sp.set('status', status);
        sp.set('take', '20');
        return sp.toString();
    }, [q, status]);

    // Stable loader; pass cursor explicitly to avoid stale closures
    const load = useCallback(
        async ({ reset = false, cursor = null } = {}) => {
            try {
                setLoading(true);
                const url =
                    `/api/opportunities/mine?${queryParams}` +
                    (reset || !cursor ? '' : `&cursor=${cursor}`);

                const res = await fetch(url, { credentials: 'include' });
                const json = await res.json();

                if (res.status === 401 || res.status === 403) {
                    toast.error(json?.message || 'Please log in again');
                    router.push('/login');
                    return;
                }
                if (!res.ok) {
                    toast.error(json?.message || 'Failed to load');
                    return;
                }

                if (reset) {
                    setItems(json.items);
                } else {
                    setItems((prev) => [...prev, ...json.items]);
                }
                setNextCursor(json.nextCursor);
            } catch (e) {
                console.error(e);
                toast.error('Failed to load opportunities');
            } finally {
                setLoading(false);
            }
        },
        [queryParams, router]
    );

    // Load when filters change
    useEffect(() => {
        load({ reset: true });
    }, [load]);

    const onApplyFilters = () => load({ reset: true });
    const onLoadMore = () => nextCursor && load({ cursor: nextCursor });


    async function onDelete(id) {
        if (!confirm('Delete this opportunity? This cannot be undone.')) return;
        try {
            const res = await fetch(`/api/opportunities/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                toast.error(json?.message || 'Delete failed');
                return;
            }
            setItems((prev) => prev.filter((i) => i.id !== id));
            toast.success('Deleted');
        } catch (e) {
            console.error(e);
            toast.error('Delete failed');
        }
    }

    async function togglePublish(item) {
        const next = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
        try {
            const res = await fetch(`/api/opportunities/${item.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: next }),
            });
            const json = await res.json();
            if (!res.ok) {
                toast.error(json?.message || 'Update failed');
                return;
            }
            setItems((prev) =>
                prev.map((i) => (i.id === item.id ? { ...i, status: json.opportunity.status } : i))
            );
            toast.success(next === 'PUBLISHED' ? 'Published' : 'Unpublished');
        } catch (e) {
            console.error(e);
            toast.error('Update failed');
        }
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
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                My Opportunities
                            </h1>
                        </div>
                        <motion.p variants={fadeDown} className="text-base sm:text-lg text-violet-100/90 max-w-2xl mb-3">
                            Create, manage, and optimize your placement opportunities to attract advertisers.
                        </motion.p>
                        <motion.div variants={fadeDown} className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-violet-100/80">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                <span className="text-sm">Active Listings</span>
                            </div>
                            <div className="flex items-center gap-2 text-violet-100/80">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span className="text-sm">Revenue Ready</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Enhanced Filters */}
            <motion.div className="px-4 sm:px-8 mt-6" style={{ marginLeft: 'var(--publisher-sidebar-width, 80px)' }} variants={cardIn} initial="hidden" animate="visible">
                <ToastContainer position="top-right" />
                <div className="max-w-[90rem] mx-auto rounded-3xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-6 sm:p-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                            <Filter className="w-4 h-4 text-violet-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Filter Opportunities</h2>
                    </div>
                    <div className="flex flex-wrap items-end gap-4">
                        {/* Enhanced Search */}
                        <div className="flex-1 min-w-[220px]">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Opportunities</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Search by title, summary, description…"
                                    className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Enhanced Status Filter */}
                        <div className="w-48">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                            >
                                {['ALL', 'DRAFT', 'PUBLISHED', 'PAUSED', 'ARCHIVED'].map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Enhanced Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onApplyFilters}
                                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-white hover:from-violet-700 hover:to-indigo-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={() => router.push('/publisher/opportunities/new')}
                                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-white hover:from-emerald-700 hover:to-teal-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create New
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Enhanced Results List */}
            <motion.div className="px-4 sm:px-8 mt-6 pb-12" style={{ marginLeft: 'var(--publisher-sidebar-width, 80px)' }} variants={cardIn} initial="hidden" animate="visible">
                <div className="max-w-[90rem] mx-auto">
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-violet-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Your Opportunities</h2>
                                <p className="text-sm text-gray-600">{items.length} opportunities found</p>
                            </div>
                        </div>
                        
                        {items.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                <span>All opportunities are managed and optimized</span>
                            </div>
                        )}
                    </div>

                    {items.length === 0 && !loading ? (
                        <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12 text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No opportunities yet</h3>
                            <p className="text-gray-600 mb-4">Create your first opportunity to start attracting advertisers.</p>
                            <button
                                onClick={() => router.push('/publisher/opportunities/new')}
                                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2 text-white hover:from-emerald-700 hover:to-teal-700 font-medium transition-all duration-200 flex items-center gap-2 mx-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Create Your First Opportunity
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
                            {/* Enhanced table header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-white">
                                <div className="col-span-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-violet-600" />
                                    Title & Details
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-blue-600" />
                                    Placement
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-emerald-600" />
                                    Pricing
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-amber-600" />
                                    Status
                                </div>
                                <div className="col-span-2 text-right flex items-center gap-2">
                                    <Edit className="w-4 h-4 text-gray-600" />
                                    Actions
                                </div>
                            </div>

                            <ul className="divide-y divide-gray-100">
                                {items.map((item, index) => (
                                    <motion.li
                                        key={item.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-indigo-50/50 transition-all duration-200"
                                    >
                                        <div className="md:col-span-4">
                                            <div className="font-semibold text-gray-900 line-clamp-1 mb-1">{item.title || 'Untitled Opportunity'}</div>
                                            <div className="text-sm text-gray-500 mb-2">/{item.slug || 'no-slug'}</div>
                                            <div className="text-sm text-gray-700 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                                                {item.summary ? (
                                                    item.summary
                                                ) : (
                                                    <span className="text-gray-400 italic">No summary provided</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="text-sm font-medium text-gray-900">{item.placementType?.replace(/_/g, ' ')}</div>
                                            <div className="text-xs text-gray-500">Placement Type</div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="text-sm font-medium text-gray-900">{item.pricingType}</div>
                                            {item.basePrice && (
                                                <div className="text-xs text-emerald-600 font-medium">
                                                    {item.currency} {String(item.basePrice)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <StatusBadge status={item.status} />
                                            {item.status === 'PUBLISHED' && (
                                                <div className="text-xs text-emerald-600 mt-1 font-medium">Live</div>
                                            )}
                                        </div>
                                        <div className="md:col-span-2 flex md:justify-end gap-2">
                                            <button
                                                onClick={() => router.push(`/publisher/opportunities/${item.id}/edit`)}
                                                className="rounded-lg border border-violet-300 px-3 py-2 text-sm hover:bg-violet-50 text-violet-700 font-medium transition-colors flex items-center gap-1"
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => togglePublish(item)}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 text-gray-700 font-medium transition-colors flex items-center gap-1"
                                            >
                                                {item.status === 'PUBLISHED' ? (
                                                    <>
                                                        <EyeOff className="h-3.5 w-3.5" />
                                                        Unpublish
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="h-3.5 w-3.5" />
                                                        Publish
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => onDelete(item.id)}
                                                className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Delete
                                            </button>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* Enhanced Load more */}
                            {nextCursor && (
                                <div className="p-4 flex justify-center bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                                    <button
                                        onClick={onLoadMore}
                                        disabled={loading}
                                        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-white hover:from-violet-700 hover:to-indigo-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Loading more opportunities...
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="w-4 h-4" />
                                                Load More Opportunities
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>

        </div>
    );
}
