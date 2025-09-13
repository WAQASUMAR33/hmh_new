'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, User, Building } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';

const ChatModal = ({ isOpen, onClose, opportunityId, offerId, bookingId, opportunityTitle, publisher }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            setUserLoading(true);
            try {
                const response = await fetch('/api/user/me');
                const data = await response.json();
                if (response.ok && data.user) {
                    setUser(data.user);
                } else {
                    // Fallback to localStorage if API fails
                    const storedUser = JSON.parse(localStorage.getItem('user'));
                    setUser(storedUser);
                }
            } catch (error) {
                console.error('Error fetching current user:', error);
                // Fallback to localStorage if API fails
                const storedUser = JSON.parse(localStorage.getItem('user'));
                setUser(storedUser);
            } finally {
                setUserLoading(false);
            }
        };
        
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (isOpen && (opportunityId || offerId || bookingId)) {
            fetchMessages();
        }
    }, [isOpen, opportunityId, offerId, bookingId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (opportunityId) params.append('opportunityId', opportunityId);
            if (offerId) params.append('offerId', offerId);
            if (bookingId) params.append('bookingId', bookingId);

            const response = await fetch(`/api/messages?${params}`);
            const data = await response.json();

            if (response.ok) {
                setMessages(data.data || []);
            } else {
                toast.error(data.error || 'Failed to load messages');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    opportunityId,
                    offerId,
                    bookingId,
                    body: newMessage.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [...prev, data.data]);
                setNewMessage('');
            } else {
                toast.error(data.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    const isOwnMessage = (message) => {
        // If user data is not loaded yet, assume it's not our message
        if (!user || !message.author) {
            return false;
        }
        
        const isOwn = message.author.id === user.id;
        
        // Debug logging (remove this after fixing)
        console.log('Message ownership:', {
            messageAuthorId: message.author.id,
            currentUserId: user.id,
            isOwn: isOwn,
            messageAuthorName: message.author.firstName,
            currentUserName: user.firstName
        });
        
        return isOwn;
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
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col"
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-violet-600" />
                                </div>
                                                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                {opportunityTitle}
                            </h3>
                            {publisher ? (
                                <div className="flex items-center gap-2 mt-1">
                                    <Image
                                        src={publisher.image || '/avatar.jpg'}
                                        alt={publisher.firstName}
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {publisher.firstName} {publisher.lastName}
                                        {publisher.companyLegalName && (
                                            <span className="text-xs bg-blue-100 px-2 py-0.5 rounded-full ml-1">
                                                {publisher.companyLegalName}
                                            </span>
                                        )}
                                        {publisher.brandName && (
                                            <span className="text-xs bg-green-100 px-2 py-0.5 rounded-full ml-1">
                                                {publisher.brandName}
                                            </span>
                                        )}
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full ml-1">
                                            {publisher.role}
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 mt-1">
                                    Publisher information not available
                                </p>
                            )}
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

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {loading || userLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <MessageSquare className="w-12 h-12 mb-4 text-gray-300" />
                                    <p className="text-center">No messages yet</p>
                                    <p className="text-sm text-center">Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((message, index) => {
                                    const showDate = index === 0 || 
                                        formatDate(message.createdAt) !== formatDate(messages[index - 1]?.createdAt);
                                    
                                    return (
                                        <div key={message.id}>
                                            {showDate && (
                                                <div className="flex justify-center mb-4">
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                        {formatDate(message.createdAt)}
                                                    </span>
                                                </div>
                                            )}
                                            <motion.div
                                                className={`flex gap-3 ${isOwnMessage(message) ? 'flex-row-reverse' : ''}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <div className="flex-shrink-0">
                                                    <Image
                                                        src={message.author.image || '/avatar.jpg'}
                                                        alt={message.author.firstName}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                                <div className={`flex-1 max-w-[70%] ${isOwnMessage(message) ? 'text-right' : ''}`}>
                                                    <div className={`inline-block p-3 rounded-2xl ${
                                                        isOwnMessage(message)
                                                            ? 'bg-violet-600 text-white'
                                                            : 'bg-gray-100 text-gray-900'
                                                    }`}>
                                                        <p className="text-sm">{message.body}</p>
                                                    </div>
                                                    <div className={`text-xs text-gray-500 mt-1 ${
                                                        isOwnMessage(message) ? 'text-right' : ''
                                                    }`}>
                                                        {formatTime(message.createdAt)}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    disabled={sending}
                                />
                                <motion.button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {sending ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <Send className="w-4 h-4" />
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

export default ChatModal;
