
import { PrismaClient } from '@prisma/client';
import { addDays, setHours, setMinutes } from 'date-fns';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding NEW requested fleet (Aria, Zafiro, Pumacahua, Amazonas I)...');

    // Helper to create Operator User + Profile
    const createOperator = async (id: string, name: string, email: string) => {
        // 1. Upsert User
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password: hashedPassword,
                fullName: name,
                role: 'OPERATOR'
            }
        });

        // 2. Upsert Operator Profile
        const operator = await prisma.operator.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                id, // forcing ID for reference
                companyName: name,
                userId: user.id,
                description: `Operador premium: ${name}`
            }
        });
        return operator;
    };

    const opLuxury = await createOperator('op-luxury-exp', 'Luxury Amazon Expeditions', 'luxury@selvawasi.com');
    const opFerry = await createOperator('op-ferry-amazonas', 'Ferry Amazonas S.A.', 'ferry@selvawasi.com');
    const opTrans = await createOperator('op-trans-fluvial', 'Transportes Fluviales S.A.C.', 'trans@selvawasi.com');

    // 2. Define New Boats
    const newBoats = [
        {
            id: 'boat-aria',
            name: 'Aria Amazon',
            description: 'Diseñado por el arquitecto Jordi Puig, el Aria Amazon es un crucero de lujo hecho a medida. Ofrece una experiencia culinaria de clase mundial y vistas panorámicas de la selva.',
            capacity: 32,
            operatorId: opLuxury.id,
            features: JSON.stringify(['Suite Panorámica', 'Jacuzzi Exterior', 'Alta Cocina', 'Guías Naturalistas', 'Aire Acondicionado']),
            specs: { speed: '12 nudos', length: '45m', cabins: 16, year: 2015 }
        },
        {
            id: 'boat-zafiro',
            name: 'El Zafiro',
            description: 'Inspirado en la época del boom del caucho con un toque moderno y elegante. El Zafiro ofrece un viaje de descubrimiento con el máximo confort y un servicio excepcional.',
            capacity: 40,
            operatorId: opLuxury.id,
            features: JSON.stringify(['Spa a Bordo', 'Balcones Privados', 'Bar Lounge', 'Excursiones en lancha', 'Wifi Satelital']),
            specs: { speed: '14 nudos', length: '50m', cabins: 19, year: 2018 }
        },
        {
            id: 'boat-pumacahua',
            name: 'M/N Pumacahua',
            description: 'Transporte fluvial de carga y pasajeros, ideal para el comercio y el transporte local. Confiabilidad y capacidad para grandes cargas a lo largo del Amazonas.',
            capacity: 150,
            operatorId: opTrans.id,
            features: JSON.stringify(['Bodega de Carga', 'Hamacas', 'Camarotes Simples', 'Cafetería', 'Carga Pesada']),
            specs: { speed: '10 nudos', length: '60m', cabins: 20, year: 2010 }
        },
        {
            id: 'boat-amazonas-i',
            name: 'Amazonas I',
            description: 'Catamarán de alta velocidad diseñado para el transporte rápido de pasajeros. Conecta las principales comunidades ribereñas con eficiencia y seguridad.',
            capacity: 100,
            operatorId: opFerry.id,
            features: JSON.stringify(['Aire Acondicionado', 'Asientos Reclinables', 'TV a Bordo', 'Servicio Express', 'Baños Modernos']),
            specs: { speed: '28 nudos', length: '35m', cabins: 0, year: 2022 }
        }
    ];

    // 3. Insert Boats and Generate Schedules
    const routes = await prisma.route.findMany();

    for (const boatData of newBoats) {
        const { specs, description, ...dbData } = boatData;

        // Create/Update Boat
        const boat = await prisma.boat.upsert({
            where: { id: boatData.id },
            update: { ...dbData, features: boatData.features },
            create: { ...dbData }
        });
        console.log(`✅ Upserted boat: ${boat.name}`);

        // Create Schedules (3 days out)
        if (routes.length > 0) {
            const route = routes[Math.floor(Math.random() * routes.length)];
            const priceBase = boat.name.includes('Aria') || boat.name.includes('Zafiro') ? 3500 : 80;

            for (let i = 1; i <= 3; i++) {
                const departure = setMinutes(setHours(addDays(new Date(), i), 7 + i), 0);
                const arrival = addDays(departure, 0);
                arrival.setHours(departure.getHours() + 4);

                await prisma.schedule.create({
                    data: {
                        departureTime: departure,
                        arrivalTime: arrival,
                        boatId: boat.id,
                        routeId: route.id,
                        prices: {
                            create: {
                                amount: priceBase,
                                currency: 'PEN',
                                seatType: boat.name.includes('Aria') ? 'Suite Premium' : 'General'
                            }
                        }
                    }
                });
                console.log(`   -> Added schedule: ${departure.toISOString()} to ${route.destination}`);
            }
        }
    }

    console.log('🎉 New fleet seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
