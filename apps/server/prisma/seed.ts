
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Create ADMIN User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@selvawasi.com' },
        update: { role: 'ADMIN' },
        create: {
            id: 'user-admin-1',
            email: 'admin@selvawasi.com',
            password: '$2b$10$kYjOmIob9cobEk41MzZ7zu8t/Y4oGOSeI8wsvXT3JeIWaLnoQkJd.', // 'SelvaWasi2024!'
            fullName: 'Administrador Principal',
            role: 'ADMIN',
        },
    });

    console.log({ admin });

    // 2. Create/Update RESTAURANTE User (Restaurant Owner)
    const restaurante = await prisma.user.upsert({
        where: { email: 'restaurante@selvawasi.com' },
        update: { role: 'RESTAURANT_OWNER' },
        create: {
            id: 'user-restaurante-1',
            email: 'restaurante@selvawasi.com',
            password: '$2b$10$kYjOmIob9cobEk41MzZ7zu8t/Y4oGOSeI8wsvXT3JeIWaLnoQkJd.', // 'SelvaWasi2024!'
            fullName: 'Dueño Restaurante',
            role: 'RESTAURANT_OWNER',
        },
    });

    console.log({ restaurante });

    // Ensure default restaurant exists for Restaurante User
    const restaurant = await prisma.restaurant.upsert({
        where: { userId: restaurante.id },
        update: {},
        create: {
            id: 'restaurant-selva-wasi',
            userId: restaurante.id,
            name: 'Selva Wasi Experiencia',
            description: 'Cocina amazónica gourmet.',
            address: 'Rio Itaya, Iquitos',
        },
    });

    console.log({ restaurant });

    // 3. Create/Update OPERATOR User (Transport Operator)
    const operatorUser = await prisma.user.upsert({
        where: { email: 'operador@selvawasi.com' },
        update: { role: 'OPERATOR' },
        create: {
            id: 'user-operador-1',
            email: 'operador@selvawasi.com',
            password: '$2b$10$kYjOmIob9cobEk41MzZ7zu8t/Y4oGOSeI8wsvXT3JeIWaLnoQkJd.', // 'SelvaWasi2024!'
            fullName: 'Operador Fluvial',
            role: 'OPERATOR',
        },
    });

    console.log({ operatorUser });

    // Ensure Operator Profile exists
    const operatorProfile = await prisma.operator.upsert({
        where: { userId: operatorUser.id },
        update: {},
        create: {
            id: 'operator-amazon-tours',
            userId: operatorUser.id,
            companyName: 'Amazon River Tours',
            description: 'Operador líder en transporte fluvial y turístico.',
        },
    });

    // 4. Create Boats
    const boatsData = [
        { id: 'boat-delfin-iii', name: 'Delfín III', capacity: 44, type: 'Luxury' },
        { id: 'boat-don-jose', name: 'Don José', capacity: 150, type: 'Cargo/Passenger' },
        { id: 'boat-rapido-nanay', name: 'Rápido Nanay', capacity: 60, type: 'Speedboat' },
        { id: 'boat-el-gran-delfin', name: 'El Gran Delfín', capacity: 50, type: 'Luxury' },
    ];

    for (const b of boatsData) {
        await prisma.boat.upsert({
            where: { id: b.id },
            update: {},
            create: {
                id: b.id,
                name: b.name,
                capacity: b.capacity,
                operatorId: operatorProfile.id,
            }
        });
    }

    // 5. Create Routes
    const routesData = [
        { id: 'route-iquitos-nauta', origin: 'Iquitos', destination: 'Nauta', duration: 120, distance: 100 },
        { id: 'route-iquitos-yurimaguas', origin: 'Iquitos', destination: 'Yurimaguas', duration: 720, distance: 400 },
        { id: 'route-iquitos-frontera', origin: 'Iquitos', destination: 'Santa Rosa (Frontera)', duration: 600, distance: 350 },
    ];

    for (const r of routesData) {
        await prisma.route.upsert({
            where: { id: r.id },
            update: {},
            create: {
                id: r.id,
                origin: r.origin,
                destination: r.destination,
                duration: r.duration, // minutes
                distance: r.distance
            }
        });
    }

    // 6. Create Schedules (Itineraries)
    // Clear existing schedules for these boats to avoid duplicates/clutter if re-seeding differently, 
    // strictly speaking upsert is safer but schedule IDs are tricky. 
    // For now, we'll just create if not exists using specific IDs.

    const today = new Date();
    today.setHours(8, 0, 0, 0); // 8:00 AM today

    const schedulesData = [
        { id: 'sch-1', routeId: 'route-iquitos-nauta', boatId: 'boat-rapido-nanay', depOffset: 0, arrOffset: 2 }, // Today 8am
        { id: 'sch-2', routeId: 'route-iquitos-yurimaguas', boatId: 'boat-don-jose', depOffset: 24, arrOffset: 36 }, // Tomorrow 8am
        { id: 'sch-3', routeId: 'route-iquitos-frontera', boatId: 'boat-delfin-iii', depOffset: 48, arrOffset: 58 }, // Day after tomorrow
        { id: 'sch-4', routeId: 'route-iquitos-nauta', boatId: 'boat-rapido-nanay', depOffset: 4, arrOffset: 6 }, // Today 12pm
    ];

    for (const s of schedulesData) {
        const dep = new Date(today);
        dep.setHours(dep.getHours() + s.depOffset);

        const arr = new Date(dep);
        arr.setHours(arr.getHours() + (s.arrOffset - s.depOffset));

        await prisma.schedule.upsert({
            where: { id: s.id },
            update: {
                departureTime: dep,
                arrivalTime: arr
            },
            create: {
                id: s.id,
                routeId: s.routeId,
                boatId: s.boatId,
                departureTime: dep,
                arrivalTime: arr
            }
        });

        // Add Price for schedule
        await prisma.price.upsert({
            where: { id: `price-${s.id}` },
            update: {},
            create: {
                id: `price-${s.id}`,
                amount: 120.00, // Dummy price
                currency: 'PEN',
                seatType: 'General',
                scheduleId: s.id
            }
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
