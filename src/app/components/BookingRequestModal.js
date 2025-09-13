'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, DollarSign, MessageSquare, X, Clock, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

const BookingRequestModal = ({ isOpen, onClose, opportunity, onBookingCreated }) => {
    const [formData, setFormData] = useState({
        requestedStart: '',
        requestedEnd: '',
        selectedPrice: opportunity?.basePrice || '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    opportunityId: opportunity.id,
                    requestedStart: formData.requestedStart ? new Date(formData.requestedStart).toISOString() : '',
                    requestedEnd: formData.requestedEnd ? new Date(formData.requestedEnd).toISOString() : '',
                    selectedPrice: formData.selectedPrice,
                    currency: opportunity.currency || 'USD',
                    notes: formData.notes
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Booking request sent successfully!');
                onBookingCreated?.(data.booking);
                onClose();
                // Reset form
                setFormData({
                    requestedStart: '',
                    requestedEnd: '',
                    selectedPrice: opportunity?.basePrice || '',
                    notes: ''
                });
            } else {
                toast.error(data.message || 'Failed to create booking request');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            toast.error('Failed to create booking request');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const getMinDate = () => {
        const today = new Date();
        return formatDate(today);
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
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Request Booking
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {opportunity?.title}
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

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Opportunity Summary */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                    <span className="font-semibold text-gray-900">
                                        {opportunity?.currency || 'USD'} {opportunity?.basePrice}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        {opportunity?.availableFrom && opportunity?.availableTo ? (
                                            `Available: ${new Date(opportunity.availableFrom).toLocaleDateString()} - ${new Date(opportunity.availableTo).toLocaleDateString()}`
                                        ) : (
                                            'No availability restrictions'
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="requestedStart"
                                        value={formData.requestedStart}
                                        onChange={handleInputChange}
                                        min={getMinDate()}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="requestedEnd"
                                        value={formData.requestedEnd}
                                        onChange={handleInputChange}
                                        min={formData.requestedStart || getMinDate()}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price ({opportunity?.currency || 'USD'})
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        name="selectedPrice"
                                        value={formData.selectedPrice}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter price"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Any specific requirements or notes for this booking..."
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <motion.button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <MessageSquare className="w-4 h-4" />
                                            Send Request
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BookingRequestModal;
