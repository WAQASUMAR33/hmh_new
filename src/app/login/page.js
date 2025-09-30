'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function LoginPage() {
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

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.message || 'Login failed');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            const role = data.user?.role?.toLowerCase();
            if (role === 'admin') router.push('/admin');
            else if (role === 'publisher') router.push('/publisher');
            else if (role === 'advertiser') router.push('/advertiser');
            else setErrorMsg('Unknown user role');
        } catch (err) {
            console.error(err);
            setErrorMsg('Something went wrong');
        } finally {
            setLoading(false);
        }
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
                
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
                        <Image 
                            src="/imgs/logo.png" 
                            alt="HMH Logo" 
                            width={120} 
                            height={120} 
                            className="drop-shadow-lg"
                        />
                    </motion.div>

                    <motion.h1 
                        className="text-xl lg:text-2xl font-bold mb-3 drop-shadow-lg"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Welcome Back
                    </motion.h1>
                    
                    <motion.p 
                        className="text-base lg:text-lg mb-6 text-blue-100 max-w-md"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        Sign in to your HMH account and continue your journey
                    </motion.p>

                    {/* Social Login Buttons */}
                    <motion.div 
                        className="flex space-x-3 mb-6"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        {[
                            { src: '/imgs/google.webp', alt: 'Google', name: 'Google' },
                            { src: '/imgs/facebook.png', alt: 'Facebook', name: 'Facebook' },
                            { src: '/imgs/x.png', alt: 'X', name: 'X' },
                        ].map((social, index) => (
                            <motion.button 
                                key={social.alt} 
                                className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 border border-white/20"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                            >
                                <Image src={social.src} alt={social.alt} width={24} height={24} />
                            </motion.button>
                        ))}
                    </motion.div>

                    <motion.div
                        className="text-blue-200 text-sm mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                    >
                        Or continue with email
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.4 }}
                    >
                        <Image
                            src="/imgs/login.png"
                            alt="Illustration"
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
                            <h2 className="text-xl font-bold text-gray-800 mb-1">Sign In</h2>
                            <p className="text-gray-600 text-sm">Enter your credentials to access your account</p>
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
                                <label className="block mb-2 font-semibold text-gray-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
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
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
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

                            <motion.div
                                className="flex items-center justify-between text-sm"
                                variants={fieldUp}
                            >
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-gray-600">Remember me</span>
                                </label>
                                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                    Forgot password?
                                </a>
                            </motion.div>

                            <motion.button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
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
                                        Sign In
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
                                Don&apos;t have an account?{' '}
                                <a href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                                    Sign up now
                                </a>
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
