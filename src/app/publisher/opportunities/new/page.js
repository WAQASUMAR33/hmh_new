'use client';

// File: src/app/publisher/opportunities/new/page.js
// Single-form Create Opportunity, professional UI, sticky header, animated hero.

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/sidebar';
import Header from '../../components/header';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
    FileText, 
    Plus, 
    Eye, 
    DollarSign, 
    Tag, 
    Calendar, 
    Users, 
    Globe, 
    Target, 
    CheckCircle, 
    ArrowRight,
    Sparkles,
    TrendingUp,
    Zap
} from 'lucide-react';

/* ---------------- Enhanced Animations ---------------- */
const heroStagger = {
    hidden: {},
    visible: { transition: { delayChildren: 0.08, staggerChildren: 0.06 } },
};
const fadeDown = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const cardIn = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};
const staggerChildren = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const itemUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/* --------------------------------- Helpers --------------------------------- */
const slugify = (str) =>
    str
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

/** Convert <input type="datetime-local"> value to RFC3339 (UTC) string */
function toRFC3339FromLocal(local) {
    return local ? new Date(local).toISOString() : undefined;
}

function TagInput({ label, value, onChange, placeholder }) {
    const [input, setInput] = useState('');

    const addTag = () => {
        const v = input.trim();
        if (!v) return;
        if (!value.includes(v)) onChange([...value, v]);
        setInput('');
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            addTag();
                        }
                    }}
                    placeholder={placeholder}
                    className="flex-1 rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <button
                    type="button"
                    onClick={addTag}
                    className="rounded-xl bg-violet-600 px-3 py-2 text-white hover:bg-violet-700"
                >
                    Add
                </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
                {value.map((t, i) => (
                    <span
                        key={t + i}
                        className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-1 text-xs text-violet-800"
                    >
                        {t}
                        <button
                            type="button"
                            onClick={() => onChange(value.filter((x) => x !== t))}
                            className="ml-1 text-violet-700 hover:text-violet-900"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}

/* Enhanced Glow orbs behind hero band */
function GlowOrbs() {
    return (
        <>
            <motion.span
                className="pointer-events-none absolute -top-10 -left-8 h-48 w-48 rounded-full bg-violet-400/50 blur-3xl"
                initial={{ y: 0 }}
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.span
                className="pointer-events-none absolute -bottom-12 right-10 h-56 w-56 rounded-full bg-indigo-400/50 blur-3xl"
                initial={{ y: 0 }}
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.span
                className="pointer-events-none absolute top-6 right-1/3 h-40 w-40 rounded-full bg-blue-400/40 blur-3xl"
                initial={{ y: 0 }}
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.span
                className="pointer-events-none absolute top-1/2 left-1/4 h-32 w-32 rounded-full bg-purple-400/30 blur-2xl"
                initial={{ y: 0 }}
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
        </>
    );
}

export default function CreateOpportunityPage() {
    const router = useRouter();

    // Created opportunity (after POST)
    const [created, setCreated] = useState(null);

    // Form state
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [slugTouched, setSlugTouched] = useState(false);
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [placementType, setPlacementType] = useState('SPONSORED_ARTICLE');
    const [pricingType, setPricingType] = useState('FIXED');
    const [basePrice, setBasePrice] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [verticals, setVerticals] = useState([]);
    const [geos, setGeos] = useState([]);
    const [requirements, setRequirements] = useState('');
    const [deliverables, setDeliverables] = useState('');
    const [monthlyTraffic, setMonthlyTraffic] = useState('');
    const [availableFrom, setAvailableFrom] = useState('');
    const [availableTo, setAvailableTo] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [publishing, setPublishing] = useState(false);

    // auto-slug from title (unless user edited slug manually)
    useEffect(() => {
        if (!slugTouched) setSlug(slugify(title));
    }, [title, slugTouched]);

    const canSubmit = useMemo(
        () => title && slug && placementType && pricingType,
        [title, slug, placementType, pricingType]
    );

    // Handle auth failures in one place
    function handleAuthRedirect(res, json) {
        if (res.status === 401 || res.status === 403) {
            toast.error(json?.message || 'Please log in again.');
            router.push('/login');
            return true;
        }
        return false;
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (!canSubmit) return;
        setSubmitting(true);

        try {
            const res = await fetch('/api/opportunities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title,
                    slug,
                    summary: summary || undefined,
                    description: description || undefined,
                    placementType,
                    pricingType,
                    basePrice: basePrice ? String(basePrice) : undefined,
                    currency,
                    verticals,
                    geos,
                    requirements: requirements || undefined,
                    deliverables: deliverables || undefined,
                    monthlyTraffic: monthlyTraffic ? Number(monthlyTraffic) : undefined,
                    availableFrom: toRFC3339FromLocal(availableFrom),
                    availableTo: toRFC3339FromLocal(availableTo),
                }),
            });

            const json = await res.json();

            if (handleAuthRedirect(res, json)) return;

            if (!res.ok) {
                if (res.status === 409) toast.error(json.message || 'Slug already in use');
                else toast.error(json.message || 'Failed to create');
                return;
            }

            setCreated(json.opportunity);
            toast.success('Opportunity created!');
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    }

    async function handlePublish() {
        if (!created) return;
        setPublishing(true);
        try {
            const res = await fetch(`/api/opportunities/${created.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: 'PUBLISHED' }),
            });
            const json = await res.json();

            if (handleAuthRedirect(res, json)) return;

            if (!res.ok) return toast.error(json.message || 'Failed to publish');
            toast.success('Published!');
            setTimeout(() => router.push('/publisher'), 900);
        } catch (e) {
            console.error(e);
            toast.error('Something went wrong.');
        } finally {
            setPublishing(false);
        }
    }

    return (
        <div className="min-h-screen bg-white text-black">
            <Sidebar />

            {/* Sticky top header */}
            <div className="ml-20 sticky top-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <Header />
            </div>

            {/* Hero / welcome band with motion + glow */}
            <motion.section
                variants={heroStagger}
                initial="hidden"
                animate="visible"
                className="relative ml-16 sm:ml-20 px-4 sm:px-8 py-8 sm:py-10 overflow-hidden"
            >
                {/* ⬇️ Same max width wrapper we'll reuse below */}
                <div className="max-w-8xl mx-auto">
                    <div className="relative rounded-2xl border border-indigo-100 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white px-5 sm:px-8 py-7 shadow-sm">
                        <GlowOrbs />
                        <motion.h1 variants={fadeDown} className="text-2xl sm:text-3xl font-bold">
                            Create a New Opportunity
                        </motion.h1>
                        <motion.p variants={fadeDown} className="mt-1 text-sm sm:text-base text-violet-100/90">
                            List your placement so advertisers can discover, negotiate, and book with you.
                        </motion.p>
                        <motion.div
                            variants={fadeDown}
                            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs"
                        >
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-300" />
                            Ready to publish once you’re done.
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Form + Preview (shares SAME width as hero via max-w-6xl) */}
            <motion.div
                className="ml-16 sm:ml-20 px-4 sm:px-8 pb-10"
                variants={cardIn}
                initial="hidden"
                animate="visible"
            >
                <ToastContainer position="top-right" />

                <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Enhanced Form card */}
                    <div className="lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-violet-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Opportunity Details</h2>
                                <p className="text-sm text-gray-600">Fill in the details to create your opportunity</p>
                            </div>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Title
                                    </label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Newsletter Feature – Top Fold"
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Slug
                                    </label>
                                    <input
                                        value={slug}
                                        onFocus={() => setSlugTouched(true)}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="newsletter-feature-top-fold"
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Placement Type
                                    </label>
                                    <select
                                        value={placementType}
                                        onChange={(e) => setPlacementType(e.target.value)}
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
                                    >
                                        {[
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
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Pricing Type
                                        </label>
                                        <select
                                            value={pricingType}
                                            onChange={(e) => setPricingType(e.target.value)}
                                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
                                        >
                                            {['FIXED', 'CPM', 'CPC', 'CPA', 'HYBRID', 'FREE'].map((v) => (
                                                <option key={v} value={v}>
                                                    {v}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Base Price
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={basePrice}
                                            onChange={(e) => setBasePrice(e.target.value)}
                                            placeholder="e.g., 500"
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Currency
                                    </label>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:ring-2 focus:ring-violet-500 transition-colors"
                                    >
                                        {['USD', 'GBP', 'EUR', 'AED', 'PKR'].map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Monthly Traffic (optional)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={monthlyTraffic}
                                        onChange={(e) => setMonthlyTraffic(e.target.value)}
                                        placeholder="e.g., 120000"
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-violet-500 transition-colors"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Available From
                                        </label>
                                        <input
                                            type="datetime-local"
                                            step="1"
                                            value={availableFrom}
                                            onChange={(e) => setAvailableFrom(e.target.value)}
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-violet-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Available To
                                        </label>
                                        <input
                                            type="datetime-local"
                                            step="1"
                                            value={availableTo}
                                            onChange={(e) => setAvailableTo(e.target.value)}
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-violet-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <TagInput
                                label="Verticals (tags)"
                                value={verticals}
                                onChange={setVerticals}
                                placeholder="Add vertical (Enter)"
                            />
                            <TagInput
                                label="Geos (audience regions)"
                                value={geos}
                                onChange={setGeos}
                                placeholder="Add geo (Enter)"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                                    <input
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                        placeholder="Short teaser shown in lists"
                                        className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                                    <input
                                        value={requirements}
                                        onChange={(e) => setRequirements(e.target.value)}
                                        placeholder="e.g., product sample 2 weeks before"
                                        className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deliverables</label>
                                <input
                                    value={deliverables}
                                    onChange={(e) => setDeliverables(e.target.value)}
                                    placeholder="e.g., 1x newsletter tile + 1x IG post"
                                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    placeholder="Describe the placement, audience, and expectations"
                                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                />
                            </div>

                            <motion.div
                                className="flex justify-end pt-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <button
                                    type="submit"
                                    disabled={submitting || !canSubmit}
                                    className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3 text-white hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Creating Opportunity...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            Create Opportunity
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        </form>
                    </div>

                    {/* Enhanced Live Preview card */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-lg lg:sticky lg:top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Eye className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Live Preview</h3>
                                <p className="text-sm text-gray-600">See how your opportunity will appear</p>
                            </div>
                        </div>
                        
                        <div className="overflow-hidden rounded-2xl ring-1 ring-violet-200/60 shadow-lg">
                            {/* Enhanced Header bar with gradient */}
                            <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 px-6 py-4 text-white relative overflow-hidden">
                                {/* Subtle pattern overlay */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                    }} />
                                </div>
                                <div className="relative z-10">
                                    <div className="text-sm opacity-90 mb-1">Live Preview</div>
                                    <div className="text-lg font-bold truncate">
                                        {title || 'Your Opportunity Title'}
                                    </div>
                                    <div className="text-xs text-violet-100/90 mt-1">/{slug || 'your-slug'}</div>
                                </div>
                            </div>

                            {/* Enhanced Body */}
                            <div className="p-6 bg-white/80 backdrop-blur">
                                {/* Enhanced Badges row */}
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700 border border-violet-200">
                                        {placementType.replace(/_/g, ' ')}
                                    </span>
                                    <span className="rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
                                        {pricingType}
                                    </span>
                                    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                        {basePrice ? `${currency} ${basePrice}` : 'No base price'}
                                    </span>
                                    {(verticals[0] || geos[0]) && (
                                        <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200">
                                            {verticals[0] || '—'} · {geos[0] || '—'}
                                        </span>
                                    )}
                                </div>

                                {/* Enhanced Divider */}
                                <div className="my-4 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent" />

                                {/* Enhanced Description */}
                                <div className="mb-4">
                                    <p className="text-sm leading-6 text-gray-700 font-medium">
                                        {description || 'Your detailed description appears here.'}
                                    </p>
                                </div>

                                {/* Enhanced Meta grid */}
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white px-4 py-3">
                                        <div className="text-gray-500 font-medium">Currency</div>
                                        <div className="font-bold text-gray-900">{currency}</div>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white px-4 py-3">
                                        <div className="text-gray-500 font-medium">Traffic (mo.)</div>
                                        <div className="font-bold text-gray-900">
                                            {monthlyTraffic ? Number(monthlyTraffic).toLocaleString() : '—'}
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white px-4 py-3">
                                        <div className="text-gray-500 font-medium">Available From</div>
                                        <div className="font-bold text-gray-900">
                                            {availableFrom ? new Date(availableFrom).toLocaleDateString() : '—'}
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white px-4 py-3">
                                        <div className="text-gray-500 font-medium">Available To</div>
                                        <div className="font-bold text-gray-900">
                                            {availableTo ? new Date(availableTo).toLocaleDateString() : '—'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Publish actions */}
                        {created && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    <span className="text-sm font-semibold text-emerald-800">Opportunity Created Successfully!</span>
                                </div>
                                <p className="text-sm text-emerald-700 mb-4">Your opportunity is ready to be published and start attracting advertisers.</p>
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        onClick={() => router.push('/publisher')}
                                        className="rounded-xl border border-gray-300 px-5 py-2 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                                    >
                                        Back to Dashboard
                                    </button>
                                    <button
                                        onClick={handlePublish}
                                        disabled={publishing}
                                        className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2 text-white hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                                    >
                                        {publishing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Publishing...
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="w-4 h-4" />
                                                Publish Opportunity
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
