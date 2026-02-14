
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- TEST: Creating Booking Manually ---');

    // 1. Get a User
    const user = await prisma.user.findFirst();
    if (!user) {
        console.error('No users found.');
        return;
    }
    console.log(`Using User: ${user.email} (${user.id})`);

    // 2. Get a Schedule
    const schedule = await prisma.schedule.findFirst({
        include: { boat: true, bookings: true }
    });
    if (!schedule) {
        console.error('No schedules found.');
        return;
    }
    console.log(`Using Schedule: ${schedule.id} (Boat: ${schedule.boat.name})`);

    // 3. Simulate Payload
    const occupiedSeats = schedule.bookings.filter(b => b.status === 'CONFIRMED').length;
    const seatNumber = `${occupiedSeats + 1}`;
    console.log(`Assigning Seat: ${seatNumber}`);

    try {
        const booking = await prisma.booking.create({
            data: {
                user: { connect: { id: user.id } },
                schedule: { connect: { id: schedule.id } },
                status: 'CONFIRMED',
                totalPrice: 150.00, // Testing number input for Decimal
                seatNumber: seatNumber
            }
        });
        console.log('✅ Booking Created Successfully!');
        console.log('ID:', booking.id);
        console.log('Total Price:', booking.totalPrice);
    } catch (error) {
        console.error('❌ Booking Creation Failed:', error);
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
