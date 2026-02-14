
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching first boat with schedules...');
    const boat = await prisma.boat.findFirst({
        include: {
            operator: true,
            schedules: {
                include: {
                    route: true,
                    prices: true
                }
            }
        }
    });

    if (boat) {
        console.log(`Boat found: ${boat.name}`);
        console.log(`Schedules count: ${boat.schedules.length}`);
        if (boat.schedules.length > 0) {
            console.log('First schedule:', JSON.stringify(boat.schedules[0], null, 2));
        } else {
            console.log('No schedules found for this boat.');
        }
    } else {
        console.log('No boats found.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
