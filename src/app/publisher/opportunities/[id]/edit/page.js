'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '../../../components/sidebar';
import Header from '../../../components/header';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, Globe2, Tag as TagIcon, DollarSign } from 'lucide-react';

/* ---------------- Animations ---------------- */
const heroStagger = { hidden: {}, visible: { transition: { delayChildren: 0.08, staggerChildren: 0.06 } } };
const fadeDown = { hidden: { opacity: 0, y: -14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } };
const cardIn = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

/* ---------------- Helpers ---------------- */
const slugify = (str) =>
    str?.toString().trim().toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-') || '';

function toLocalInput(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const off = d.getTimezoneOffset();
    const local = new Date(d.getTime() - off * 60000);
    return local.toISOString().slice(0, 19);
}
function toRFC3339FromLocal(local) {
    return local ? new Date(local).toISOString() : undefined;
}

function Pill({ children }) {
    return (
        <span className="inline-flex items-center rounded-full border border-gray-200 bg-white/70 px-2.5 py-1 text-xs text-gray-700">
            {children}
        </span>
    );
}
function AccentPill({ children }) {
    return (
        <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1.5 text-xs text-white">
            {children}
        </span>
    );
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
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
                    placeholder={placeholder}
                    className="flex-1 rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <button type="button" onClick={addTag} className="rounded-xl bg-violet-600 px-4 py-2 text-white hover:bg-violet-700">
                    Add
                </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
                {value.map((t, i) => (
                    <span key={t + i} className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-xs text-violet-800">
                        {t}
                        <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} className="ml-1 text-violet-700 hover:text-violet-900">×</button>
                    </span>
                ))}
            </div>
        </div>
    );
}

/* Glow orbs behind hero band */
function GlowOrbs() {
    return (
        <>
            <motion.span
                className="pointer-events-none absolute -top-10 -left-8 h-48 w-48 rounded-full bg-violet-400/40 blur-3xl"
                initial={{ y: 0 }}
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.span
                className="pointer-events-none absolute -bottom-12 right-10 h-56 w-56 rounded-full bg-indigo-400/40 blur-3xl"
                initial={{ y: 0 }}
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.span
                className="pointer-events-none absolute top-6 right-1/3 h-40 w-40 rounded-full bg-blue-400/30 blur-3xl"
                initial={{ y: 0 }}
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
        </>
    );
}

export default function EditOpportunityPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    // Form state
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [slugTouched, setSlugTouched] = useState(true);
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
    const [status, setStatus] = useState('DRAFT');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);

    // auto-slug only if user hasn’t touched slug
    useEffect(() => {
        if (!slugTouched) setSlug(slugify(title));
    }, [title, slugTouched]);

    const canSubmit = useMemo(() => title && slug && placementType && pricingType, [title, slug, placementType, pricingType]);

    // memoize and use as dependency
    const handleAuthRedirect = useCallback((res, json) => {
        if (res.status === 401 || res.status === 403) {
            toast.error(json?.message || 'Please log in again.');
            router.push('/login');
            return true;
        }
        return false;
    }, [router]);

    // Load existing opportunity
    useEffect(() => {
        (async () => {
            try {
                if (!id) return;
                setLoading(true);
                const res = await fetch(`/api/opportunities/${id}`, { credentials: 'include' });
                const json = await res.json();
                if (handleAuthRedirect(res, json)) return;
                if (!res.ok) {
                    toast.error(json?.message || 'Failed to load opportunity');
                    return;
                }
                const o = json.opportunity || {};
                setTitle(o.title || '');
                setSlug(o.slug || '');
                setSummary(o.summary || '');
                setDescription(o.description || '');
                setPlacementType(o.placementType || 'SPONSORED_ARTICLE');
                setPricingType(o.pricingType || 'FIXED');
                setBasePrice(o.basePrice ?? '');
                setCurrency(o.currency || 'USD');
                setVerticals(o.verticals || []);
                setGeos(o.geos || []);
                setRequirements(o.requirements || '');
                setDeliverables(o.deliverables || '');
                setMonthlyTraffic(o.monthlyTraffic ?? '');
                setAvailableFrom(toLocalInput(o.availableFrom));
                setAvailableTo(toLocalInput(o.availableTo));
                setStatus(o.status || 'DRAFT');
                setSlugTouched(true);
            } catch (e) {
                console.error(e);
                toast.error('Failed to load opportunity');
            } finally {
                setLoading(false);
            }
        })();
    }, [id, handleAuthRedirect]);

    async function saveChanges(e) {
        if (e) e.preventDefault();
        if (!canSubmit) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/opportunities/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title, slug,
                    summary: summary || null,
                    description: description || null,
                    placementType, pricingType,
                    basePrice: basePrice !== '' ? String(basePrice) : null,
                    currency,
                    verticals, geos,
                    requirements: requirements || null,
                    deliverables: deliverables || null,
                    monthlyTraffic: monthlyTraffic !== '' ? Number(monthlyTraffic) : null,
                    availableFrom: toRFC3339FromLocal(availableFrom) ?? null,
                    availableTo: toRFC3339FromLocal(availableTo) ?? null,
                }),
            });
            const json = await res.json();
            if (handleAuthRedirect(res, json)) return;
            if (!res.ok) {
                if (res.status === 409) toast.error(json.message || 'Slug already in use');
                else toast.error(json.message || 'Failed to save');
                return;
            }
            toast.success('Saved changes');
            setTimeout(() => router.push('/publisher/opportunities'), 650);
        } catch (e) {
            console.error(e);
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    }

    async function togglePublish() {
        const next = status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
        setPublishing(true);
        try {
            const res = await fetch(`/api/opportunities/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: next }),
            });
            const json = await res.json();
            if (handleAuthRedirect(res, json)) return;
            if (!res.ok) {
                toast.error(json?.message || 'Failed to update status');
                return;
            }
            setStatus(next);
            toast.success(next === 'PUBLISHED' ? 'Published' : 'Unpublished');
        } catch (e) {
            console.error(e);
            toast.error('Failed to update status');
        } finally {
            setPublishing(false);
        }
    }

    async function onDelete() {
        if (!confirm('Delete this opportunity? This cannot be undone.')) return;
        try {
            const res = await fetch(`/api/opportunities/${id}`, { method: 'DELETE', credentials: 'include' });
            const json = await res.json().catch(() => ({}));
            if (handleAuthRedirect(res, json)) return;
            if (!res.ok) {
                toast.error(json?.message || 'Delete failed');
                return;
            }
            toast.success('Deleted');
            router.push('/publisher/opportunities');
        } catch (e) {
            console.error(e);
            toast.error('Delete failed');
        }
    }

    /* ---------- UI ---------- */
    function GlowHero() {
        return (
            <motion.section
                variants={heroStagger}
                initial="hidden"
                animate="visible"
                className="relative ml-16 sm:ml-20 px-4 sm:px-8 pt-8 sm:pt-10"
            >
                <div className="max-w-8xl mx-auto relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white px-5 sm:px-8 py-7 shadow-sm">
                    <GlowOrbs />
                    <motion.h1 variants={fadeDown} className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {loading ? 'Loading…' : 'Edit Opportunity'}
                    </motion.h1>
                    <motion.p variants={fadeDown} className="mt-1 text-sm sm:text-base text-violet-100/90">
                        Update details, pricing, and availability. Publish when you’re ready.
                    </motion.p>
                    <motion.div variants={fadeDown} className="mt-5 inline-flex items-center gap-2">
                        <AccentPill>
                            <span className={`inline-block h-2 w-2 rounded-full mr-2 ${status === 'PUBLISHED' ? 'bg-emerald-300' : 'bg-amber-300'}`} />
                            Status: {status}
                        </AccentPill>
                    </motion.div>
                </div>
            </motion.section>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black">
            <Sidebar />

            {/* Sticky top header */}
            <div className="ml-20 sticky top-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <Header />
            </div>

            <GlowHero />

            {/* Form + Preview share SAME width as hero via max-w-6xl */}
            <motion.div className="ml-16 sm:ml-20 px-4 sm:px-8 pb-10" variants={cardIn} initial="hidden" animate="visible">
                <ToastContainer position="top-right" />

                <div className="max-w-8xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Opportunity Details</h2>
                        <form onSubmit={saveChanges} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Newsletter Feature – Top Fold"
                                        className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                    <input
                                        value={slug}
                                        onFocus={() => setSlugTouched(true)}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="newsletter-feature-top-fold"
                                        className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Placement Type</label>
                                    <select
                                        value={placementType}
                                        onChange={(e) => setPlacementType(e.target.value)}
                                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                    >
                                        {[
                                            'HOMEPAGE_BANNER', 'CATEGORY_BANNER', 'SPONSORED_ARTICLE', 'NEWSLETTER_FEATURE',
                                            'SOCIAL_POST', 'REVIEW', 'GIVEAWAY', 'PODCAST_READ', 'OTHER',
                                        ].map((pt) => <option key={pt} value={pt}>{pt.replace(/_/g, ' ')}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Type</label>
                                        <select
                                            value={pricingType}
                                            onChange={(e) => setPricingType(e.target.value)}
                                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                        >
                                            {['FIXED', 'CPM', 'CPC', 'CPA', 'HYBRID', 'FREE'].map((v) => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                                        <input
                                            type="number" min="0" step="0.01"
                                            value={basePrice}
                                            onChange={(e) => setBasePrice(e.target.value)}
                                            placeholder="e.g., 500"
                                            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                    >
                                        {['USD', 'GBP', 'EUR', 'AED', 'PKR'].map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Traffic (optional)</label>
                                    <input
                                        type="number" min="0"
                                        value={monthlyTraffic}
                                        onChange={(e) => setMonthlyTraffic(e.target.value)}
                                        placeholder="e.g., 120000"
                                        className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
                                        <input
                                            type="datetime-local" step="1"
                                            value={availableFrom}
                                            onChange={(e) => setAvailableFrom(e.target.value)}
                                            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Available To</label>
                                        <input
                                            type="datetime-local" step="1"
                                            value={availableTo}
                                            onChange={(e) => setAvailableTo(e.target.value)}
                                            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <TagInput label="Verticals (tags)" value={verticals} onChange={setVerticals} placeholder="Add vertical (Enter)" />
                            <TagInput label="Geos (audience regions)" value={geos} onChange={setGeos} placeholder="Add geo (Enter)" />

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

                            <div className="mt-2 flex flex-wrap items-center justify-end gap-3">
                                <button type="button" onClick={() => router.push('/publisher/opportunities')} className="rounded-xl border border-gray-300 px-5 py-2 hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button type="button" onClick={onDelete} className="rounded-xl bg-red-600 px-5 py-2 text-white hover:bg-red-700">
                                    Delete
                                </button>
                                <button type="submit" disabled={saving || !canSubmit} className="rounded-xl bg-violet-600 px-6 py-2 text-white hover:bg-violet-700 disabled:opacity-50">
                                    {saving ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Live Preview — same polished look as Create page */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm lg:sticky lg:top-24">
                        <div className="overflow-hidden rounded-xl ring-1 ring-violet-200/60 shadow-sm">
                            {/* Gradient header */}
                            <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-4 py-3 text-white">
                                <div className="flex items-center gap-2">
                                    <span className={`h-2.5 w-2.5 rounded-full ${status === 'PUBLISHED' ? 'bg-emerald-300' : 'bg-amber-300'}`} />
                                    <div className="text-sm opacity-90">Live Preview</div>
                                </div>
                                <div className="mt-0.5 text-lg font-semibold truncate">
                                    {title || 'Your Opportunity Title'}
                                </div>
                                <div className="mt-1 text-xs text-violet-100/90">/{slug || 'your-slug'}</div>
                            </div>

                            {/* Body */}
                            <div className="p-4 sm:p-5 bg-white/70 backdrop-blur">
                                {/* Badges row */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 border border-violet-200">
                                        {placementType.replace(/_/g, ' ')}
                                    </span>
                                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-200">
                                        {pricingType}
                                    </span>
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
                                        {basePrice ? `${currency} ${basePrice}` : 'No base price'}
                                    </span>
                                    {(verticals[0] || geos[0]) && (
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                                            {verticals[0] || '—'} · {geos[0] || '—'}
                                        </span>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="my-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                                {/* Description */}
                                <p className="text-sm leading-6 text-gray-700">
                                    {description || 'Your detailed description appears here.'}
                                </p>

                                {/* Meta grid */}
                                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                                        <div className="text-gray-500">Currency</div>
                                        <div className="font-medium text-gray-900">{currency}</div>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                                        <div className="text-gray-500">Traffic (mo.)</div>
                                        <div className="font-medium text-gray-900">
                                            {monthlyTraffic || '—'}
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                                        <div className="text-gray-500">Available From</div>
                                        <div className="font-medium text-gray-900">
                                            {availableFrom ? new Date(availableFrom).toLocaleString() : '—'}
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                                        <div className="text-gray-500">Available To</div>
                                        <div className="font-medium text-gray-900">
                                            {availableTo ? new Date(availableTo).toLocaleString() : '—'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                onClick={togglePublish}
                                disabled={publishing}
                                className="rounded-xl border border-gray-300 px-5 py-2 hover:bg-gray-50"
                            >
                                {publishing ? 'Updating…' : status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                                onClick={saveChanges}
                                disabled={saving || !canSubmit}
                                className="rounded-xl bg-violet-600 px-6 py-2 text-white hover:bg-violet-700 disabled:opacity-50"
                            >
                                {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
