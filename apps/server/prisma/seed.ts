import { PrismaClient } from '@prisma/client';
import { seedDatabase, cleanDatabase } from '../src/common/seeder';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting Seed Process (CLI)...');

    // 1. Clean old data
    await cleanDatabase(prisma);

    // 2. Seed new data
    await seedDatabase(prisma);

    console.log('✅ Seed Process Completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
