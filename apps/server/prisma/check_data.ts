
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking database content...');

    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users.`);
    users.forEach(u => console.log(` - ${u.fullName} (${u.role})`));

    const restaurants = await prisma.restaurant.findMany();
    console.log(`Found ${restaurants.length} restaurants.`);
    restaurants.forEach(r => console.log(` - ${r.name} (Owner: ${r.userId})`));

    const boats = await prisma.boat.findMany();
    console.log(`Found ${boats.length} boats.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
