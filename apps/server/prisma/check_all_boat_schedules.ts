
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching all boats with schedule counts...');
    const boats = await prisma.boat.findMany({
        include: {
            _count: {
                select: { schedules: true }
            }
        }
    });

    console.log('--- Boat Schedule Report ---');
    boats.forEach(boat => {
        console.log(`Boat: ${boat.name} (ID: ${boat.id}) - Schedules: ${boat._count.schedules}`);
    });
    console.log('----------------------------');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
