"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    {/* 404 Number */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                            404
                        </h1>
                        {/* Floating decorative elements */}
                        <motion.div
                            className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            animate={{ 
                                y: [0, -10, 0],
                                rotate: [0, 180, 360]
                            }}
                            transition={{ 
                                duration: 4, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                            }}
                        />
                        <motion.div
                            className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full"
                            animate={{ 
                                y: [0, 10, 0],
                                rotate: [0, -180, -360]
                            }}
                            transition={{ 
                                duration: 3, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                            }}
                        />
                    </motion.div>

                    {/* Error Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Oops! Page Not Found
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            The page you&apos;re looking for seems to have wandered off into the digital void. 
                            Don&apos;t worry, even the best explorers sometimes take a wrong turn!
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link
                            href="/"
                            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                            Go Home
                        </Link>
                        
                        <button
                            onClick={() => window.history.back()}
                            className="group inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                            Go Back
                        </button>
                    </motion.div>

                    {/* Search Suggestion */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-12"
                    >
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
                            <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
                                <Search className="w-5 h-5" />
                                <span className="font-medium">Looking for something specific?</span>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Try searching for what you need or explore our main sections:
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {[
                                    { name: "Home", href: "/" },
                                    { name: "For Brands", href: "/home#brands" },
                                    { name: "For Publishers", href: "/home#publishers" },
                                    { name: "Login", href: "/login" },
                                    { name: "Sign Up", href: "/signup" }
                                ].map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className="px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg transition-colors duration-200 text-sm font-medium"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Fun Illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="mt-12"
                    >
                        <div className="relative w-32 h-32 mx-auto">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.2, 0.3, 0.2]
                                }}
                                transition={{ 
                                    duration: 3, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                            />
                            <motion.div
                                className="absolute inset-4 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-30"
                                animate={{ 
                                    scale: [1, 0.8, 1],
                                    opacity: [0.3, 0.2, 0.3]
                                }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                            />
                            <motion.div
                                className="absolute inset-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-40"
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    opacity: [0.4, 0.5, 0.4]
                                }}
                                transition={{ 
                                    duration: 4, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                            />
                        </div>
                    </motion.div>

                    {/* Footer Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="text-sm text-gray-500"
                    >
                        <p>
                            If you believe this is an error, please{" "}
                            <Link href="/home#contact" className="text-blue-600 hover:text-blue-700 underline">
                                contact our support team
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
