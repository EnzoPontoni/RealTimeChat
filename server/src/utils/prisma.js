const { PrismaClient } = require('@prisma/client');

// Prisma Client Singleton para evitar múltiplas instâncias
// Especialmente importante em ambientes serverless
const prismaClientSingleton = () => {
  return new PrismaClient();
};

const globalForPrisma = global;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
