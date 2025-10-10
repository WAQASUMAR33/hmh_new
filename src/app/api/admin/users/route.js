import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// GET - Fetch all admin users
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const role = searchParams.get('role') || 'all';

        // If requesting advertisers or publishers, return those users directly
        if (role === 'ADVERTISER' || role === 'PUBLISHER') {
            const userWhere = {
                role,
            };
            if (search) {
                userWhere.OR = [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { username: { contains: search, mode: 'insensitive' } }
                ];
            }

            const data = await prisma.user.findMany({
                where: userWhere,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    username: true,
                    phoneNumber: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    isActivated: true,
                    isSuspended: true,
                    suspensionReason: true,
                    suspensionDate: true,
                    companyLegalName: true,
                    brandName: true,
                    website: true,
                    country: true,
                    state: true,
                    city: true,
                    _count: {
                        select: {
                            advertiserBookings: true,
                            publisherBookings: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            return NextResponse.json({ success: true, data });
        }

        // Build where clause for admin users
        const where = { role: 'ADMIN' };

        // Add search filter
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { username: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Add role filter (for future admin role subtypes)
        if (role !== 'all') {
            // For now, we only have ADMIN role, but this can be extended
            // You could add admin role subtypes in the future
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                username: true,
                phoneNumber: true,
                role: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                isActivated: true,
                isActivatedDate: true,
                companyLegalName: true,
                website: true,
                country: true,
                state: true,
                city: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Transform data to match frontend expectations
        const transformedUsers = users.map(user => {
            // Parse role, permissions, and modules from termsAndConditions field
            let userRole = 'manager'; // Default role
            let permissions = [];
            let modules = [];
            
            try {
                if (user.termsAndConditions) {
                    const parsed = JSON.parse(user.termsAndConditions);
                    
                    // Handle both old format (just permissions array) and new format (object with role, permissions, and modules)
                    if (Array.isArray(parsed)) {
                        // Old format - just permissions array
                        permissions = parsed;
                        // Determine role based on permissions
                        if (permissions.includes('all')) {
                            userRole = 'super_admin';
                        } else if (permissions.length > 0) {
                            userRole = 'admin';
                        }
                    } else if (parsed && typeof parsed === 'object') {
                        // New format - object with role, permissions, and modules
                        userRole = parsed.role || 'manager';
                        // Map super_admin back to superadmin for frontend
                        if (userRole === 'super_admin') {
                            userRole = 'superadmin';
                        }
                        permissions = parsed.permissions || [];
                        modules = parsed.modules || [];
                    }
                }
            } catch (error) {
                console.error('Error parsing role, permissions, and modules for user:', user.id, error);
                userRole = 'manager';
                permissions = [];
                modules = [];
            }
            
            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phoneNumber || '',
                role: userRole,
                permissions: permissions,
                modules: modules,
                createdDate: user.createdAt.toISOString().split('T')[0],
                lastActive: user.updatedAt.toISOString().split('T')[0],
                status: user.isActivated ? 'active' : 'suspended',
                emailVerified: user.emailVerified,
                company: user.companyLegalName || '',
                website: user.website || '',
                location: [user.city, user.state, user.country].filter(Boolean).join(', ')
            };
        });

        return NextResponse.json({ success: true, users: transformedUsers });

    } catch (error) {
        console.error('Error fetching admin users:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch admin users' },
            { status: 500 }
        );
    }
}

// POST - Create new admin user
export async function POST(request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, username, phone, password, role, permissions, modules } = body;

        console.log('Creating admin user with data:', {
            firstName, lastName, email, username, phone, role, permissions, modules
        });

        // Validate required fields
        if (!firstName || !lastName || !email || !username || !password) {
            console.log('Validation failed - missing required fields');
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'User with this email or username already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create admin user
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                username,
                password: hashedPassword,
                phoneNumber: phone,
                role: 'ADMIN', // All admin users get ADMIN role in database
                emailVerified: true, // Admin users are auto-verified
                isActivated: 1,
                isActivatedDate: new Date(),
                // Store role, permissions, and modules as JSON in a field
                termsAndConditions: JSON.stringify({
                    role: role === 'superadmin' ? 'super_admin' : role, // Map superadmin to super_admin
                    permissions: permissions || [],
                    modules: modules || []
                })
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                username: true,
                phoneNumber: true,
                role: true,
                createdAt: true,
                isActivated: true
            }
        });

        return NextResponse.json({
            success: true,
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phone: newUser.phoneNumber || '',
                role: newUser.role.toLowerCase(),
                permissions: permissions || [],
                createdDate: newUser.createdAt.toISOString().split('T')[0],
                lastActive: newUser.createdAt.toISOString().split('T')[0],
                status: newUser.isActivated ? 'active' : 'suspended'
            }
        });

    } catch (error) {
        console.error('Error creating admin user:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        return NextResponse.json(
            { success: false, error: `Failed to create admin user: ${error.message}` },
            { status: 500 }
        );
    }
}

// PUT - Update admin user
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, firstName, lastName, email, username, phone, role, permissions, modules, password } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if email/username is taken by another user
        if (email !== existingUser.email || username !== existingUser.username) {
            const duplicateUser = await prisma.user.findFirst({
                where: {
                    AND: [
                        { id: { not: id } },
                        {
                            OR: [
                                { email: email },
                                { username: username }
                            ]
                        }
                    ]
                }
            });

            if (duplicateUser) {
                return NextResponse.json(
                    { success: false, error: 'Email or username already taken by another user' },
                    { status: 400 }
                );
            }
        }

        // Prepare update data
        const updateData = {
            firstName,
            lastName,
            email,
            username,
            phoneNumber: phone,
            termsAndConditions: JSON.stringify({
                role: role === 'superadmin' ? 'super_admin' : role, // Map superadmin to super_admin
                permissions: permissions || [],
                modules: modules || []
            })
        };

        // Hash new password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 12);
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                username: true,
                phoneNumber: true,
                role: true,
                updatedAt: true,
                isActivated: true
            }
        });

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                phone: updatedUser.phoneNumber || '',
                role: updatedUser.role.toLowerCase(),
                permissions: permissions || [],
                lastActive: updatedUser.updatedAt.toISOString().split('T')[0],
                status: updatedUser.isActivated ? 'active' : 'suspended'
            }
        });

    } catch (error) {
        console.error('Error updating admin user:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update admin user' },
            { status: 500 }
        );
    }
}

// DELETE - Delete admin user
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Prevent deletion of super admin (you can add this logic based on your requirements)
        // For now, we'll allow deletion of any admin user

        // Delete user
        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Admin user deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting admin user:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete admin user' },
            { status: 500 }
        );
    }
}

// Helper function to get default permissions based on role
function getDefaultPermissions(role) {
    switch (role) {
        case 'ADMIN':
            return ['user_management', 'publisher_management', 'advertiser_management', 'reports', 'system_settings'];
        default:
            return [];
    }
}