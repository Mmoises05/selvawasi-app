
import { PrismaClient } from '@prisma/client';
import { addDays, setHours, setMinutes } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding fleet schedules...');

    const boats = await prisma.boat.findMany();
    const routes = await prisma.route.findMany();

    if (boats.length === 0 || routes.length === 0) {
        console.log('❌ No boats or routes found. Please run basic seed first.');
        return;
    }

    // Define a generic price for simplicity
    const priceAmount = 150;

    for (const boat of boats) {
        console.log(`Processing boat: ${boat.name}`);

        // Create 3 schedules for the next 3 days
        for (let i = 1; i <= 3; i++) {
            const departureDate = setMinutes(setHours(addDays(new Date(), i), 8), 0); // 8:00 AM
            const arrivalDate = setMinutes(setHours(addDays(new Date(), i), 12), 0); // 12:00 PM

            // Pick a random route (or first one)
            const route = routes[i % routes.length];

            const schedule = await prisma.schedule.create({
                data: {
                    departureTime: departureDate,
                    arrivalTime: arrivalDate,
                    boatId: boat.id,
                    routeId: route.id,
                    prices: {
                        create: {
                            amount: priceAmount + (i * 10), // slight variation
                            currency: 'PEN',
                            seatType: 'General'
                        }
                    }
                }
            });
            console.log(`  -> Created schedule for ${departureDate.toISOString()} on route ${route.origin}-${route.destination}`);
        }
    }

    console.log('✅ Fleet schedules seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
