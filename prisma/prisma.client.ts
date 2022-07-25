import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
const prisma = global.prisma || new PrismaClient({errorFormat: 'minimal'});

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;