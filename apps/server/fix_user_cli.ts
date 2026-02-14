import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'moises@gmail.com';
    console.log(`Fixing user: ${email}...`);

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { fullName: 'Moises' } // Force a real name
        });
        console.log("SUCCESS: User fixed.", user);
    } catch (err) {
        console.error("Error fixing user:", err);
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
