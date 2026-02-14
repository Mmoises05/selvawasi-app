
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking Bookings...');
    const bookings = await prisma.booking.findMany({
        include: {
            user: true,
            schedule: {
                include: {
                    boat: true,
                    route: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${bookings.length} bookings.`);
    for (const b of bookings) {
        console.log(`ID: ${b.id}, User: ${b.user.email}, Boat: ${b.schedule.boat.name}, Seat: ${b.seatNumber}, Pax: ${b.passengerName || 'N/A'}, Doc: ${b.passengerDocNumber || 'N/A'}, Price: ${b.totalPrice}`);
    }

    if (bookings.length === 0) {
        console.log('No bookings found. Creation is likely failing.');
    } else {
        console.log('Bookings exist. Display logic might be the issue.');
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
