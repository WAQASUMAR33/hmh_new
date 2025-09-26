'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
    Search, 
    Plus, 
    Eye,
    Edit,
    Trash2,
    Shield,
    ArrowLeft,
    LogOut,
    UserPlus,
    Users,
    Key,
    Mail,
    Phone,
    Building
} from 'lucide-react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [users, setUsers] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'manager',
        permissions: [],
        password: ''
    });
    const router = useRouter();

    // Mock data for admin users
    const mockUsers = [
        {
            id: 1,
            firstName: 'Super',
            lastName: 'Admin',
            email: 'super.admin@hmh.com',
            phone: '+1-555-0001',
            role: 'super_admin',
            permissions: ['all'],
            createdDate: '2023-10-01',
            lastActive: '2024-01-21',
            status: 'active'
        },
        {
            id: 2,
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@hmh.com',
            phone: '+1-555-0002',
            role: 'admin',
            permissions: ['user_management', 'publisher_management', 'advertiser_management', 'reports'],
            createdDate: '2024-01-15',
            lastActive: '2024-01-20',
            status: 'active'
        },
        {
            id: 3,
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@hmh.com',
            phone: '+1-555-0003',
            role: 'admin',
            permissions: ['publisher_management', 'advertiser_management', 'reports'],
            createdDate: '2023-11-22',
            lastActive: '2024-01-18',
            status: 'active'
        },
        {
            id: 4,
            firstName: 'David',
            lastName: 'Wilson',
            email: 'david.wilson@hmh.com',
            phone: '+1-555-0004',
            role: 'manager',
            permissions: ['publisher_management', 'reports'],
            createdDate: '2024-01-10',
            lastActive: '2024-01-21',
            status: 'active'
        },
        {
            id: 5,
            firstName: 'Lisa',
            lastName: 'Martinez',
            email: 'lisa.martinez@hmh.com',
            phone: '+1-555-0005',
            role: 'manager',
            permissions: ['advertiser_management'],
            createdDate: '2023-12-15',
            lastActive: '2024-01-15',
            status: 'suspended'
        }
    ];

    useEffect(() => {
        setUsers(mockUsers);
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        
        return matchesSearch && matchesRole;
    });

    const handleCreateUser = () => {
        setNewUser({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'manager',
            permissions: [],
            password: ''
        });
        setShowCreateModal(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setNewUser({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            permissions: user.permissions,
            password: ''
        });
        setShowEditModal(true);
    };

    const handleSaveUser = () => {
        // Validate form
        if (!newUser.firstName || !newUser.lastName || !newUser.email) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (showCreateModal && !newUser.password) {
            toast.error('Password is required for new users');
            return;
        }

        if (showCreateModal) {
            // Create new admin user
            const newUserData = {
                ...newUser,
                id: users.length + 1,
                createdDate: new Date().toISOString().split('T')[0],
                lastActive: new Date().toISOString().split('T')[0],
                status: 'active'
            };
            
            setUsers(prev => [...prev, newUserData]);
            toast.success(`Admin user created: ${newUser.firstName} ${newUser.lastName}`);
        } else {
            // Update existing user
            setUsers(prev => prev.map(u => 
                u.id === selectedUser.id 
                    ? { ...u, ...newUser }
                    : u
            ));
            toast.success(`Admin user updated: ${newUser.firstName} ${newUser.lastName}`);
        }

        setShowCreateModal(false);
        setShowEditModal(false);
        setSelectedUser(null);
    };

    const handleDeleteUser = (user) => {
        if (user.role === 'super_admin') {
            toast.error('Cannot delete Super Admin users');
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
            setUsers(prev => prev.filter(u => u.id !== user.id));
            toast.success(`User deleted: ${user.firstName} ${user.lastName}`);
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'super_admin':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Super Admin</span>;
            case 'admin':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Admin</span>;
            case 'manager':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Manager</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{role}</span>;
        }
    };

    const getPermissionsDisplay = (permissions) => {
        if (permissions.includes('all')) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">All Permissions</span>;
        }
        
        const permissionLabels = {
            'user_management': 'Users',
            'publisher_management': 'Publishers',
            'advertiser_management': 'Advertisers',
            'reports': 'Reports',
            'system_settings': 'System'
        };
        
        const displayPermissions = permissions.slice(0, 2).map(p => permissionLabels[p] || p);
        const remaining = permissions.length - 2;
        
        return (
            <div className="flex flex-wrap gap-1">
                {displayPermissions.map((perm, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {perm}
                    </span>
                ))}
                {remaining > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{remaining} more
                    </span>
                )}
            </div>
        );
    };

    const getStatusBadge = (status) => {
        if (status === 'active') {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
        } else {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Suspended</span>;
        }
    };


    return (
        <AdminLayout title="Admin User Management" icon={UserPlus}>
            <ToastContainer />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search admin users by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Roles</option>
                                <option value="super_admin">Super Admin</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Admin Users ({filteredUsers.length})
                        </h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                                    <div className="text-sm text-gray-500">ID: {user.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                            <div className="text-sm text-gray-500">{user.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getPermissionsDisplay(user.permissions)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(user.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="text-green-600 hover:text-green-900 p-1"
                                                    title="Edit User"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                {user.role !== 'super_admin' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user)}
                                                        className="text-red-600 hover:text-red-900 p-1"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Floating Action Button */}
            <button
                onClick={handleCreateUser}
                className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-40"
            >
                <UserPlus className="w-6 h-6" />
            </button>

            {/* Create/Edit User Modal */}
            {(showCreateModal || showEditModal) && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            {showCreateModal ? 'Create New Admin User' : 'Edit Admin User'}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                <input
                                    type="text"
                                    value={newUser.firstName}
                                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                <input
                                    type="text"
                                    value={newUser.lastName}
                                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={newUser.phone}
                                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { key: 'user_management', label: 'User Management' },
                                        { key: 'publisher_management', label: 'Publisher Management' },
                                        { key: 'advertiser_management', label: 'Advertiser Management' },
                                        { key: 'reports', label: 'Reports' },
                                        { key: 'system_settings', label: 'System Settings' }
                                    ].map((permission) => (
                                        <label key={permission.key} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={newUser.permissions.includes(permission.key)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewUser({
                                                            ...newUser,
                                                            permissions: [...newUser.permissions, permission.key]
                                                        });
                                                    } else {
                                                        setNewUser({
                                                            ...newUser,
                                                            permissions: newUser.permissions.filter(p => p !== permission.key)
                                                        });
                                                    }
                                                }}
                                                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{permission.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {showCreateModal && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                    <input
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            )}
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setShowEditModal(false);
                                    setSelectedUser(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveUser}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                {showCreateModal ? 'Create Admin User' : 'Update Admin User'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AdminLayout>
    );
}
