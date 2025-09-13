"use client"
import { useState, useEffect } from 'react';
import { User, Building, Mail, Lock, Globe, Phone, MapPin, FileText, BarChart3, Users, Briefcase, ChevronDown, ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Animation variants
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

const fieldUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const formStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

// Comprehensive countries and states data
const countriesData = {
    "USA": {
        name: "United States",
        states: {
            "AL": { name: "Alabama", cities: ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa"] },
            "AK": { name: "Alaska", cities: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"] },
            "AZ": { name: "Arizona", cities: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"] },
            "AR": { name: "Arkansas", cities: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"] },
            "CA": { name: "California", cities: ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose"] },
            "CO": { name: "Colorado", cities: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood"] },
            "CT": { name: "Connecticut", cities: ["Hartford", "Bridgeport", "New Haven", "Stamford", "Waterbury"] },
            "DE": { name: "Delaware", cities: ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna"] },
            "FL": { name: "Florida", cities: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"] },
            "GA": { name: "Georgia", cities: ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens"] },
        }
    },
    "CA": {
        name: "Canada",
        states: {
            "AB": { name: "Alberta", cities: ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "Medicine Hat"] },
            "BC": { name: "British Columbia", cities: ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond"] },
        }
    },
    "UK": {
        name: "United Kingdom",
        states: {
            "ENG": { name: "England", cities: ["London", "Manchester", "Birmingham", "Leeds", "Liverpool"] },
            "SCT": { name: "Scotland", cities: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Stirling"] },
        }
    }
};

export default function Signup() {
    // Simulate URL params - you can replace this with actual Next.js useSearchParams
    const [urlRole] = useState('ADVERTISER');
    
    const [activeStep, setActiveStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [formData, setFormData] = useState({
        role: urlRole || 'ADVERTISER',
        errors: {}
    });

    // Simulate localStorage (in real app, you'd use actual localStorage)
    const [savedData] = useState({});



    const validateStep = (step) => {
        const errors = {};
        const role = formData.role;

        const isValidEmail = (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        };

        const isValidPassword = (password) => {
            return password && password.length >= 6;
        };

        switch (step) {
            case 1:
                if (!formData.firstName?.trim()) errors.firstName = "First name is required";
                if (!formData.lastName?.trim()) errors.lastName = "Last name is required";
                if (!formData.email?.trim()) {
                    errors.email = "Email is required";
                } else if (!isValidEmail(formData.email)) {
                    errors.email = "Invalid email format";
                }
                if (!formData.username?.trim()) errors.username = "Username is required";
                if (!formData.password?.trim()) {
                    errors.password = "Password is required";
                } else if (!isValidPassword(formData.password)) {
                    errors.password = "Password must be at least 6 characters";
                }
                if (!formData.confirmPassword?.trim()) {
                    errors.confirmPassword = "Please confirm your password";
                } else if (formData.password !== formData.confirmPassword) {
                    errors.confirmPassword = "Passwords do not match";
                }
                break;

            case 2:
                if (role === 'PUBLISHER') {
                    if (!formData.companyLegalName?.trim()) errors.companyLegalName = "Company legal name is required";
                    if (!formData.entityType) errors.entityType = "Entity type is required";
                    if (!formData.contactName?.trim()) errors.contactName = "Contact name is required";
                    if (!formData.briefIntro?.trim()) errors.briefIntro = "Company introduction is required";
                } else {
                    if (!formData.brandName?.trim()) errors.brandName = "Brand name is required";
                    if (!formData.companyLegalName?.trim()) errors.companyLegalName = "Company legal name is required";
                    if (!formData.termsAndConditions?.trim()) errors.termsAndConditions = "Brand terms and conditions are required";
                    if (!formData.termsAccepted) errors.termsAccepted = "You must accept the terms and conditions";
                }
                if (!formData.website?.trim()) errors.website = "Website URL is required";
                if (!formData.phoneNumber?.trim()) errors.phoneNumber = "Phone number is required";
                if (!formData.country) errors.country = "Country is required";
                if (!formData.state) errors.state = "State/Province is required";
                if (!formData.city) errors.city = "City is required";
                if (!formData.postalCode?.trim()) errors.postalCode = "Postal/ZIP code is required";
                if (!formData.address?.trim()) errors.address = "Street address is required";
                break;

            case 3:
                if (role === 'PUBLISHER') {
                    if (!formData.websiteRegion) errors.websiteRegion = "Website region is required";
                    if (!formData.monthlyTraffic) errors.monthlyTraffic = "Monthly unique visitors is required";
                    if (!formData.monthlyPageViews) errors.monthlyPageViews = "Monthly page views is required";
                    if (!formData.termsAccepted) errors.termsAccepted = "You must accept the terms and conditions";
                }
                break;

            default:
                break;
        }

        setFormData(prev => ({ ...prev, errors }));
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        // Clear error for the field being edited
        setFormData(prev => ({
            ...prev,
            [name]: newValue,
            errors: { ...prev.errors, [name]: '' },
            ...(name === 'country' ? { state: '', city: '' } : name === 'state' ? { city: '' } : {})
        }));
    };

    const handleRoleSwitch = (role) => {
        setFormData({ ...formData, role, errors: {} });
        setActiveStep(1);
        setSubmitMessage('');
    };

    const handleResendVerification = async () => {
        if (!formData.email) {
            alert('Email not found. Please try signing up again.');
            return;
        }

        setIsResending(true);
        try {
            const response = await fetch('/api/user/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitMessage('Verification email sent successfully! Please check your inbox.');
            } else {
                setSubmitMessage(data.error || 'Failed to resend verification email.');
            }
        } catch (error) {
            console.error('Resend verification error:', error);
            setSubmitMessage('Network error. Please try again.');
        } finally {
            setIsResending(false);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(activeStep)) {
            return;
        }

        if (activeStep < getStepsForRole().length) {
            setActiveStep(activeStep + 1);
        } else {
            // Final submission
            setIsSubmitting(true);
            setSubmitMessage('');

            const submitData = {
                role: formData.role,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                website: formData.website,
                phoneNumber: formData.phoneNumber,
                country: formData.country,
                state: formData.state,
                city: formData.city,
                postalCode: formData.postalCode,
                address: formData.address,
                
                // Publisher-specific fields
                ...(formData.role === 'PUBLISHER' && {
                    companyLegalName: formData.companyLegalName,
                    entityType: formData.entityType,
                    contactName: formData.contactName,
                    websiteRegion: formData.websiteRegion,
                    monthlyTraffic: parseInt(formData.monthlyTraffic) || null,
                    monthlyPageViews: parseInt(formData.monthlyPageViews) || null,
                    briefIntro: formData.briefIntro,
                    termsAccepted: formData.termsAccepted || false,
                }),
                
                // Advertiser-specific fields
                ...(formData.role === 'ADVERTISER' && {
                    brandName: formData.brandName,
                    companyLegalName: formData.companyLegalName,
                    termsAndConditions: formData.termsAndConditions,
                    termsAccepted: formData.termsAccepted || false,
                }),
            };
            
            try {
                const response = await fetch('/api/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submitData),
                });

                const data = await response.json();

                if (response.ok) {
                    // Move to verification step
                    setActiveStep(activeStep + 1);
                    
                    if (data.emailSent) {
                        setSubmitMessage('Registration successful! Please check your email for verification.');
                    } else {
                        setSubmitMessage('Registration successful! However, the verification email could not be sent. You can request a new verification email below.');
                    }
                    

                } else {
                    setSubmitMessage(data.error || 'Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Registration error:', error);
                setSubmitMessage('Network error. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handlePrevious = () => {
        if (activeStep > 1) {
            setFormData(prev => ({ ...prev, errors: {} }));
            setActiveStep(activeStep - 1);
            setSubmitMessage('');
        }
    };

    const getStepsForRole = () => {
        if (formData.role === 'PUBLISHER') {
            return [
                { id: 1, title: 'Basic Info', icon: User },
                { id: 2, title: 'Company Details', icon: Building },
                { id: 3, title: 'Website & Traffic', icon: BarChart3 },
                { id: 4, title: 'Verification', icon: Mail },
            ];
        } else {
            return [
                { id: 1, title: 'Basic Info', icon: User },
                { id: 2, title: 'Business Info', icon: Building },
                { id: 3, title: 'Verification', icon: Mail },
            ];
        }
    };

    const getAvailableStates = () => {
        if (!formData.country || !countriesData[formData.country]) return [];
        return Object.entries(countriesData[formData.country].states).map(([code, data]) => ({
            code,
            name: data.name
        }));
    };

    const getAvailableCities = () => {
        if (!formData.country || !formData.state || !countriesData[formData.country]?.states[formData.state]) return [];
        return countriesData[formData.country].states[formData.state].cities;
    };

    const renderStep = () => {
        const role = formData.role;
        
        switch (activeStep) {
            case 1:
                return (
                    <motion.div className="space-y-4" variants={formStagger}>
                        <motion.div className="text-center mb-6" variants={fieldUp}>
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Basic Information</h2>
                            <p className="text-gray-600 text-sm">Let&apos;s start with your personal details</p>
                        </motion.div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div className="relative" variants={fieldUp}>
                                <label className="block mb-2 font-semibold text-gray-700">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input 
                                        name="firstName" 
                                        value={formData.firstName || ''} 
                                        onChange={handleChange} 
                                        placeholder="Enter your first name" 
                                        className={`pl-10 pr-4 py-2 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${formData.errors.firstName ? 'border-red-500' : 'border-gray-200'}`} 
                                    />
                                </div>
                                {formData.errors.firstName && (
                                    <p className="text-red-500 text-xs mt-1">{formData.errors.firstName}</p>
                                )}
                            </motion.div>
                            <motion.div className="relative" variants={fieldUp}>
                                <label className="block mb-2 font-semibold text-gray-700">Last Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input 
                                        name="lastName" 
                                        value={formData.lastName || ''} 
                                        onChange={handleChange} 
                                        placeholder="Enter your last name" 
                                        className={`pl-10 pr-4 py-2 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${formData.errors.lastName ? 'border-red-500' : 'border-gray-200'}`} 
                                    />
                                </div>
                                {formData.errors.lastName && (
                                    <p className="text-red-500 text-xs mt-1">{formData.errors.lastName}</p>
                                )}
                            </motion.div>
                        </div>
                        
                        <motion.div className="relative" variants={fieldUp}>
                            <label className="block mb-2 font-semibold text-gray-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    name="email" 
                                    type="email"
                                    value={formData.email || ''} 
                                    onChange={handleChange} 
                                    placeholder="Enter your email address" 
                                    className={`pl-10 pr-4 py-2 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${formData.errors.email ? 'border-red-500' : 'border-gray-200'}`} 
                                />
                            </div>
                            {formData.errors.email && (
                                <p className="text-red-500 text-xs mt-1">{formData.errors.email}</p>
                            )}
                        </motion.div>
                        
                        <motion.div className="relative" variants={fieldUp}>
                            <label className="block mb-2 font-semibold text-gray-700">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    name="username" 
                                    value={formData.username || ''} 
                                    onChange={handleChange} 
                                    placeholder="Choose a username" 
                                    className={`pl-10 pr-4 py-2 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${formData.errors.username ? 'border-red-500' : 'border-gray-200'}`} 
                                />
                            </div>
                            {formData.errors.username && (
                                <p className="text-red-500 text-xs mt-1">{formData.errors.username}</p>
                            )}
                        </motion.div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div className="relative" variants={fieldUp}>
                                <label className="block mb-2 font-semibold text-gray-700">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input 
                                        name="password" 
                                        type="password" 
                                        value={formData.password || ''} 
                                        onChange={handleChange} 
                                        placeholder="Create a password" 
                                        className={`pl-10 pr-4 py-2 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${formData.errors.password ? 'border-red-500' : 'border-gray-200'}`} 
                                    />
                                </div>
                                {formData.errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{formData.errors.password}</p>
                                )}
                            </motion.div>
                            <motion.div className="relative" variants={fieldUp}>
                                <label className="block mb-2 font-semibold text-gray-700">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input 
                                        name="confirmPassword" 
                                        type="password" 
                                        value={formData.confirmPassword || ''} 
                                        onChange={handleChange} 
                                        placeholder="Confirm your password" 
                                        className={`pl-10 pr-4 py-2 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${formData.errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`} 
                                    />
                                </div>
                                {formData.errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">{formData.errors.confirmPassword}</p>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                );
                
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {role === 'PUBLISHER' ? 'Company Details' : 'Business Information'}
                            </h2>
                            <p className="text-gray-600">
                                {role === 'PUBLISHER' ? 'Tell us about your company' : 'Your brand and business details'}
                            </p>
                        </div>
                        
                        {role === 'PUBLISHER' ? (
                            <>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input 
                                        name="companyLegalName" 
                                        value={formData.companyLegalName || ''} 
                                        onChange={handleChange} 
                                        placeholder="Company Legal Name" 
                                        className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formData.errors.companyLegalName ? 'border-red-500' : 'border-gray-300'}`} 
                                    />
                                    {formData.errors.companyLegalName && (
                                        <p className="text-red-500 text-xs mt-1">{formData.errors.companyLegalName}</p>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                                        <select 
                                            name="entityType" 
                                            value={formData.entityType || ''} 
                                            onChange={handleChange} 
                                            className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white ${formData.errors.entityType ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            <option value="">Entity Type</option>
                                            <option value="LLC">LLC</option>
                                            <option value="Corporation">Corporation</option>
                                            <option value="Partnership">Partnership</option>
                                            <option value="Sole Proprietorship">Sole Proprietorship</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                                        {formData.errors.entityType && (
                                            <p className="text-red-500 text-xs mt-1">{formData.errors.entityType}</p>
                                        )}
                                    </div>
                                    
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input 
                                            name="contactName" 
                                            value={formData.contactName || ''} 
                                            onChange={handleChange} 
                                            placeholder="Contact Person" 
                                            className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formData.errors.contactName ? 'border-red-500' : 'border-gray-300'}`} 
                                        />
                                        {formData.errors.contactName && (
                                            <p className="text-red-500 text-xs mt-1">{formData.errors.contactName}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <textarea 
                                        name="briefIntro" 
                                        value={formData.briefIntro || ''} 
                                        onChange={handleChange} 
                                        placeholder="Brief introduction about your company" 
                                        rows="3"
                                        className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${formData.errors.briefIntro ? 'border-red-500' : 'border-gray-300'}`} 
                                    />
                                    {formData.errors.briefIntro && (
                                        <p className="text-red-500 text-xs mt-1">{formData.errors.briefIntro}</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input 
                                        name="brandName" 
                                        value={formData.brandName || ''} 
                                        onChange={handleChange} 
                                        placeholder="Brand Name" 
                                        className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formData.errors.brandName ? 'border-red-500' : 'border-gray-300'}`} 
                                    />
                                    {formData.errors.brandName && (
                                        <p className="text-red-500 text-xs mt-1">{formData.errors.brandName}</p>
                                    )}
                                </div>
                                
                                <div className="relative">
                                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input 
                                        name="companyLegalName" 
                                        value={formData.companyLegalName || ''} 
                                        onChange={handleChange} 
                                        placeholder="Full Company Legal Name" 
                                        className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formData.errors.companyLegalName ? 'border-red-500' : 'border-gray-300'}`} 
                                    />
                                    {formData.errors.companyLegalName && (
                                        <p className="text-red-500 text-xs mt-1">{formData.errors.companyLegalName}</p>
                                    )}
                                </div>
                            </>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input 
                                    name="website" 
                                    value={formData.website || ''} 
                                    onChange={handleChange} 
                                    placeholder="Website URL" 
                                    className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formData.errors.website ? 'border-red-500' : 'border-gray-300'}`} 
                                />
                                {formData.errors.website && (
                                    <p className="text-red-500 text-xs mt-1">{formData.errors.website}</p>
                                )}
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input 
                                    name="phoneNumber" 
                                    value={formData.phoneNumber || ''} 
                                    onChange={handleChange} 
                                    placeholder="Phone Number" 
                                    className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formData.errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`} 
                                />
                                {formData.errors.phoneNumber && (
                                    <p className="text-red-500 text-xs mt-1">{formData.errors.phoneNumber}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                                <select 
                                    name="country" 
                                    value={formData.country || ''} 
                                    onChange={handleChange} 
                                    className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white ${formData.errors.country ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select Country</option>
                                    {Object.entries(countriesData).map(([code, data]) => (
                                        <option key={code} value={code}>{data.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                                {formData.errors.country && (
                                    <p className="text-red-500 text-xs mt-1">{formData.errors.country}</p>
                                )}
                            </div>
                            
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                                <select 
                                    name="state" 
                                    value={formData.state || ''} 
                                    onChange={handleChange} 
                                    className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-100 ${formData.errors.state ? 'border-red-500' : 'border-gray-300'}`} 
                                    disabled={!formData.country}
                                >
                                    <option value="">{formData.country ? 'Select State/Province' : 'First Select Country'}</option>
                                    {getAvailableStates().map(state => (
                                        <option key={state.code} value={state.code}>{state.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                                {formData.errors.state && (
                                    <p className="text-red-500 text-xs mt-1">{formData.errors.state}</p>
                                )}
                            </div>
                            
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                                <select 
                                    name="city" 
                                    value={formData.city || ''} 
                                    onChange={handleChange} 
                                    className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-100 ${formData.errors.city ? 'border-red-500' : 'border-gray-300'}`} 
                                    disabled={!formData.state}
                                >
                                    <option value="">{formData.state ? 'Select City' : 'First Select State'}</option>
                                    {getAvailableCities().map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                                {formData.errors.city && (
                                    <p className="text-red-500 text-xs mt-1">{formData.errors.city}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input 
                                    name="postalCode" 
                                    value={formData.postalCode || ''} 
                                    onChange={handleChange} 
                                    placeholder="Postal/ZIP Code" 
                                    className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formData.errors.postalCode ? 'border-red-500' : 'border-gray-300'}`} 
                                />
                                {formData.errors.postalCode && (
                                    <p className="text-red-500 text-xs mt-1">{formData.errors.postalCode}</p>
                                )}
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input 
                                    name="address" 
                                    value={formData.address || ''} 
                                    onChange={handleChange} 
                                    placeholder="Street Address" 
                                    className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formData.errors.address ? 'border-red-500' : 'border-gray-300'}`} 
                                />
                                {formData.errors.address && (
                                    <p className="text-red-500 text-xs mt-1">{formData.errors.address}</p>
                                )}
                            </div>
                        </div>
                        
                        {role === 'ADVERTISER' && (
                            <>
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FileText className="w-5 h-5 text-amber-600" />
                                        <h3 className="font-semibold text-gray-900">Terms and Conditions</h3>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Brand Terms & Conditions
                                        </label>
                                        <textarea
                                            name="termsAndConditions"
                                            value={formData.termsAndConditions || ''}
                                            onChange={handleChange}
                                            rows={6}
                                            placeholder="Please describe the terms and conditions for your brand, including any specific requirements, restrictions, or guidelines that publishers should follow when working with your brand..."
                                            className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white resize-none"
                                        />
                                        <p className="text-xs text-gray-600 mt-2">
                                            This information will be shared with publishers to ensure they understand your brand guidelines and requirements.
                                        </p>
                                    </div>
                                    <label className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-amber-200 cursor-pointer hover:bg-amber-50 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            name="termsAccepted" 
                                            checked={formData.termsAccepted || false} 
                                            onChange={handleChange} 
                                            className={`h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded mt-0.5 ${formData.errors.termsAccepted ? 'border-red-500' : ''}`} 
                                        />
                                        <div className="text-sm text-gray-700">
                                            <span className="font-medium">I agree to the Terms and Conditions</span>
                                            <p className="text-gray-600 mt-1">I confirm that I have read and agree to the platform&apos;s terms of service and that the brand terms provided above are accurate and complete.</p>
                                        </div>
                                        {formData.errors.termsAccepted && (
                                            <p className="text-red-500 text-xs mt-1">{formData.errors.termsAccepted}</p>
                                        )}
                                    </label>
                                </div>
                            </>
                        )}
                    </div>
                );
                
            case 3:
                if (role === 'PUBLISHER') {
                    return (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Website & Traffic Details</h2>
                                <p className="text-gray-600">Help us understand your websites reach</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                                    <select 
                                        name="websiteRegion" 
                                        value={formData.websiteRegion || ''} 
                                        onChange={handleChange} 
                                        className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white ${formData.errors.websiteRegion ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Website Primary Region</option>
                                        <option value="North America">North America</option>
                                        <option value="Europe">Europe</option>
                                        <option value="Asia Pacific">Asia Pacific</option>
                                        <option value="Latin America">Latin America</option>
                                        <option value="Middle East & Africa">Middle East & Africa</option>
                                        <option value="Global">Global</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                                    {formData.errors.websiteRegion && (
                                        <p className="text-red-500 text-xs mt-1">{formData.errors.websiteRegion}</p>
                                    )}
                                </div>
                                
                                <div className="relative">
                                    <BarChart3 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input 
                                        name="monthlyTraffic" 
                                        type="number"
                                        value={formData.monthlyTraffic || ''} 
                                        onChange={handleChange} 
                                        placeholder="Monthly Unique Visitors" 
                                        className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formData.errors.monthlyTraffic ? 'border-red-500' : 'border-gray-300'}`} 
                                    />
                                    {formData.errors.monthlyTraffic && (
                                        <p className="text-red-500 text-xs mt-1">{formData.errors.monthlyTraffic}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="relative">
                                <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input 
                                    name="monthlyPageViews" 
                                    type="number"
                                    value={formData.monthlyPageViews || ''} 
                                    onChange={handleChange} 
                                    placeholder="Monthly Page Views" 
                                    className={`pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formData.errors.monthlyPageViews ? 'border-red-500' : 'border-gray-300'}`} 
                                    />
                                    {formData.errors.monthlyPageViews && (
                                        <p className="text-red-500 text-xs mt-1">{formData.errors.monthlyPageViews}</p>
                                    )}
                            </div>
                            
                            <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="termsAccepted" 
                                    checked={formData.termsAccepted || false} 
                                    onChange={handleChange} 
                                    className={`h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded ${formData.errors.termsAccepted ? 'border-red-500' : ''}`} 
                                />
                                <span className="text-sm text-gray-700">I agree to the Terms and Conditions and Publisher Guidelines</span>
                                {formData.errors.termsAccepted && (
                                    <p className="text-red-500 text-xs mt-1">{formData.errors.termsAccepted}</p>
                                )}
                            </label>
                        </div>
                    );
                }
                
            case 4:
            default:
                return (
                    <div className="space-y-6 text-center">
                        <div className="mb-8">
                            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-10 w-10 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Verification</h2>
                            <p className="text-gray-600">Youre almost done!</p>
                        </div>
                        
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <p className="text-gray-700 mb-4">
                                Weve sent a verification email to <strong>{formData.email}</strong>
                            </p>
                            <p className="text-gray-600 text-sm mb-6">
                                Please check your inbox and click the verification link to complete your registration.
                                Dont forget to check your spam folder if you dont see it in your inbox.
                            </p>
                            
                            {submitMessage && (
                                <div className={`mb-4 p-3 rounded-lg text-sm ${
                                    submitMessage.includes('successfully') || submitMessage.includes('sent') 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {submitMessage}
                                </div>
                            )}
                            
                                                         <button 
                                 type="button" 
                                 onClick={handleResendVerification}
                                 disabled={isResending}
                                 className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                             >
                                 {isResending ? 'Sending...' : 'Resend Verification Email'}
                             </button>
                        </div>
                    </div>
                );
        }
    };

    const steps = getStepsForRole();
    const isLastStep = activeStep === steps.length;

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
                        className="text-2xl lg:text-3xl font-bold mb-3 drop-shadow-lg"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Join HMH Today
                    </motion.h1>
                    
                    <motion.p 
                        className="text-base lg:text-lg mb-6 text-blue-100 max-w-md"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        {formData.role === 'PUBLISHER' 
                            ? 'Monetize your content and connect with top brands' 
                            : 'Reach your target audience through premium publishers'
                        }
                    </motion.p>

                    {/* Role Selection */}
                    <motion.div 
                        className="mb-6"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <p className="text-blue-200 text-sm mb-3">I want to join as:</p>
                        <div className="flex space-x-3">
                            <motion.button
                                type="button"
                                onClick={() => handleRoleSwitch('ADVERTISER')}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm ${
                                    formData.role === 'ADVERTISER'
                                        ? 'bg-white text-blue-600 shadow-lg scale-105'
                                        : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Advertiser
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={() => handleRoleSwitch('PUBLISHER')}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm ${
                                    formData.role === 'PUBLISHER'
                                        ? 'bg-white text-blue-600 shadow-lg scale-105'
                                        : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Publisher
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Benefits */}
                    <motion.div 
                        className="space-y-3"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                    >
                        <div className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 text-green-300" />
                            <span className="text-blue-100 text-sm">Connect with verified partners</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 text-green-300" />
                            <span className="text-blue-100 text-sm">Advanced analytics and reporting</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 text-green-300" />
                            <span className="text-blue-100 text-sm">24/7 dedicated support</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Side - Form Section */}
            <motion.div 
                className="w-full lg:w-1/2 flex flex-col p-4 lg:p-6 h-full"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                {/* Progress Steps */}
                <motion.div 
                    className="mb-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    <div className="flex items-center justify-between mb-4 overflow-x-auto">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            const isActive = activeStep === step.id;
                            const isCompleted = activeStep > step.id;
                            
                            return (
                                <motion.div 
                                    key={step.id} 
                                    className="flex items-center min-w-0"
                                    variants={fieldUp}
                                >
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all flex-shrink-0 ${
                                        isCompleted 
                                            ? 'bg-green-500 border-green-500 text-white shadow-lg' 
                                            : isActive 
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white shadow-lg' 
                                                : 'border-gray-300 text-gray-400 bg-white'
                                    }`}>
                                        {isCompleted ? (
                                            <CheckCircle size={16} />
                                        ) : (
                                            <StepIcon size={16} />
                                        )}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`h-1 w-12 lg:w-16 mx-2 transition-all flex-shrink-0 rounded-full ${
                                            isCompleted ? 'bg-green-500' : 'bg-gray-200'
                                        }`}></div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                    <motion.div 
                        className="text-xs text-gray-600 text-center font-medium"
                        variants={fieldUp}
                    >
                        Step {activeStep} of {steps.length}: {steps[activeStep - 1]?.title}
                    </motion.div>
                </motion.div>
                
                {/* Form Container */}
                <motion.div 
                    className="flex-1 min-h-0"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div 
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 lg:p-8 border border-white/20 h-full flex flex-col"
                        variants={fieldUp}
                    >
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {renderStep()}
                        </div>
                        
                        <AnimatePresence mode="wait">
                            {submitMessage && activeStep < steps.length && (
                                <motion.div
                                    key={submitMessage}
                                    className={`mt-4 p-3 rounded-xl text-xs ${
                                        submitMessage.includes('successful') 
                                            ? 'bg-green-50 border border-green-200 text-green-700' 
                                            : 'bg-red-50 border border-red-200 text-red-700'
                                    }`}
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${
                                            submitMessage.includes('successful') ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                        {submitMessage}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {/* Navigation Buttons */}
                        <motion.div 
                            className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0"
                            variants={fieldUp}
                        >
                            <div>
                                {activeStep > 1 && activeStep <= steps.length && (
                                    <motion.button 
                                        type="button" 
                                        onClick={handlePrevious} 
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors hover:bg-gray-100 rounded-xl text-sm"
                                        whileHover={{ x: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        ← Previous
                                    </motion.button>
                                )}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                                {activeStep === 1 && (
                                    <motion.p 
                                        className="text-xs text-gray-600 text-center"
                                        variants={fieldUp}
                                    >
                                        Already have an account? 
                                        <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors ml-1">
                                            Sign in
                                        </a>
                                    </motion.p>
                                )}
                                {activeStep <= steps.length && (
                                    <motion.button 
                                        onClick={handleSubmit} 
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                                        variants={fieldUp}
                                        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                {isLastStep ? 'Complete Registration' : 'Continue'}
                                                <ArrowRight size={16} />
                                            </>
                                        )}
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );}