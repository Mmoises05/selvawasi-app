
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Updating user role...');

    const user = await prisma.user.update({
        where: { email: 'demo@selvawasi.com' },
        data: { role: 'RESTAURANT_OWNER' },
    });

    console.log('User updated:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
