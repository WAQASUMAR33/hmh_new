// import { NextResponse } from 'next/server';
// import { prisma } from '../../../utils/prisma';
// import bcrypt from 'bcryptjs';

// // GET user by ID
// export async function GET(request, { params }) {
//     const id = params?.id;

//     if (!id) {
//         return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
//     }

//     try {
//         const user = await prisma.user.findUnique({
//             where: { id },
//             select: {
//                 id: true,
//                 firstName: true,
//                 lastName: true,
//                 email: true,
//                 role: true,
//                 image: true,
//                 phoneNumber: true,
//                 country: true,
//                 state: true,
//                 city: true,
//                 postalCode: true,
//                 address: true,
//             },
//         });

//         if (!user) {
//             return NextResponse.json({ message: 'User not found' }, { status: 404 });
//         }

//         return NextResponse.json(user);
//     } catch (err) {
//         console.error('GET /api/user/[id] error:', err);
//         return NextResponse.json({ message: 'Server error' }, { status: 500 });
//     }
// }

// // PUT - Update user info or change password
// export async function PUT(request, { params }) {
//     const id = params?.id;
//     const data = await request.json();

//     if (!id) {
//         return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
//     }

//     try {
//         const user = await prisma.user.findUnique({ where: { id } });

//         if (!user) {
//             return NextResponse.json({ message: 'User not found' }, { status: 404 });
//         }

//         // Handle password change
//         if (data.oldPassword && data.newPassword) {
//             const isValid = await bcrypt.compare(data.oldPassword, user.password);
//             if (!isValid) {
//                 return NextResponse.json({ message: 'Old password is incorrect' }, { status: 403 });
//             }

//             const hashedPassword = await bcrypt.hash(data.newPassword, 10);
//             await prisma.user.update({
//                 where: { id },
//                 data: { password: hashedPassword },
//             });

//             return NextResponse.json({ message: 'Password updated successfully' });
//         }

//         // Update profile fields
//         const updatedUser = await prisma.user.update({
//             where: { id },
//             data: {
//                 image: data.image ?? user.image,
//                 phoneNumber: data.phoneNumber ?? user.phoneNumber,
//                 country: data.country ?? user.country,
//                 state: data.state ?? user.state,
//                 city: data.city ?? user.city,
//                 address: data.address ?? user.address,
//                 postalCode: data.postalCode ?? user.postalCode,
//             },
//         });

//         return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser });
//     } catch (err) {
//         console.error('PUT /api/user/[id] error:', err);
//         return NextResponse.json({ message: 'Server error' }, { status: 500 });
//     }
// }

import { NextResponse } from 'next/server';
import { prisma } from '../../../utils/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Validation schema for PUT requests
const updateSchema = z.object({
    image: z.string().optional(),
    phoneNumber: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    postalCode: z.string().optional(),
    oldPassword: z.string().optional(),
    newPassword: z.string().min(8).optional(),
});

// GET user by ID
export async function GET(request, { params }) {
    const { id } = await params; // Await params to resolve the Promise

    if (!id) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                image: true,
                phoneNumber: true,
                country: true,
                state: true,
                city: true,
                postalCode: true,
                address: true,
            },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User fetched successfully', data: user });
    } catch (err) {
        console.error('GET /api/user/[id] error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// PUT - Update user info or change password
export async function PUT(request, { params }) {
    const { id } = await params; // Await params to resolve the Promise
    const data = await request.json();

    if (!id) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Validate input
    const result = updateSchema.safeParse(data);
    if (!result.success) {
        return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Handle password change
        if (data.oldPassword && data.newPassword) {
            const isValid = await bcrypt.compare(data.oldPassword, user.password);
            if (!isValid) {
                return NextResponse.json({ message: 'Old password is incorrect' }, { status: 403 });
            }

            const hashedPassword = await bcrypt.hash(data.newPassword, 10);
            const updatedUser = await prisma.user.update({
                where: { id },
                data: { password: hashedPassword },
                select: { id: true, updatedAt: true },
            });

            return NextResponse.json({ message: 'Password updated successfully', data: updatedUser });
        }

        // Update profile fields
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                image: data.image ?? user.image,
                phoneNumber: data.phoneNumber ?? user.phoneNumber,
                country: data.country ?? user.country,
                state: data.state ?? user.state,
                city: data.city ?? user.city,
                address: data.address ?? user.address,
                postalCode: data.postalCode ?? user.postalCode,
            },
            select: {
                id: true,
                image: true,
                phoneNumber: true,
                country: true,
                state: true,
                city: true,
                postalCode: true,
                address: true,
                updatedAt: true,
            },
        });

        return NextResponse.json({ message: 'Profile updated successfully', data: updatedUser });
    } catch (err) {
        console.error('PUT /api/user/[id] error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}