'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

/* --- motion presets (form only) --- */
const formStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const fieldUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
        opacity: 1, 
        transition: { 
            duration: 0.8,
            staggerChildren: 0.1
        } 
    }
};

export default function AdminLogin() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        // Hardcoded admin credentials
        if (form.email === 'admin@gmail.com' && form.password === '786@786') {
            // Store admin session
            localStorage.setItem('adminToken', 'admin_authenticated');
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('userEmail', 'admin@gmail.com');
            
            toast.success('Welcome, Admin!');
            router.push('/admin/dashboard');
        } else {
            setErrorMsg('Invalid admin credentials');
        }
        
        setLoading(false);
    };

    return (
        <div className="h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
            {/* Left Side - Hero Section */}
            <motion.div 
                className="w-full lg:w-1/2 relative overflow-hidden"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600"></div>
                
                {/* Floating Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center h-full p-6 lg:p-8 text-center text-white">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-6"
                    >
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                            <Shield className="w-12 h-12 text-white" />
                        </div>
                    </motion.div>

                    <motion.h1 
                        className="text-2xl lg:text-3xl font-bold mb-3 drop-shadow-lg"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Admin Portal
                    </motion.h1>
                    
                    <motion.p 
                        className="text-base lg:text-lg mb-6 text-orange-100 max-w-md"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        Secure access to admin dashboard and management tools
                    </motion.p>

                    {/* Security Notice */}
                    <motion.div 
                        className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <div className="flex items-center justify-center gap-2 text-orange-100 text-sm">
                            <Shield className="w-4 h-4" />
                            Authorized personnel only
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                    >
                        <Image
                            src="/imgs/login.png"
                            alt="Admin Illustration"
                            width={240}
                            height={240}
                            className="max-w-full h-auto drop-shadow-lg"
                        />
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div 
                className="w-full lg:w-1/2 flex justify-center items-center p-4 lg:p-6 h-full"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <motion.div 
                    className="w-full max-w-md"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div 
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 lg:p-8 border border-white/20"
                        variants={fieldUp}
                    >
                        <motion.div className="text-center mb-6" variants={fieldUp}>
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Admin Sign In</h2>
                            <p className="text-gray-600 text-sm">Enter your admin credentials to access the dashboard</p>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {errorMsg && (
                                <motion.div
                                    key={errorMsg}
                                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                                        {errorMsg}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.form className="space-y-4" onSubmit={handleSubmit} variants={formStagger}>
                            <motion.div variants={fieldUp}>
                                <label className="block mb-2 font-semibold text-gray-700">Admin Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="admin@gmail.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={fieldUp}>
                                <label className="block mb-2 font-semibold text-gray-700">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter admin password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        tabIndex={-1}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </motion.div>

                            <motion.button
                                type="submit"
                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                                disabled={loading}
                                variants={fieldUp}
                                whileHover={!loading ? { scale: 1.02 } : {}}
                                whileTap={!loading ? { scale: 0.98 } : {}}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Access Admin Dashboard
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </motion.button>
                        </motion.form>

                        <motion.div 
                            className="mt-6 text-center"
                            variants={fieldUp}
                        >
                            <p className="text-gray-600 text-sm">
                                Regular user?{' '}
                                <a href="/login" className="text-red-600 hover:text-red-700 font-semibold transition-colors">
                                    Sign in here
                                </a>
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
