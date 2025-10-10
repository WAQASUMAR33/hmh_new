// Import the new role-based permissions system
import { 
    ROLES, 
    MODULES, 
    PERMISSIONS, 
    ROLE_PERMISSIONS as NEW_ROLE_PERMISSIONS,
    MODULE_PERMISSIONS,
    hasPermission as newHasPermission,
    hasModuleAccess,
    canCreateUser,
    canAssignRole,
    canDeleteUser,
    canEditUser,
    getAvailableRoles,
    getAvailableModules,
    getModulePermissions,
    getAllModules,
    getAllPermissions,
    getRoleDisplayName,
    getModuleDisplayName,
    getPermissionDisplayName
} from './rolePermissions';

// Legacy permission constants (for backward compatibility)
export const LEGACY_PERMISSIONS = {
    USER_MANAGEMENT: 'user_management',
    PUBLISHER_MANAGEMENT: 'publisher_management', 
    ADVERTISER_MANAGEMENT: 'advertiser_management',
    REPORTS: 'reports',
    SYSTEM_SETTINGS: 'system_settings',
    ALL: 'all'
};

// Export new permissions system
export { 
    ROLES, 
    MODULES, 
    PERMISSIONS, 
    NEW_ROLE_PERMISSIONS as ROLE_PERMISSIONS,
    MODULE_PERMISSIONS,
    hasModuleAccess,
    canCreateUser,
    canAssignRole,
    canDeleteUser,
    canEditUser,
    getAvailableRoles,
    getAvailableModules,
    getModulePermissions,
    getAllModules,
    getAllPermissions,
    getRoleDisplayName,
    getModuleDisplayName,
    getPermissionDisplayName
};

// Map permissions to menu items
export const PERMISSION_MENU_MAP = {
    [PERMISSIONS.VIEW_USERS]: [
        '/admin/users',
        '/admin/appeals'
    ],
    [PERMISSIONS.VIEW_PUBLISHERS]: [
        '/admin/publishers',
        '/admin/opportunities'
    ],
    [PERMISSIONS.VIEW_ADVERTISERS]: [
        '/admin/advertisers'
    ],
    [PERMISSIONS.VIEW_REPORTS]: [
        '/admin/reports'
    ],
    [PERMISSIONS.MANAGE_SYSTEM_SETTINGS]: [
        '/admin/system'
    ]
};

// Get user permissions from localStorage
export const getUserPermissions = () => {
    try {
        const permissions = localStorage.getItem('userPermissions');
        return permissions ? JSON.parse(permissions) : [];
    } catch (error) {
        console.error('Error parsing user permissions:', error);
        return [];
    }
};

// Check if user has specific permission (updated to use new system)
export const hasPermission = (permission) => {
    const userPermissions = getUserPermissions();
    const userRole = localStorage.getItem('userRole') || 'manager';
    
    // Use new permission system
    return newHasPermission(userRole, userPermissions, permission);
};

// Check if user can access specific path (updated to use new system)
export const canAccessPath = (path) => {
    const userRole = localStorage.getItem('userRole') || 'manager';
    
    console.log('canAccessPath Debug:', {
        path,
        userRole,
        SUPER_ADMIN_ROLE: ROLES.SUPER_ADMIN,
        roleMatch: userRole === ROLES.SUPER_ADMIN
    });
    
    // Super admin can access everything
    if (userRole === ROLES.SUPER_ADMIN || userRole === 'super_admin') {
        console.log('Super admin access granted for:', path);
        return true;
    }
    
    // Dashboard is always accessible
    if (path === '/admin/dashboard') {
        console.log('Dashboard access granted for:', userRole);
        return true;
    }
    
    // For now, allow all authenticated users to access admin pages
    // We can add more granular permission checks later
    if (path.startsWith('/admin/')) {
        console.log('Admin area access granted for:', userRole);
        return true;
    }
    
    console.log('No access granted for:', path);
    return false;
};

// Filter menu items based on permissions (updated to use new system)
export const filterMenuItems = (menuItems, userPermissions) => {
    const userRole = localStorage.getItem('userRole') || 'manager';
    
    // Super admin sees everything
    if (userRole === ROLES.SUPER_ADMIN) {
        return menuItems;
    }
    
    return menuItems.filter(item => {
        // Dashboard is always visible
        if (item.path === '/admin/dashboard') {
            return true;
        }
        
        // Check if user has permission for this item
        if (item.path) {
            return canAccessPath(item.path);
        }
        
        // For items with subItems, filter them recursively
        if (item.subItems) {
            const filteredSubItems = item.subItems.map(subItem => {
                if (subItem.subItems) {
                    return {
                        ...subItem,
                        subItems: filterMenuItems(subItem.subItems, userPermissions)
                    };
                }
                return subItem;
            }).filter(subItem => {
                if (subItem.path) {
                    return canAccessPath(subItem.path);
                }
                return subItem.subItems && subItem.subItems.length > 0;
            });
            
            return filteredSubItems.length > 0;
        }
        
        return false;
    });
};

// Get user info from localStorage (updated to include modules)
export const getUserInfo = () => {
    try {
        return {
            id: localStorage.getItem('userId'),
            email: localStorage.getItem('userEmail'),
            name: localStorage.getItem('userName'),
            role: localStorage.getItem('userRole'),
            permissions: getUserPermissions(),
            modules: JSON.parse(localStorage.getItem('userModules') || '[]')
        };
    } catch (error) {
        console.error('Error getting user info:', error);
        return {
            id: null,
            email: null,
            name: 'Admin User',
            role: 'manager',
            permissions: [],
            modules: []
        };
    }
};
