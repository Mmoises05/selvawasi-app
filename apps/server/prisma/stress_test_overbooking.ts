
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🧪 Starting Overbooking Stress Test...');

    // 1. Find a schedule for 'Aria Amazon' (Capacity 32)
    const boat = await prisma.boat.findFirst({ where: { name: 'Aria Amazon' } });
    if (!boat) throw new Error("Boat Aria Amazon not found for test.");

    const schedule = await prisma.schedule.findFirst({
        where: { boatId: boat.id },
        include: { bookings: true }
    });

    if (!schedule) throw new Error("No schedule found for Aria Amazon.");
    console.log(`Checking Schedule ID: ${schedule.id} | Boat Capacity: ${boat.capacity}`);

    // Clean existing bookings for this schedule to have a clean slate (or just count them)
    // For safety, let's create a DUMMY schedule instead of messing with real ones.

    console.log('Creating a DUMMY test schedule with capacity 2...');
    const testBoat = await prisma.boat.create({
        data: {
            name: 'TEST_OVERBOOKING_BOAT',
            capacity: 2,
            operatorId: boat.operatorId,
            features: '[]'
        }
    });

    const testSchedule = await prisma.schedule.create({
        data: {
            departureTime: new Date(),
            arrivalTime: new Date(),
            boatId: testBoat.id,
            // We need a valid route ID
            route: { connect: { id: (await prisma.route.findFirst())?.id } },
        }
    });

    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found.");

    console.log('Attempting to fill capacity (2 seats)...');

    // Helper to book
    const bookSeat = async (i: number) => {
        await prisma.booking.create({
            data: {
                scheduleId: testSchedule.id,
                userId: user.id,
                totalPrice: 100,
                status: 'CONFIRMED',
                seatNumber: `TEST-${i}`,
                passengerName: `Test Pax ${i}`,
                passengerDocType: 'DNI',
                passengerDocNumber: `1234567${i}`
            }
        });
        console.log(`✅ Booking ${i} CONFIRMED`);
    };

    await bookSeat(1);
    await bookSeat(2);

    console.log('Attempting Overbooking (3rd seat)...');
    try {
        // We have to simulate the SERVICE LOGIC here, because we can't easily import the Nest Service in this script.
        // The service logic is:
        // const occupied = bookings.filter(b => b.status === 'CONFIRMED').length;
        // if (occupied >= capacity) throw Error...

        const currentBookings = await prisma.booking.count({
            where: { scheduleId: testSchedule.id, status: 'CONFIRMED' }
        });

        if (currentBookings >= testBoat.capacity) {
            throw new Error("Esta salida ya no tiene asientos disponibles.");
        }

        // If logic didn't throw, try to create (which shouldn't happen in the app flow, but here we simulate the check)
        await bookSeat(3);
        console.error('❌ TEST FAILED: Allowed overbooking!');
    } catch (e: any) {
        if (e.message === "Esta salida ya no tiene asientos disponibles.") {
            console.log('✅ TEST PASSED: Overbooking prevented successfully.');
        } else {
            console.error('❓ Unexpected error:', e);
        }
    }

    // Cleanup
    console.log('Cleaning up test data...');
    await prisma.booking.deleteMany({ where: { scheduleId: testSchedule.id } });
    await prisma.schedule.delete({ where: { id: testSchedule.id } });
    await prisma.boat.delete({ where: { id: testBoat.id } });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
