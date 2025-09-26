'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
    AlertTriangle, 
    MessageSquare, 
    LogOut,
    Shield,
    Clock,
    FileText,
    Send
} from 'lucide-react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SuspendedAccount() {
    const [user, setUser] = useState(null);
    const [suspensionReason, setSuspensionReason] = useState('');
    const [appealMessage, setAppealMessage] = useState('');
    const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('userData');
        const userRole = localStorage.getItem('userRole');
        
        if (!userData || userRole !== 'publisher') {
            router.push('/login');
            return;
        }

        const userInfo = JSON.parse(userData);
        
        // Check if account is suspended (mock data - in real app, this would come from API)
        const mockSuspensionData = {
            isSuspended: true,
            suspensionReason: 'Violation of terms of service',
            suspensionDate: '2024-01-20',
            appealSubmitted: false
        };

        if (!mockSuspensionData.isSuspended) {
            router.push('/publisher/dashboard');
            return;
        }

        setUser(userInfo);
        setSuspensionReason(mockSuspensionData.suspensionReason);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userToken');
        toast.success('Logged out successfully');
        router.push('/login');
    };

    const handleSubmitAppeal = async () => {
        if (!appealMessage.trim()) {
            toast.error('Please provide a message for your appeal');
            return;
        }

        setIsSubmittingAppeal(true);

        try {
            // Mock API call to submit appeal
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            toast.success('Appeal submitted successfully. We will review your case and respond within 2-3 business days.');
            setAppealMessage('');
        } catch (error) {
            toast.error('Failed to submit appeal. Please try again.');
        } finally {
            setIsSubmittingAppeal(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
            <ToastContainer />
            
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-red-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">Account Suspended</h1>
                        </div>
                        
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-12 h-12 text-red-600" />
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Account Suspended
                    </h1>
                    
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Your account has been temporarily suspended. Please review the information below and submit an appeal if you believe this action was taken in error.
                    </p>
                </motion.div>

                {/* Suspension Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg border border-red-200 p-8 mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <FileText className="w-6 h-6 mr-3 text-red-600" />
                        Suspension Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder</label>
                                <p className="text-lg text-gray-900">{user.firstName} {user.lastName}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <p className="text-lg text-gray-900">{user.email}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Suspension Date</label>
                                <p className="text-lg text-gray-900">January 20, 2024</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Suspension</label>
                                <p className="text-lg text-red-600 font-medium">{suspensionReason}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                    Suspended
                                </span>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Appeal Status</label>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                    <Clock className="w-4 h-4 mr-1" />
                                    No Appeal Submitted
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Appeal Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <MessageSquare className="w-6 h-6 mr-3 text-blue-600" />
                        Submit an Appeal
                    </h2>
                    
                    <div className="mb-6">
                        <p className="text-gray-600 mb-4">
                            If you believe your account was suspended in error, you can submit an appeal. Please provide a detailed explanation of why you believe the suspension should be lifted.
                        </p>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="text-sm font-medium text-blue-900 mb-2">Appeal Guidelines:</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Be honest and provide accurate information</li>
                                <li>• Explain any circumstances that may have led to the violation</li>
                                <li>• Demonstrate understanding of the platform rules</li>
                                <li>• Show commitment to following guidelines in the future</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="appealMessage" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Appeal Message
                        </label>
                        <textarea
                            id="appealMessage"
                            value={appealMessage}
                            onChange={(e) => setAppealMessage(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Please explain why you believe your account suspension should be lifted..."
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            {appealMessage.length}/1000 characters
                        </p>
                    </div>
                    
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmitAppeal}
                            disabled={isSubmittingAppeal || !appealMessage.trim()}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {isSubmittingAppeal ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Submit Appeal
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-8 text-center"
                >
                    <p className="text-gray-600">
                        Need immediate assistance? Contact our support team at{' '}
                        <a href="mailto:support@hmh.com" className="text-blue-600 hover:text-blue-700 underline">
                            support@hmh.com
                        </a>
                    </p>
                </motion.div>
            </main>
        </div>
    );
}

