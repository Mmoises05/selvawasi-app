import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Ecotourism Data (Fixing Images)...');

    // 1. Ensure Operator User exists
    let user = await prisma.user.findFirst({ where: { email: 'operador@selvawasi.com' } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'operador@selvawasi.com',
                password: 'password123',
                role: 'OPERATOR',
                fullName: 'Operador Ecoturismo'
            }
        });
    }

    // 2. Ensure Operator Profile exists
    let operator = await prisma.operator.findUnique({ where: { userId: user.id } });
    if (!operator) {
        operator = await prisma.operator.create({
            data: {
                userId: user.id,
                companyName: 'EcoAmazonas Expeditions'
            }
        });
    } else {
        if (!operator.companyName) {
            await prisma.operator.update({
                where: { id: operator.id },
                data: { companyName: 'EcoAmazonas Expeditions' }
            });
        }
    }

    // 3. Define Experiences with REAL IMAGES found in public/images
    const experiences = [
        {
            title: 'Isla de los Monos',
            description: 'Visita este centro de rescate donde podrás interactuar con hasta 7 especies de monos en libertad. Una experiencia educativa y conmovedora.',
            location: 'Río Amazonas (30km de Iquitos)',
            price: 120.00,
            duration: '4 Horas',
            // Using 'hanging-monkey.png' which exists
            images: JSON.stringify(['/images/hanging-monkey.png', '/images/vector-monkey.png']),
            operatorId: operator.id
        },
        {
            title: 'Caminata Nocturna en la Selva',
            description: 'Descubre los misterios de la amazonía bajo la luz de la luna. Avistamiento de insectos, anfibios y reptiles en su hábitat natural.',
            location: 'Reserva Allpahuayo Mishana',
            price: 85.00,
            duration: '3 Horas',
            // Using 'boulevard-noche.jpg' which exists
            images: JSON.stringify(['/images/boulevard-noche.jpg', '/images/categories/transporte.jpg']),
            operatorId: operator.id
        },
        {
            title: 'Amazonas Lodge Premium - 3D/2N',
            description: 'Inmersión total en la selva con todas las comodidades. Incluye navegación, búsqueda de delfines rosados y pernocte en bungalow privado.',
            location: 'Río Yanayacu',
            price: 850.00,
            duration: '3 Días / 2 Noches',
            // Using 'vista-al-rio.jpg' which exists
            images: JSON.stringify(['/images/vista-al-rio.jpg', '/images/iquitos-river.jpg']),
            operatorId: operator.id
        }
    ];

    // 4. Upsert Experiences
    for (const exp of experiences) {
        const existing = await prisma.experience.findFirst({ where: { title: exp.title } });
        if (existing) {
            await prisma.experience.update({
                where: { id: existing.id },
                data: exp
            });
            console.log(`Updated (Fixed Images): ${exp.title}`);
        } else {
            await prisma.experience.create({
                data: exp
            });
            console.log(`Created (Fixed Images): ${exp.title}`);
        }
    }

    console.log('Ecotourism Seed Completed Successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
