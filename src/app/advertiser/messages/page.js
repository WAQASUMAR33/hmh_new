'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { motion } from 'framer-motion';
import { 
    MessageCircle, 
    Users, 
    Clock, 
    Send,
    Search
} from 'lucide-react';

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

const cardVariants = {
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

export default function AdvertiserMessages() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const response = await fetch('/api/messages/conversations', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setConversations(data.conversations || []);
            } else {
                console.error('Failed to fetch conversations');
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setMessages(data.messages || []);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleConversationClick = (conversation) => {
        setSelectedConversation(conversation);
        fetchMessages(conversation.id);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        setSending(true);
        try {
            const recipientId = selectedConversation.publisher.id;
            const response = await fetch('/api/messages/conversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    recipientId: recipientId,
                    message: newMessage
                })
            });

            if (response.ok) {
                setNewMessage('');
                // Refresh messages
                fetchMessages(selectedConversation.id);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    const getOtherUser = (conversation) => {
        // For advertisers, the other user is the publisher
        return conversation.publisher;
    };

    if (loading) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading conversations...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                
                <motion.div 
                    className="flex-1 p-6 bg-gray-50 overflow-hidden"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="max-w-7xl mx-auto h-full">
                        {/* Header */}
                        <motion.div className="mb-6" variants={cardVariants}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <MessageCircle className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
                                    <p className="text-gray-600">Chat with publishers about collaboration opportunities</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="flex h-[calc(100vh-200px)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Conversations List */}
                            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search conversations..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto">
                                    {conversations.length === 0 ? (
                                        <div className="p-6 text-center text-gray-500">
                                            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                            <p>No conversations yet</p>
                                            <p className="text-sm">Start messaging publishers to begin conversations</p>
                                        </div>
                                    ) : (
                                        conversations.map((conversation) => {
                                            const otherUser = getOtherUser(conversation);
                                            const lastMessage = conversation.messages[0];
                                            
                                            return (
                                                <motion.div
                                                    key={conversation.id}
                                                    variants={cardVariants}
                                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                                        selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                                                    }`}
                                                    onClick={() => handleConversationClick(conversation)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {otherUser.firstName?.[0]}{otherUser.lastName?.[0]}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-gray-800 truncate">
                                                                {otherUser.firstName} {otherUser.lastName}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 truncate">
                                                                {otherUser.companyLegalName}
                                                            </p>
                                                            {lastMessage && (
                                                                <p className="text-xs text-gray-500 truncate mt-1">
                                                                    {lastMessage.content}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {lastMessage && formatDate(lastMessage.createdAt)}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 flex flex-col">
                                {selectedConversation ? (
                                    <>
                                        {/* Conversation Header */}
                                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {getOtherUser(selectedConversation).firstName?.[0]}{getOtherUser(selectedConversation).lastName?.[0]}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">
                                                        {getOtherUser(selectedConversation).firstName} {getOtherUser(selectedConversation).lastName}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {getOtherUser(selectedConversation).companyLegalName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Messages */}
                                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                            {messages.length === 0 ? (
                                                <div className="text-center text-gray-500 py-8">
                                                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                    <p>No messages yet</p>
                                                    <p className="text-sm">Start the conversation!</p>
                                                </div>
                                            ) : (
                                                messages.map((message) => (
                                                    <div
                                                        key={message.id}
                                                        className={`flex ${message.authorId === selectedConversation.advertiser.id ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                            message.authorId === selectedConversation.advertiser.id
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-200 text-gray-800'
                                                        }`}>
                                                            <p className="text-sm">{message.content}</p>
                                                            <p className={`text-xs mt-1 ${
                                                                message.authorId === selectedConversation.advertiser.id
                                                                    ? 'text-blue-100'
                                                                    : 'text-gray-500'
                                                            }`}>
                                                                {formatDate(message.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Message Input */}
                                        <div className="p-4 border-t border-gray-200">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                    placeholder="Type your message..."
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <button
                                                    onClick={handleSendMessage}
                                                    disabled={sending || !newMessage.trim()}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                                                >
                                                    {sending ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    ) : (
                                                        <Send className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-gray-500">
                                        <div className="text-center">
                                            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                            <p>Select a conversation to start messaging</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
