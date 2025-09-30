'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Building, 
    Lock, 
    Camera, 
    Save, 
    CheckCircle,
    Sparkles,
    TrendingUp,
    Zap
} from 'lucide-react';

// Animation variants
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

const itemVariants = {
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

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const modalVariants = {
    hidden: { 
        opacity: 0, 
        scale: 0.8,
        y: 50
    },
    visible: { 
        opacity: 1, 
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 300
        }
    },
    exit: { 
        opacity: 0, 
        scale: 0.8,
        y: 50,
        transition: { duration: 0.2 }
    }
};

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { duration: 0.3 }
    },
    exit: { 
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

const heroStagger = {
    hidden: {},
    visible: { transition: { delayChildren: 0.08, staggerChildren: 0.06 } },
};

const fadeDown = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

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

// Password Change Modal Component
const PasswordChangeModal = ({ isOpen, onClose, userId, onPasswordChanged }) => {
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/user/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    oldPassword: passwords.oldPassword,
                    newPassword: passwords.newPassword
                }),
            });

            const json = await res.json();

            if (res.ok) {
                toast.success('Password updated successfully! Please login again.');
                localStorage.removeItem('user');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                toast.error(json.message || 'Failed to update password');
            }
        } catch (error) {
            toast.error('An error occurred while updating password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <motion.div 
                        className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-violet-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                                <p className="text-sm text-gray-600">Update your account password</p>
                            </div>
                        </div>
                        
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.oldPassword}
                                    onChange={(e) => setPasswords(prev => ({ ...prev, oldPassword: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 font-semibold shadow-md hover:shadow-lg flex items-center gap-2 justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            Update Password
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        phoneNumber: '',
        country: '',
        state: '',
        city: '',
        address: '',
        postalCode: '',
    });

   useEffect(() => {
        const fetchUser = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser) return;

            try {
                const res = await fetch(`/api/user/${storedUser.id}`);
                if (!res.ok) throw new Error('Failed to fetch user');

                const json = await res.json();
                setUser(json.data);
                setFormData({
                    phoneNumber: json.data.phoneNumber || '',
                    country: json.data.country || '',
                    state: json.data.state || '',
                    city: json.data.city || '',
                    address: json.data.address || '',
                    postalCode: json.data.postalCode || '',
                });
            } catch (err) {
                console.error('Error loading user:', err);
                toast.error('Failed to load profile data');
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

     const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        if (file.size > 200 * 1024) {
            const fileSizeKB = Math.round(file.size / 1024);
            toast.error(`File size is ${fileSizeKB}KB. Please select an image smaller than 200KB.`);
            return;
        }

        const form = new FormData();
        form.append('file', file);

        toast.info('Uploading image...');

        try {
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: form,
            });

            const uploadJson = await uploadRes.json();

            if (!uploadRes.ok || !uploadJson.url) {
                toast.error(uploadJson.error || 'Image upload failed');
                return;
            }

            const uploadedImageUrl = uploadJson.url;
            const storedUser = JSON.parse(localStorage.getItem('user'));

            const updateRes = await fetch(`/api/user/${storedUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: uploadedImageUrl }),
            });

            const updateJson = await updateRes.json();

            if (updateRes.ok) {
                toast.success('Profile image updated!');
                const updatedUser = { ...storedUser, image: uploadedImageUrl };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setPreview(uploadedImageUrl);
            } else {
                toast.error(updateJson.message || 'Failed to update image');
            }
        } catch (error) {
            toast.error('An error occurred while uploading image');
        }
    };

        const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updateRes = await fetch(`/api/user/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const json = await updateRes.json();

            if (updateRes.ok) {
                toast.success(json.message || 'Profile updated successfully!');
                setUser(prev => ({ ...prev, ...formData }));
            } else {
                toast.error(json.message || 'Update failed');
            }
        } catch (error) {
            toast.error('An error occurred while updating profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-white text-black">
                <Sidebar />
                <div className="ml-16 sm:ml-20 p-4 sm:p-8 flex items-center justify-center">
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div 
                            className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.p 
                            className="mt-4 text-gray-600"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Loading profile...
                        </motion.p>
                    </motion.div>
                </div>
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
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                Profile Management
                            </h1>
                        </div>
                        <motion.p variants={fadeDown} className="text-base sm:text-lg text-violet-100/90 max-w-2xl mb-3">
                            Manage your account information, preferences, and security settings.
                        </motion.p>
                        <motion.div variants={fadeDown} className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-violet-100/80">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                <span className="text-sm">Account Secure</span>
                            </div>
                            <div className="flex items-center gap-2 text-violet-100/80">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span className="text-sm">Profile Complete</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            <motion.div 
                className="px-4 sm:px-8 mt-6 pb-12" style={{ marginLeft: 'var(--publisher-sidebar-width, 80px)' }}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <ToastContainer position="top-right" />

                <div className="max-w-[90rem] mx-auto">
                    {/* Profile Overview Card */}
                    <motion.div 
                        className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-lg mb-6"
                        variants={cardVariants}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                            <div className="flex flex-col sm:flex-row items-start gap-6">
                            <div className="relative mx-auto sm:mx-0">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Image
                                        src={preview || user.image || '/avatar.jpg'}
                                        alt="Profile"
                                        width={120}
                                        height={120}
                                        className="rounded-full border-4 border-violet-100 object-cover w-24 h-24 sm:w-30 sm:h-30"
                                    />
                                </motion.div>
                                <motion.label 
                                    className="absolute bottom-0 right-0 bg-violet-600 text-white p-2 rounded-full cursor-pointer hover:bg-violet-700 transition-colors"
                                    whileHover={{ scale: 1.1, rotate: 15 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Camera className="w-4 h-4" />
                                    <input 
                                        type="file" 
                                        hidden 
                                        accept="image/*"
                                        onChange={handleImageChange} 
                                    />
                                </motion.label>
                            </div>
                            
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                    {user.firstName} {user.lastName}
                                </h3>
                                
                                {/* Website URL */}
                                {user.website && (
                                    <div className="mb-2">
                                        <a 
                                            href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-sm font-medium hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            {user.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                                
                                <p className="text-gray-600 mb-2 break-all">
                                    {user.email}
                                </p>
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-800">
                                    {user.role || 'Publisher'}
                                </div>
                            </div>
                            </div>
                            
                            <motion.button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2 self-start"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Lock className="w-4 h-4" />
                                Change Password
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Account Information (Read-only) */}
                    <motion.div 
                        className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-lg mb-6"
                        variants={cardVariants}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
                                <p className="text-sm text-gray-600">Your core account details</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={user.firstName || ''}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={user.lastName || ''}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={user.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-3">
                            These fields cannot be modified. Contact support if you need to change this information.
                        </p>
                    </motion.div>

                    {/* Editable Contact Information */}
                    <motion.div 
                        className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-lg"
                        variants={cardVariants}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                                <p className="text-sm text-gray-600">Update your contact details</p>
                            </div>
                        </div>
                        
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {[
                                    { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Enter phone number', type: 'tel', icon: Phone },
                                    { name: 'country', label: 'Country', placeholder: 'Enter country', type: 'text', icon: Building },
                                    { name: 'state', label: 'State/Province', placeholder: 'Enter state or province', type: 'text', icon: MapPin },
                                    { name: 'city', label: 'City', placeholder: 'Enter city', type: 'text', icon: MapPin },
                                    { name: 'address', label: 'Address', placeholder: 'Enter street address', type: 'text', colSpan: true, icon: MapPin },
                                    { name: 'postalCode', label: 'Postal Code', placeholder: 'Enter postal code', type: 'text', icon: MapPin }
                                ].map((field, index) => (
                                    <div
                                        key={field.name}
                                        className={field.colSpan ? 'lg:col-span-2' : ''}
                                    >
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                                            placeholder={field.placeholder}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end pt-4">
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                                    whileHover={{ scale: loading ? 1 : 1.05 }}
                                    whileTap={{ scale: loading ? 1 : 0.95 }}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </motion.div>

            {/* Password Change Modal */}
            <PasswordChangeModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                userId={user.id}
                onPasswordChanged={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
}