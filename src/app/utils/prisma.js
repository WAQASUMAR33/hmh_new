import { PrismaClient } from '@prisma/client';

let prisma;

try {
    if (process.env.NODE_ENV === 'production') {
        prisma = new PrismaClient();
    } else {
        if (!global.prisma) {
            global.prisma = new PrismaClient({
                log: ['query', 'info', 'warn', 'error'], // Enable logging for debugging
            });
        }
        prisma = global.prisma;
    }
} catch (error) {
    console.error('Failed to initialize Prisma Client:', error);
    throw new Error('Prisma Client initialization failed');
}

export { prisma };