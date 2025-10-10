// Role-based permissions system for Admin User Management

export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MANAGER: 'manager'
};

export const MODULES = {
    USER_MANAGEMENT: 'user_management',
    ADVERTISER_MANAGEMENT: 'advertiser_management',
    PUBLISHER_MANAGEMENT: 'publisher_management',
    OPPORTUNITY_MANAGEMENT: 'opportunity_management',
    BOOKING_MANAGEMENT: 'booking_management',
    REPORTS: 'reports',
    ANALYTICS: 'analytics',
    SYSTEM_SETTINGS: 'system_settings',
    APPEALS: 'appeals'
};

export const PERMISSIONS = {
    // User Management
    CREATE_USERS: 'create_users',
    EDIT_USERS: 'edit_users',
    DELETE_USERS: 'delete_users',
    VIEW_USERS: 'view_users',
    
    // Advertiser Management
    CREATE_ADVERTISERS: 'create_advertisers',
    EDIT_ADVERTISERS: 'edit_advertisers',
    DELETE_ADVERTISERS: 'delete_advertisers',
    VIEW_ADVERTISERS: 'view_advertisers',
    
    // Publisher Management
    CREATE_PUBLISHERS: 'create_publishers',
    EDIT_PUBLISHERS: 'edit_publishers',
    DELETE_PUBLISHERS: 'delete_publishers',
    VIEW_PUBLISHERS: 'view_publishers',
    
    // Opportunity Management
    CREATE_OPPORTUNITIES: 'create_opportunities',
    EDIT_OPPORTUNITIES: 'edit_opportunities',
    DELETE_OPPORTUNITIES: 'delete_opportunities',
    VIEW_OPPORTUNITIES: 'view_opportunities',
    
    // Booking Management
    CREATE_BOOKINGS: 'create_bookings',
    EDIT_BOOKINGS: 'edit_bookings',
    DELETE_BOOKINGS: 'delete_bookings',
    VIEW_BOOKINGS: 'view_bookings',
    
    // Reports & Analytics
    VIEW_REPORTS: 'view_reports',
    EXPORT_REPORTS: 'export_reports',
    VIEW_ANALYTICS: 'view_analytics',
    
    // System Settings
    MANAGE_SYSTEM_SETTINGS: 'manage_system_settings',
    MANAGE_APPEALS: 'manage_appeals'
};

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: {
        // SuperAdmin has ALL permissions
        permissions: Object.values(PERMISSIONS),
        canCreateUsers: true,
        canAssignRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        canDeleteUsers: true,
        canEditAnyUser: true,
        modules: Object.values(MODULES)
    },
    
    [ROLES.ADMIN]: {
        // Admin can create users with limited access
        permissions: [
            PERMISSIONS.CREATE_USERS,
            PERMISSIONS.EDIT_USERS,
            PERMISSIONS.VIEW_USERS,
            PERMISSIONS.VIEW_ADVERTISERS,
            PERMISSIONS.VIEW_PUBLISHERS,
            PERMISSIONS.VIEW_OPPORTUNITIES,
            PERMISSIONS.VIEW_BOOKINGS,
            PERMISSIONS.VIEW_REPORTS,
            PERMISSIONS.VIEW_ANALYTICS,
            PERMISSIONS.MANAGE_APPEALS
        ],
        canCreateUsers: true,
        canAssignRoles: [ROLES.MANAGER], // Admin can only assign Manager role
        canDeleteUsers: false,
        canEditAnyUser: false, // Can only edit users they created
        modules: [
            MODULES.USER_MANAGEMENT,
            MODULES.ADVERTISER_MANAGEMENT,
            MODULES.PUBLISHER_MANAGEMENT,
            MODULES.OPPORTUNITY_MANAGEMENT,
            MODULES.BOOKING_MANAGEMENT,
            MODULES.REPORTS,
            MODULES.ANALYTICS,
            MODULES.APPEALS
        ]
    },
    
    [ROLES.MANAGER]: {
        // Manager can only manage resources within assigned modules
        permissions: [
            PERMISSIONS.VIEW_ADVERTISERS,
            PERMISSIONS.VIEW_PUBLISHERS,
            PERMISSIONS.VIEW_OPPORTUNITIES,
            PERMISSIONS.VIEW_BOOKINGS,
            PERMISSIONS.VIEW_REPORTS
        ],
        canCreateUsers: false,
        canAssignRoles: [],
        canDeleteUsers: false,
        canEditAnyUser: false,
        modules: [] // Modules are assigned individually
    }
};

// Module to permission mapping
export const MODULE_PERMISSIONS = {
    [MODULES.USER_MANAGEMENT]: [
        PERMISSIONS.CREATE_USERS,
        PERMISSIONS.EDIT_USERS,
        PERMISSIONS.DELETE_USERS,
        PERMISSIONS.VIEW_USERS
    ],
    [MODULES.ADVERTISER_MANAGEMENT]: [
        PERMISSIONS.CREATE_ADVERTISERS,
        PERMISSIONS.EDIT_ADVERTISERS,
        PERMISSIONS.DELETE_ADVERTISERS,
        PERMISSIONS.VIEW_ADVERTISERS
    ],
    [MODULES.PUBLISHER_MANAGEMENT]: [
        PERMISSIONS.CREATE_PUBLISHERS,
        PERMISSIONS.EDIT_PUBLISHERS,
        PERMISSIONS.DELETE_PUBLISHERS,
        PERMISSIONS.VIEW_PUBLISHERS
    ],
    [MODULES.OPPORTUNITY_MANAGEMENT]: [
        PERMISSIONS.CREATE_OPPORTUNITIES,
        PERMISSIONS.EDIT_OPPORTUNITIES,
        PERMISSIONS.DELETE_OPPORTUNITIES,
        PERMISSIONS.VIEW_OPPORTUNITIES
    ],
    [MODULES.BOOKING_MANAGEMENT]: [
        PERMISSIONS.CREATE_BOOKINGS,
        PERMISSIONS.EDIT_BOOKINGS,
        PERMISSIONS.DELETE_BOOKINGS,
        PERMISSIONS.VIEW_BOOKINGS
    ],
    [MODULES.REPORTS]: [
        PERMISSIONS.VIEW_REPORTS,
        PERMISSIONS.EXPORT_REPORTS
    ],
    [MODULES.ANALYTICS]: [
        PERMISSIONS.VIEW_ANALYTICS
    ],
    [MODULES.SYSTEM_SETTINGS]: [
        PERMISSIONS.MANAGE_SYSTEM_SETTINGS
    ],
    [MODULES.APPEALS]: [
        PERMISSIONS.MANAGE_APPEALS
    ]
};

// Permission checking utilities
export const hasPermission = (userRole, userPermissions, requiredPermission) => {
    const roleConfig = ROLE_PERMISSIONS[userRole];
    if (!roleConfig) return false;
    
    // Check if user has the permission directly
    if (userPermissions && userPermissions.includes(requiredPermission)) {
        return true;
    }
    
    // Check if role has the permission
    return roleConfig.permissions.includes(requiredPermission);
};

export const hasModuleAccess = (userRole, userModules, requiredModule) => {
    const roleConfig = ROLE_PERMISSIONS[userRole];
    if (!roleConfig) return false;
    
    // SuperAdmin has access to all modules
    if (userRole === ROLES.SUPER_ADMIN) {
        return true;
    }
    
    // Check if user has the module assigned
    if (userModules && userModules.includes(requiredModule)) {
        return true;
    }
    
    // Check if role has default access to the module
    return roleConfig.modules.includes(requiredModule);
};

export const canCreateUser = (userRole) => {
    const roleConfig = ROLE_PERMISSIONS[userRole];
    return roleConfig ? roleConfig.canCreateUsers : false;
};

export const canAssignRole = (userRole, targetRole) => {
    const roleConfig = ROLE_PERMISSIONS[userRole];
    return roleConfig ? roleConfig.canAssignRoles.includes(targetRole) : false;
};

export const canDeleteUser = (userRole) => {
    const roleConfig = ROLE_PERMISSIONS[userRole];
    return roleConfig ? roleConfig.canDeleteUsers : false;
};

export const canEditUser = (userRole, targetUserId, currentUserId) => {
    const roleConfig = ROLE_PERMISSIONS[userRole];
    if (!roleConfig) return false;
    
    // SuperAdmin can edit any user
    if (roleConfig.canEditAnyUser) return true;
    
    // Others can only edit themselves
    return targetUserId === currentUserId;
};

// Get available roles for assignment
export const getAvailableRoles = (userRole) => {
    const roleConfig = ROLE_PERMISSIONS[userRole];
    return roleConfig ? roleConfig.canAssignRoles : [];
};

// Get available modules for assignment
export const getAvailableModules = (userRole) => {
    const roleConfig = ROLE_PERMISSIONS[userRole];
    return roleConfig ? roleConfig.modules : [];
};

// Get permissions for a specific module
export const getModulePermissions = (module) => {
    return MODULE_PERMISSIONS[module] || [];
};

// Get all available modules
export const getAllModules = () => {
    return Object.values(MODULES);
};

// Get all available permissions
export const getAllPermissions = () => {
    return Object.values(PERMISSIONS);
};

// Get role display name
export const getRoleDisplayName = (role) => {
    const roleNames = {
        [ROLES.SUPER_ADMIN]: 'Super Admin',
        [ROLES.ADMIN]: 'Admin',
        [ROLES.MANAGER]: 'Manager'
    };
    return roleNames[role] || role;
};

// Get module display name
export const getModuleDisplayName = (module) => {
    const moduleNames = {
        [MODULES.USER_MANAGEMENT]: 'User Management',
        [MODULES.ADVERTISER_MANAGEMENT]: 'Advertiser Management',
        [MODULES.PUBLISHER_MANAGEMENT]: 'Publisher Management',
        [MODULES.OPPORTUNITY_MANAGEMENT]: 'Opportunity Management',
        [MODULES.BOOKING_MANAGEMENT]: 'Booking Management',
        [MODULES.REPORTS]: 'Reports',
        [MODULES.ANALYTICS]: 'Analytics',
        [MODULES.SYSTEM_SETTINGS]: 'System Settings',
        [MODULES.APPEALS]: 'Appeals'
    };
    return moduleNames[module] || module;
};

// Get permission display name
export const getPermissionDisplayName = (permission) => {
    const permissionNames = {
        [PERMISSIONS.CREATE_USERS]: 'Create Users',
        [PERMISSIONS.EDIT_USERS]: 'Edit Users',
        [PERMISSIONS.DELETE_USERS]: 'Delete Users',
        [PERMISSIONS.VIEW_USERS]: 'View Users',
        [PERMISSIONS.CREATE_ADVERTISERS]: 'Create Advertisers',
        [PERMISSIONS.EDIT_ADVERTISERS]: 'Edit Advertisers',
        [PERMISSIONS.DELETE_ADVERTISERS]: 'Delete Advertisers',
        [PERMISSIONS.VIEW_ADVERTISERS]: 'View Advertisers',
        [PERMISSIONS.CREATE_PUBLISHERS]: 'Create Publishers',
        [PERMISSIONS.EDIT_PUBLISHERS]: 'Edit Publishers',
        [PERMISSIONS.DELETE_PUBLISHERS]: 'Delete Publishers',
        [PERMISSIONS.VIEW_PUBLISHERS]: 'View Publishers',
        [PERMISSIONS.CREATE_OPPORTUNITIES]: 'Create Opportunities',
        [PERMISSIONS.EDIT_OPPORTUNITIES]: 'Edit Opportunities',
        [PERMISSIONS.DELETE_OPPORTUNITIES]: 'Delete Opportunities',
        [PERMISSIONS.VIEW_OPPORTUNITIES]: 'View Opportunities',
        [PERMISSIONS.CREATE_BOOKINGS]: 'Create Bookings',
        [PERMISSIONS.EDIT_BOOKINGS]: 'Edit Bookings',
        [PERMISSIONS.DELETE_BOOKINGS]: 'Delete Bookings',
        [PERMISSIONS.VIEW_BOOKINGS]: 'View Bookings',
        [PERMISSIONS.VIEW_REPORTS]: 'View Reports',
        [PERMISSIONS.EXPORT_REPORTS]: 'Export Reports',
        [PERMISSIONS.VIEW_ANALYTICS]: 'View Analytics',
        [PERMISSIONS.MANAGE_SYSTEM_SETTINGS]: 'Manage System Settings',
        [PERMISSIONS.MANAGE_APPEALS]: 'Manage Appeals'
    };
    return permissionNames[permission] || permission;
};

