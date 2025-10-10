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
import { 
    ROLES, 
    MODULES, 
    PERMISSIONS, 
    getRoleDisplayName, 
    getModuleDisplayName, 
    getPermissionDisplayName,
    getAvailableRoles,
    getAvailableModules,
    getModulePermissions,
    canCreateUser,
    canAssignRole,
    canDeleteUser,
    canEditUser
} from '../utils/rolePermissions';

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [users, setUsers] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        phone: '',
        role: ROLES.MANAGER, // Default to manager, user can select from dropdown
        permissions: [],
        modules: [],
        password: ''
    });
    const router = useRouter();

    // Fetch admin users from API
    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            const data = await response.json();
            
            if (data.success) {
                setUsers(data.users);
            } else {
                toast.error('Failed to fetch admin users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error fetching admin users');
        }
    };

    useEffect(() => {
        fetchUsers();
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
            username: '',
            phone: '',
            role: ROLES.MANAGER, // Default to manager
            permissions: [],
            modules: [],
            password: ''
        });
        setShowCreateModal(true);
    };

    const handleViewProfile = (user) => {
        setSelectedUser(user);
        setShowProfileModal(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setNewUser({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.email.split('@')[0], // Extract username from email
            phone: user.phone,
            role: user.role,
            permissions: user.permissions || [],
            modules: user.modules || [],
            password: ''
        });
        setShowEditModal(true);
    };

    const handleSaveUser = async () => {
        // Validate form
        if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.username) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (showCreateModal && !newUser.password) {
            toast.error('Password is required for new users');
            return;
        }

        try {
            if (showCreateModal) {
                // Create new admin user
                const response = await fetch('/api/admin/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        email: newUser.email,
                        username: newUser.username,
                        phone: newUser.phone,
                        password: newUser.password,
                        role: newUser.role,
                        permissions: newUser.permissions,
                        modules: newUser.modules
                    })
                });

                const data = await response.json();
                
                if (data.success) {
                    toast.success(`Admin user created: ${newUser.firstName} ${newUser.lastName}`);
                    fetchUsers(); // Refresh the list
                } else {
                    toast.error(data.error || 'Failed to create admin user');
                }
            } else {
                // Update existing user
                const response = await fetch('/api/admin/users', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: selectedUser.id,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        email: newUser.email,
                        username: newUser.username,
                        phone: newUser.phone,
                        role: newUser.role,
                        permissions: newUser.permissions,
                        modules: newUser.modules,
                        password: newUser.password || undefined // Only include if provided
                    })
                });

                const data = await response.json();
                
                if (data.success) {
                    toast.success(`Admin user updated: ${newUser.firstName} ${newUser.lastName}`);
                    fetchUsers(); // Refresh the list
                } else {
                    toast.error(data.error || 'Failed to update admin user');
                }
            }

            setShowCreateModal(false);
            setShowEditModal(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error('Error saving admin user');
        }
    };

    const handleDeleteUser = async (user) => {
        if (user.role === 'super_admin') {
            toast.error('Cannot delete Super Admin users');
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
            try {
                const response = await fetch(`/api/admin/users?id=${user.id}`, {
                    method: 'DELETE'
                });

                const data = await response.json();
                
                if (data.success) {
                    toast.success(`User deleted: ${user.firstName} ${user.lastName}`);
                    fetchUsers(); // Refresh the list
                } else {
                    toast.error(data.error || 'Failed to delete admin user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Error deleting admin user');
            }
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case ROLES.SUPER_ADMIN:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{getRoleDisplayName(ROLES.SUPER_ADMIN)}</span>;
            case ROLES.ADMIN:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">{getRoleDisplayName(ROLES.ADMIN)}</span>;
            case ROLES.MANAGER:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{getRoleDisplayName(ROLES.MANAGER)}</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{getRoleDisplayName(role)}</span>;
        }
    };

    const getPermissionsDisplay = (modules) => {
        if (!modules || !Array.isArray(modules) || modules.length === 0) {
            return <span className="text-gray-500 text-sm">No modules assigned</span>;
        }
        
        const displayModules = modules.slice(0, 2).map(m => getModuleDisplayName(m));
        const remaining = modules.length - 2;
        
        return (
            <div className="flex flex-wrap gap-1">
                {displayModules.map((module, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {module}
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modules</th>
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
                                            {getPermissionsDisplay(user.modules)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(user.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleViewProfile(user)}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="View Profile"
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

            {/* Profile View Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Admin User Profile: {selectedUser?.firstName} {selectedUser?.lastName}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowProfileModal(false);
                                    setSelectedUser(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="text-sm text-gray-900">{selectedUser?.firstName} {selectedUser?.lastName}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="text-sm text-gray-900">{selectedUser?.email}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <div className="text-sm text-gray-900">{selectedUser?.phone || 'N/A'}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                    <div className="text-sm text-gray-900">{selectedUser?.company || 'N/A'}</div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <div className="flex items-center">
                                        {getRoleBadge(selectedUser?.role)}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                                    <div className="flex items-center">
                                        {getStatusBadge(selectedUser?.status)}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                                    <div className="text-sm text-gray-900">{selectedUser?.id}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                                    <div className="text-sm text-gray-900">
                                        {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Permissions and Modules */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Permissions & Modules</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Modules</label>
                                    <div className="space-y-2">
                                        {selectedUser?.modules && selectedUser.modules.length > 0 ? (
                                            selectedUser.modules.map((module, index) => (
                                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2">
                                                    {getModuleDisplayName(module)}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 text-sm">No modules assigned</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                                    <div className="space-y-2">
                                        {selectedUser?.permissions && selectedUser.permissions.length > 0 ? (
                                            selectedUser.permissions.map((permission, index) => (
                                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2 mb-2">
                                                    {getPermissionDisplayName(permission)}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 text-sm">No specific permissions</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => {
                                    setShowProfileModal(false);
                                    setSelectedUser(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                                <input
                                    type="text"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
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
                                    <option value={ROLES.MANAGER}>{getRoleDisplayName(ROLES.MANAGER)}</option>
                                    <option value={ROLES.ADMIN}>{getRoleDisplayName(ROLES.ADMIN)}</option>
                                    <option value={ROLES.SUPER_ADMIN}>{getRoleDisplayName(ROLES.SUPER_ADMIN)}</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Modules</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.values(MODULES).map((module) => (
                                        <label key={module} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={newUser.modules.includes(module)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewUser({
                                                            ...newUser,
                                                            modules: [...newUser.modules, module]
                                                        });
                                                    } else {
                                                        setNewUser({
                                                            ...newUser,
                                                            modules: newUser.modules.filter(m => m !== module)
                                                        });
                                                    }
                                                }}
                                                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{getModuleDisplayName(module)}</span>
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
