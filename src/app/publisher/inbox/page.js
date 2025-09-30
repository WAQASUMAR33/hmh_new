'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, User, Building, Clock, Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import ChatModal from '@/app/components/ChatModal';
import { toast } from 'react-toastify';

const fadeDown = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardIn = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerChildren = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const itemUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function PublisherInboxContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        fetchConversations();
    }, []);

    // Handle URL parameters for auto-opening chat
    useEffect(() => {
        const opportunityId = searchParams.get('opportunityId');
        const openChat = searchParams.get('openChat');
        
        if (opportunityId && openChat === 'true') {
            if (conversations.length > 0) {
                // Conversations are loaded, find and open the chat
                const conversation = conversations.find(conv => conv.opportunityId === opportunityId);
                if (conversation) {
                    setSelectedConversation(conversation);
                    setIsChatOpen(true);
                    // Clear URL parameters
                    router.replace('/publisher/inbox');
                } else {
                    // Conversation not found, fetch opportunity details for new chat
                    fetchOpportunityForNewChat(opportunityId);
                }
            }
            // If conversations are still loading, the effect will run again when they load
        }
    }, [conversations, searchParams, router]);

    const fetchOpportunityForNewChat = async (opportunityId) => {
        try {
            const response = await fetch(`/api/opportunities/${opportunityId}`);
            const data = await response.json();
            
            if (response.ok) {
                const opportunity = data.data;
                setSelectedConversation({
                    opportunityId: opportunityId,
                    opportunityTitle: opportunity.title,
                    participant: opportunity.publisher,
                    lastMessage: null,
                    messageCount: 0
                });
                setIsChatOpen(true);
                // Clear URL parameters
                router.replace('/publisher/inbox');
            } else {
                toast.error('Failed to load opportunity details');
            }
        } catch (error) {
            console.error('Error fetching opportunity:', error);
            toast.error('Failed to load opportunity details');
        }
    };

    const fetchConversations = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/conversations');
            const data = await response.json();

            if (response.ok) {
                setConversations(data.data || []);
            } else {
                toast.error(data.error || 'Failed to load conversations');
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
            toast.error('Failed to load conversations');
        } finally {
            setLoading(false);
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.opportunityTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (conv.participant && `${conv.participant.firstName} ${conv.participant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (conv.participant && conv.participant.companyLegalName && conv.participant.companyLegalName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (conv.participant && conv.participant.brandName && conv.participant.brandName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const openChat = (conversation) => {
        setSelectedConversation(conversation);
        setIsChatOpen(true);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else if (diffInHours < 168) {
            return `${Math.floor(diffInHours / 24)}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const truncateMessage = (message, maxLength = 50) => {
        if (!message || typeof message !== 'string') return '';
        if (message.length <= maxLength) return message;
        return message.substring(0, maxLength) + '...';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Sidebar />
            
            {/* Sticky header */}
            <div className="sticky top-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60" style={{ marginLeft: 'var(--publisher-sidebar-width, 80px)' }}>
                <Header />
            </div>

            <div className="p-4 sm:p-8" style={{ marginLeft: 'var(--publisher-sidebar-width, 80px)' }}>
                <motion.div
                    className="max-w-6xl mx-auto"
                    variants={staggerChildren}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header */}
                    <motion.div className="mb-8" variants={fadeDown}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-violet-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
                                <p className="text-gray-600">Manage your conversations with advertisers</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Search */}
                    <motion.div className="mb-6" variants={cardIn}>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                            />
                        </div>
                    </motion.div>

                    {/* Conversations */}
                    <motion.div variants={staggerChildren}>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <motion.div
                                className="text-center py-12"
                                variants={cardIn}
                            >
                                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {searchTerm ? 'No conversations found' : 'No conversations yet'}
                                </h3>
                                <p className="text-gray-600">
                                    {searchTerm 
                                        ? 'Try adjusting your search terms'
                                        : 'Advertisers will be able to start conversations when they make offers on your opportunities'
                                    }
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredConversations.map((conversation, index) => (
                                    <motion.div
                                        key={conversation.id}
                                        variants={itemUp}
                                        className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                        onClick={() => openChat(conversation)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                <Image
                                                    src={conversation.participant?.image || '/avatar.jpg'}
                                                    alt={conversation.participant?.firstName || 'Advertiser'}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                        {conversation.opportunityTitle}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Clock className="w-4 h-4" />
                                                        {formatTime(conversation.lastMessage?.createdAt || conversation.createdAt)}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 mb-2">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {conversation.participant?.firstName} {conversation.participant?.lastName}
                                                    </span>
                                                    {conversation.participant?.companyLegalName && (
                                                        <span className="text-xs bg-blue-100 px-2 py-1 rounded-full text-blue-700">
                                                            {conversation.participant.companyLegalName}
                                                        </span>
                                                    )}
                                                    {conversation.participant?.brandName && (
                                                        <span className="text-xs bg-green-100 px-2 py-1 rounded-full text-green-700">
                                                            {conversation.participant.brandName}
                                                        </span>
                                                    )}
                                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                                        {conversation.participant?.role}
                                                    </span>
                                                </div>

                                                {conversation.lastMessage && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {conversation.lastMessage.author.firstName}: {truncateMessage(conversation.lastMessage.content)}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mt-3">
                                                    <span className="text-xs text-gray-500">
                                                        {conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                                        conversation.status === 'PUBLISHED' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : conversation.status === 'DRAFT'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {conversation.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </div>

            {/* Chat Modal */}
            {selectedConversation && (
                <ChatModal
                    isOpen={isChatOpen}
                    onClose={() => {
                        setIsChatOpen(false);
                        setSelectedConversation(null);
                    }}
                    opportunityId={selectedConversation.opportunityId}
                    publisherId={selectedConversation.type === 'direct' ? selectedConversation.participant?.id : null}
                    offerId={selectedConversation.offerId}
                    opportunityTitle={selectedConversation.opportunityTitle}
                    publisher={selectedConversation.participant}
                />
            )}
        </div>
    );
}

export default function PublisherInbox() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>}>
            <PublisherInboxContent />
        </Suspense>
    );
}
