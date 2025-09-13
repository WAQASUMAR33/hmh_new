'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, DollarSign, X, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

const PaymentModal = ({ isOpen, onClose, booking, onPaymentSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    const handlePayment = async () => {
        setLoading(true);
        try {
            // Create payment intent
            const response = await fetch(`/api/bookings/${booking.id}/pay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    bookingId: booking.id,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // In a real implementation, you would use Stripe Elements here
                // For now, we'll simulate a successful payment
                toast.success('Payment processed successfully!');
                onPaymentSuccess?.(data.booking);
                onClose();
            } else {
                toast.error(data.message || 'Failed to process payment');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Failed to process payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md"
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Complete Payment
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Secure payment via Stripe
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Payment Details */}
                        <div className="p-6 space-y-6">
                            {/* Booking Summary */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Booking:</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {booking?.opportunity?.title}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Amount:</span>
                                    <span className="text-lg font-bold text-gray-900">
                                        {booking?.currency} {booking?.selectedPrice}
                                    </span>
                                </div>
                                {booking?.platformFee && (
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Platform fee:</span>
                                        <span>{booking.currency} {booking.platformFee}</span>
                                    </div>
                                )}
                            </div>

                            {/* Payment Method Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Payment Method
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <CreditCard className="w-5 h-5 text-gray-600" />
                                        <span className="text-sm font-medium">Credit/Debit Card</span>
                                    </label>
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <div className="font-medium mb-1">Secure Payment</div>
                                    <div>Your payment information is encrypted and secure. We use Stripe for all transactions.</div>
                                </div>
                            </div>

                            {/* Payment Button */}
                            <motion.button
                                onClick={handlePayment}
                                disabled={loading}
                                className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <DollarSign className="w-4 h-4" />
                                        Pay {booking?.currency} {booking?.selectedPrice}
                                    </>
                                )}
                            </motion.button>

                            {/* Terms */}
                            <p className="text-xs text-gray-500 text-center">
                                By completing this payment, you agree to our terms of service and privacy policy.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PaymentModal;
