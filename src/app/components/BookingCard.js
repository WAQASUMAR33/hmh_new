'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, User, Clock, CheckCircle, XCircle, AlertCircle, FileText, MessageSquare, CreditCard, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import PaymentModal from './PaymentModal';

const BookingCard = ({ booking, userRole, onStatusUpdate, onOpenChat }) => {
    const [loading, setLoading] = useState(false);
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [deliveryData, setDeliveryData] = useState({
        deliveredFiles: [''],
        deliveredNotes: ''
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
            case 'PAID': return 'bg-green-100 text-green-800';
            case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
            case 'DELIVERED': return 'bg-orange-100 text-orange-800';
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            case 'DISPUTED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-4 h-4" />;
            case 'ACCEPTED': return <CheckCircle className="w-4 h-4" />;
            case 'PAID': return <DollarSign className="w-4 h-4" />;
            case 'IN_PROGRESS': return <Clock className="w-4 h-4" />;
            case 'DELIVERED': return <FileText className="w-4 h-4" />;
            case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
            case 'CANCELLED': return <XCircle className="w-4 h-4" />;
            case 'DISPUTED': return <AlertCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const handleStatusUpdate = async (action, additionalData = {}) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/bookings/${booking.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    action,
                    ...additionalData
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Booking ${action.toLowerCase()} successfully`);
                onStatusUpdate?.(data.booking);
                setShowDeliveryForm(false);
            } else {
                toast.error(data.message || `Failed to ${action.toLowerCase()} booking`);
            }
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error('Failed to update booking');
        } finally {
            setLoading(false);
        }
    };

    const handleDeliverySubmit = (e) => {
        e.preventDefault();
        const files = deliveryData.deliveredFiles.filter(file => file.trim());
        if (files.length === 0) {
            toast.error('Please provide at least one delivery file');
            return;
        }
        handleStatusUpdate('DELIVER', {
            deliveredFiles: files,
            deliveredNotes: deliveryData.deliveredNotes
        });
    };

    const addDeliveryFile = () => {
        setDeliveryData(prev => ({
            ...prev,
            deliveredFiles: [...prev.deliveredFiles, '']
        }));
    };

    const updateDeliveryFile = (index, value) => {
        setDeliveryData(prev => ({
            ...prev,
            deliveredFiles: prev.deliveredFiles.map((file, i) => i === index ? value : file)
        }));
    };

    const removeDeliveryFile = (index) => {
        setDeliveryData(prev => ({
            ...prev,
            deliveredFiles: prev.deliveredFiles.filter((_, i) => i !== index)
        }));
    };

    const canPerformAction = (action) => {
        if (userRole === 'ADMIN') return true;
        
        switch (action) {
            case 'ACCEPT':
            case 'REJECT':
            case 'DELIVER':
                return userRole === 'PUBLISHER';
            case 'PAY':
            case 'APPROVE':
            case 'DISPUTE':
                return userRole === 'ADVERTISER';
            default:
                return false;
        }
    };

    const renderActionButtons = () => {
        const buttons = [];

        if (booking.status === 'PENDING' && canPerformAction('ACCEPT')) {
            buttons.push(
                <motion.button
                    key="accept"
                    onClick={() => handleStatusUpdate('ACCEPT')}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <CheckCircle className="w-4 h-4" />
                    Accept Booking
                </motion.button>
            );
            buttons.push(
                <motion.button
                    key="reject"
                    onClick={() => handleStatusUpdate('REJECT')}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 disabled:opacity-50 font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <XCircle className="w-4 h-4" />
                    Reject Booking
                </motion.button>
            );
        }

        if (booking.status === 'ACCEPTED' && canPerformAction('PAY')) {
            buttons.push(
                <motion.button
                    key="pay"
                    onClick={() => setShowPaymentModal(true)}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <CreditCard className="w-4 h-4" />
                    Pay Now
                </motion.button>
            );
        }

        if (booking.status === 'PAID' && canPerformAction('DELIVER')) {
            buttons.push(
                <motion.button
                    key="deliver"
                    onClick={() => setShowDeliveryForm(true)}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <FileText className="w-4 h-4" />
                    Deliver Work
                </motion.button>
            );
        }

        if (booking.status === 'DELIVERED' && canPerformAction('APPROVE')) {
            buttons.push(
                <motion.button
                    key="approve"
                    onClick={() => handleStatusUpdate('APPROVE')}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <CheckCircle className="w-4 h-4" />
                    Approve Work
                </motion.button>
            );
            buttons.push(
                <motion.button
                    key="dispute"
                    onClick={() => handleStatusUpdate('DISPUTE', { disputeReason: 'Work not meeting requirements' })}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 disabled:opacity-50 font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <AlertTriangle className="w-4 h-4" />
                    Dispute Work
                </motion.button>
            );
        }

        return buttons;
    };

    return (
        <motion.div
            className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Status indicator ribbon */}
            <div className="absolute top-0 right-0 z-10">
                <div className={`px-4 py-2 rounded-bl-2xl text-white text-sm font-semibold shadow-lg ${
                    booking.status === 'PENDING' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                    booking.status === 'ACCEPTED' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                    booking.status === 'PAID' ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                    booking.status === 'DELIVERED' ? 'bg-gradient-to-r from-purple-500 to-violet-500' :
                    booking.status === 'COMPLETED' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    'bg-gradient-to-r from-red-500 to-pink-500'
                }`}>
                    <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        {booking.status.replace('_', ' ')}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="relative z-10 p-8">
                {/* Header section */}
                <div className="mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                                {booking.opportunity?.title || 'Untitled Booking'}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-violet-500" />
                                    <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    <span>ID: {booking.id.slice(-8)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                {booking.currency} {booking.selectedPrice}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Total Amount</div>
                        </div>
                    </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Dates */}
                    <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-5 h-5 text-violet-600" />
                            <span className="font-semibold text-gray-900">Requested Dates</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Start:</span>
                                <span className="font-medium">{new Date(booking.requestedStart).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">End:</span>
                                <span className="font-medium">{new Date(booking.requestedEnd).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <User className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-900">
                                {userRole === 'ADVERTISER' ? 'Publisher' : 'Advertiser'}
                            </span>
                        </div>
                        <div className="text-sm">
                            <div className="font-medium text-gray-900">
                                {userRole === 'ADVERTISER' 
                                    ? `${booking.publisher?.firstName} ${booking.publisher?.lastName}`
                                    : `${booking.advertiser?.firstName} ${booking.advertiser?.lastName}`
                                }
                            </div>
                            <div className="text-gray-600 mt-1">
                                {userRole === 'ADVERTISER' 
                                    ? booking.publisher?.email
                                    : booking.advertiser?.email
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes section */}
                {booking.notes && (
                    <div className="mb-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-5 h-5 text-amber-600" />
                            <span className="font-semibold text-gray-900">Notes</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{booking.notes}</p>
                    </div>
                )}

                {/* Payment status */}
                {booking.paymentStatus && (
                    <div className="mb-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                            <span className="font-semibold text-gray-900">Payment Status</span>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            booking.paymentStatus === 'PAID' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-amber-100 text-amber-700'
                        }`}>
                            <DollarSign className="w-4 h-4" />
                            {booking.paymentStatus}
                        </div>
                    </div>
                )}

                {/* Delivery Form */}
                {showDeliveryForm && (
                    <motion.div
                        className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <form onSubmit={handleDeliverySubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Delivery Files (URLs)
                                </label>
                                {deliveryData.deliveredFiles.map((file, index) => (
                                    <div key={index} className="flex gap-2 mb-3">
                                        <input
                                            type="url"
                                            value={file}
                                            onChange={(e) => updateDeliveryFile(index, e.target.value)}
                                            placeholder="https://example.com/file.pdf"
                                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeDeliveryFile(index)}
                                            className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addDeliveryFile}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    + Add another file
                                </button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Delivery Notes
                                </label>
                                <textarea
                                    value={deliveryData.deliveredNotes}
                                    onChange={(e) => setDeliveryData(prev => ({ ...prev, deliveredNotes: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    placeholder="Any notes about the delivered work..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 font-semibold transition-all duration-200"
                                >
                                    Submit Delivery
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDeliveryForm(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Delivered Work */}
                {booking.deliveredFiles && booking.deliveredFiles.length > 0 && (
                    <div className="mb-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-gray-900">Delivered Files</span>
                        </div>
                        <div className="space-y-2">
                            {booking.deliveredFiles.map((file, index) => (
                                <a
                                    key={index}
                                    href={file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    📎 {file}
                                </a>
                            ))}
                        </div>
                        {booking.deliveredNotes && (
                            <div className="mt-3 p-3 bg-white rounded-xl">
                                <div className="text-sm text-gray-700">
                                    <strong>Notes:</strong> {booking.deliveredNotes}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                    {renderActionButtons()}
                    <motion.button
                        onClick={() => onOpenChat?.(booking)}
                        className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-semibold flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Chat
                    </motion.button>
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                booking={booking}
                onPaymentSuccess={(updatedBooking) => {
                    onStatusUpdate?.(updatedBooking);
                    setShowPaymentModal(false);
                }}
            />
        </motion.div>
    );
};

export default BookingCard;
