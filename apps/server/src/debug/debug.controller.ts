
import { Controller, Get, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('debug')
export class DebugController {
    private readonly logger = new Logger(DebugController.name);

    constructor(private prisma: PrismaService) { }

    @Get('seed')
    async seed() {
        this.logger.log('Starting manual seed via endpoint...');
        try {
            // 1. Create ADMIN User
            const admin = await this.prisma.user.upsert({
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

            // 2. Create/Update RESTAURANTE User
            const restaurante = await this.prisma.user.upsert({
                where: { email: 'restaurante@selvawasi.com' },
                update: { role: 'RESTAURANT_OWNER' },
                create: {
                    id: 'user-restaurante-1',
                    email: 'restaurante@selvawasi.com',
                    password: '$2b$10$kYjOmIob9cobEk41MzZ7zu8t/Y4oGOSeI8wsvXT3JeIWaLnoQkJd.',
                    fullName: 'Dueño Restaurante',
                    role: 'RESTAURANT_OWNER',
                },
            });

            // Ensure default restaurant exists
            await this.prisma.restaurant.upsert({
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

            // 3. Create/Update OPERATOR User
            const operatorUser = await this.prisma.user.upsert({
                where: { email: 'operador@selvawasi.com' },
                update: { role: 'OPERATOR' },
                create: {
                    id: 'user-operador-1',
                    email: 'operador@selvawasi.com',
                    password: '$2b$10$kYjOmIob9cobEk41MzZ7zu8t/Y4oGOSeI8wsvXT3JeIWaLnoQkJd.',
                    fullName: 'Operador Fluvial',
                    role: 'OPERATOR',
                },
            });

            // Ensure Operator Profile exists
            const operatorProfile = await this.prisma.operator.upsert({
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
                await this.prisma.boat.upsert({
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
                await this.prisma.route.upsert({
                    where: { id: r.id },
                    update: {},
                    create: {
                        id: r.id,
                        origin: r.origin,
                        destination: r.destination,
                        duration: r.duration,
                        distance: r.distance
                    }
                });
            }

            // 6. Create Schedules
            // Simplified schedule creation
            const today = new Date();
            // Ensure we have future schedules
            const schedulesData = [
                { id: 'sch-1', routeId: 'route-iquitos-nauta', boatId: 'boat-rapido-nanay', offsetHours: 24 },
                { id: 'sch-2', routeId: 'route-iquitos-yurimaguas', boatId: 'boat-don-jose', offsetHours: 48 },
            ];

            for (const s of schedulesData) {
                const dep = new Date(today);
                dep.setHours(dep.getHours() + s.offsetHours);
                const arr = new Date(dep);
                arr.setHours(arr.getHours() + 2); // Dummy duration add

                await this.prisma.schedule.upsert({
                    where: { id: s.id },
                    update: { departureTime: dep, arrivalTime: arr },
                    create: {
                        id: s.id,
                        routeId: s.routeId,
                        boatId: s.boatId,
                        departureTime: dep,
                        arrivalTime: arr
                    }
                });

                // Add Price for schedule
                await this.prisma.price.upsert({
                    where: { id: `price-${s.id}` },
                    update: {},
                    create: {
                        id: `price-${s.id}`,
                        amount: 120.00,
                        currency: 'PEN',
                        seatType: 'General',
                        scheduleId: s.id
                    }
                });
            }

            // 7. Create Ecotourism Experiences (Lodges)
            const experiencesData = [
                {
                    id: 'exp-selva-profunda',
                    title: 'EcoLodge Selva Profunda',
                    description: 'Sumérgete en el corazón de la Amazonía. Cabañas rústicas pero confortables, rodeadas de vida silvestre. Incluye caminatas nocturnas y avistamiento de aves.',
                    price: 450.00,
                    duration: '3 Días / 2 Noches',
                    location: 'Reserva Pacaya Samiria',
                    images: JSON.stringify(['/images/lodges/lodge-1.jpg', '/images/lodges/lodge-2.jpg']), // Using local images
                    operatorId: operatorProfile.id
                },
                {
                    id: 'exp-amazon-lux',
                    title: 'Amazon River Luxury',
                    description: 'Experiencia premium a orillas del río Amazonas. Disfruta de atardeceres inolvidables desde tu suite privada con todas las comodidades.',
                    price: 1200.00,
                    duration: '4 Días / 3 Noches',
                    location: 'Río Amazonas - Sector Iquitos',
                    images: JSON.stringify(['/images/lodges/lodge-2.jpg', '/images/lodges/lodge-3.jpg']),
                    operatorId: operatorProfile.id
                },
                {
                    id: 'exp-canopy-adventure',
                    title: 'Canopy Treehouse Adventure',
                    description: 'Duerme en la copa de los árboles. Una aventura única para conectar con la naturaleza desde las alturas. Puentes colgantes y tirolesa incluidos.',
                    price: 680.00,
                    duration: '3 Días / 2 Noches',
                    location: 'Selva Alta',
                    images: JSON.stringify(['/images/lodges/lodge-3.jpg', '/images/lodges/lodge-4.jpg']),
                    operatorId: operatorProfile.id
                },
                {
                    id: 'exp-laguna-mistica',
                    title: 'Refugio Laguna Mística',
                    description: 'Un santuario de paz frente a una laguna espejo. Ideal para yoga, meditación y desconexión total. Comida orgánica y excursiones en canoa.',
                    price: 550.00,
                    duration: '5 Días / 4 Noches',
                    location: 'Laguna Quistococha',
                    images: JSON.stringify(['/images/lodges/lodge-4.jpg', '/images/lodges/lodge-5.jpg']),
                    operatorId: operatorProfile.id
                }
            ];

            for (const exp of experiencesData) {
                await this.prisma.experience.upsert({
                    where: { id: exp.id },
                    update: {
                        title: exp.title,
                        description: exp.description,
                        price: exp.price,
                        duration: exp.duration,
                        location: exp.location,
                        images: exp.images,
                        operatorId: exp.operatorId
                    },
                    create: {
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

            return { success: true, message: 'Database seeded successfully with Ecotourism Lodges' };
        } catch (error) {
            this.logger.error(error);
            return { success: false, error: error.message };
        }
    }
}
