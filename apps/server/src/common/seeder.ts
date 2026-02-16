import { PrismaClient } from '@prisma/client';

export async function cleanDatabase(prisma: PrismaClient) {
    console.log('🧹 Limpiando base de datos (Clean Slate)...');

    // Delete in reverse order of dependencies to avoid Foreign Key constraints
    await prisma.restaurantReservation.deleteMany();
    await prisma.review.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.price.deleteMany();
    await prisma.schedule.deleteMany();
    await prisma.dish.deleteMany();
    await prisma.experience.deleteMany(); // Lodges
    await prisma.boat.deleteMany();
    await prisma.route.deleteMany();

    // Profiles
    await prisma.restaurant.deleteMany();
    await prisma.operator.deleteMany();

    // Users (Must be last)
    await prisma.user.deleteMany();

    console.log('✨ Base de datos limpia.');
}

export async function seedDatabase(prisma: PrismaClient) {
    console.log('🌱 Sembrando datos (Single Source of Truth)...');

    // 1. Create ADMIN User
    const admin = await prisma.user.create({
        data: {
            id: 'user-admin-1',
            email: 'admin@selvawasi.com',
            password: '$2b$10$kYjOmIob9cobEk41MzZ7zu8t/Y4oGOSeI8wsvXT3JeIWaLnoQkJd.', // 'SelvaWasi2024!'
            fullName: 'Administrador Principal',
            role: 'ADMIN',
        },
    });
    console.log('👤 Admin creado.');

    // 2. Create RESTAURANTE User
    const restaurante = await prisma.user.create({
        data: {
            id: 'user-restaurante-1',
            email: 'restaurante@selvawasi.com',
            password: '$2b$10$kYjOmIob9cobEk41MzZ7zu8t/Y4oGOSeI8wsvXT3JeIWaLnoQkJd.',
            fullName: 'Dueño Restaurante',
            role: 'RESTAURANT_OWNER',
        },
    });

    await prisma.restaurant.create({
        data: {
            id: 'restaurant-selva-wasi',
            userId: restaurante.id,
            name: 'Selva Wasi Experiencia',
            description: 'Cocina amazónica gourmet.',
            address: 'Rio Itaya, Iquitos',
        },
    });
    console.log('🍽️ Restaurante creado.');

    // 3. Create OPERATOR User
    const operatorUser = await prisma.user.create({
        data: {
            id: 'user-operador-1',
            email: 'operador@selvawasi.com',
            password: '$2b$10$kYjOmIob9cobEk41MzZ7zu8t/Y4oGOSeI8wsvXT3JeIWaLnoQkJd.',
            fullName: 'Operador Fluvial',
            role: 'OPERATOR',
        },
    });

    const operatorProfile = await prisma.operator.create({
        data: {
            id: 'operator-amazon-tours',
            userId: operatorUser.id,
            companyName: 'Amazon River Tours',
            description: 'Operador líder en transporte fluvial y turístico.',
        },
    });
    console.log('🚤 Operador creado.');

    // 4. Create Boats
    const boatsData = [
        { id: 'boat-delfin-iii', name: 'Delfín III', capacity: 44, type: 'Luxury' },
        { id: 'boat-don-jose', name: 'Don José', capacity: 150, type: 'Cargo/Passenger' },
        { id: 'boat-rapido-nanay', name: 'Rápido Nanay', capacity: 60, type: 'Speedboat' },
        { id: 'boat-el-gran-delfin', name: 'El Gran Delfín', capacity: 50, type: 'Luxury' },
        { id: 'boat-amazonas-i', name: 'Amazonas I', capacity: 100, type: 'Passenger' },
        { id: 'boat-pumacahua', name: 'Pumacahua', capacity: 120, type: 'Passenger' },
        { id: 'boat-el-zafiro', name: 'El Zafiro', capacity: 40, type: 'Luxury' },
        { id: 'boat-aria-amazon', name: 'Aria Amazon', capacity: 32, type: 'Luxury' },
    ];

    for (const b of boatsData) {
        await prisma.boat.create({
            data: {
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
        await prisma.route.create({
            data: {
                id: r.id,
                origin: r.origin,
                destination: r.destination,
                duration: r.duration,
                distance: r.distance
            }
        });
    }

    // 6. Create Schedules
    const today = new Date();
    today.setHours(8, 0, 0, 0);

    const schedulesData = [
        { id: 'sch-1', routeId: 'route-iquitos-nauta', boatId: 'boat-rapido-nanay', depOffset: 0, arrOffset: 2 },
        { id: 'sch-2', routeId: 'route-iquitos-yurimaguas', boatId: 'boat-don-jose', depOffset: 24, arrOffset: 36 },
        { id: 'sch-3', routeId: 'route-iquitos-frontera', boatId: 'boat-delfin-iii', depOffset: 48, arrOffset: 58 },
        { id: 'sch-4', routeId: 'route-iquitos-nauta', boatId: 'boat-rapido-nanay', depOffset: 4, arrOffset: 6 },
    ];

    for (const s of schedulesData) {
        const dep = new Date(today);
        dep.setHours(dep.getHours() + s.depOffset);
        const arr = new Date(dep);
        arr.setHours(arr.getHours() + (s.arrOffset - s.depOffset));

        await prisma.schedule.create({
            data: {
                id: s.id,
                routeId: s.routeId,
                boatId: s.boatId,
                departureTime: dep,
                arrivalTime: arr,
            }
        });

        await prisma.price.create({
            data: {
                id: `price-${s.id}`,
                amount: 120.00,
                currency: 'PEN',
                seatType: 'General',
                scheduleId: s.id
            }
        });
    }

    // 7. Create Ecotourism Experiences (Lodges)
    // Using verified "lodge-1.jpg" paths
    const experiencesData = [
        {
            id: 'exp-selva-profunda',
            title: 'EcoLodge Selva Profunda',
            description: 'Sumérgete en el corazón de la Amazonía. Cabañas rústicas pero confortables.',
            price: 450.00,
            duration: '3 Días / 2 Noches',
            location: 'Reserva Pacaya Samiria',
            images: JSON.stringify(['/images/lodges/lodge-1.jpg', '/images/lodges/lodge-2.jpg']),
            operatorId: operatorProfile.id
        },
        {
            id: 'exp-amazon-lux',
            title: 'Amazon River Luxury',
            description: 'Experiencia premium a orillas del río Amazonas. Suites privadas.',
            price: 1200.00,
            duration: '4 Días / 3 Noches',
            location: 'Río Amazonas - Sector Iquitos',
            images: JSON.stringify(['/images/lodges/lodge-2.jpg', '/images/lodges/lodge-3.jpg']),
            operatorId: operatorProfile.id
        },
        {
            id: 'exp-canopy-adventure',
            title: 'Canopy Treehouse Adventure',
            description: 'Duerme en la copa de los árboles. Una aventura única.',
            price: 680.00,
            duration: '3 Días / 2 Noches',
            location: 'Selva Alta',
            images: JSON.stringify(['/images/lodges/lodge-3.jpg', '/images/lodges/lodge-4.jpg']),
            operatorId: operatorProfile.id
        },
        {
            id: 'exp-laguna-mistica',
            title: 'Refugio Laguna Mística',
            description: 'Un santuario de paz frente a una laguna espejo.',
            price: 550.00,
            duration: '5 Días / 4 Noches',
            location: 'Laguna Quistococha',
            images: JSON.stringify(['/images/lodges/lodge-4.jpg', '/images/lodges/lodge-5.jpg']),
            operatorId: operatorProfile.id
        }
    ];

    for (const exp of experiencesData) {
        await prisma.experience.create({
            data: {
                id: exp.id,
                title: exp.title,
                description: exp.description,
                price: exp.price,
                duration: exp.duration,
                location: exp.location,
                images: exp.images,
                operatorId: exp.operatorId
            }
        });
    }

    console.log('✅ Base de datos sembrada correctamente.');
}
