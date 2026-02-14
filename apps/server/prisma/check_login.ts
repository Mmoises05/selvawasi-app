
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'demo@selvawasi.com';
    const password = 'password123';

    console.log(`Checking login for ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log('User not found!');
        return;
    }

    console.log('User found:', { id: user.id, email: user.email, role: user.role, passwordHash: user.password });

    const isMatch = await bcrypt.compare(password, user.password);

    console.log(`Password match for '${password}': ${isMatch}`);

    if (isMatch) {
        console.log("LOGIN SHOULD SUCCESS");
    } else {
        console.log("LOGIN FAILURE - Hash mismatch");
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
