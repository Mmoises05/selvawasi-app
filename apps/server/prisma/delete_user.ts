
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'demo@selvawasi.com';
    console.log(`Deleting user with email: ${email}...`);

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.log("User not found.");
            return;
        }

        // Delete dependencies first
        console.log("Deleting related records...");

        // 1. Delete associated Restaurants (and their dishes/reviews via cascade if configured, otherwise manual)
        const restaurants = await prisma.restaurant.findMany({ where: { userId: user.id } });
        for (const r of restaurants) {
            console.log(`Deleting dependencies for restaurant ${r.name}...`);
            await prisma.dish.deleteMany({ where: { restaurantId: r.id } });
            await prisma.review.deleteMany({ where: { restaurantId: r.id } });
            await prisma.restaurantReservation.deleteMany({ where: { restaurantId: r.id } }); // Also here just in case
        }
        await prisma.restaurant.deleteMany({ where: { userId: user.id } });

        // 2. Delete Bookings/Reservations
        await prisma.booking.deleteMany({ where: { userId: user.id } });
        await prisma.restaurantReservation.deleteMany({ where: { userId: user.id } });

        // 3. Delete User
        await prisma.user.delete({
            where: { email },
        });
        console.log(`User ${user.fullName} (${user.email}) deleted successfully.`);
    } catch (error) {
        if (error.code === 'P2025') {
            console.log('User not found (already deleted).');
        } else {
            console.error('Error deleting user:', error);
        }
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
