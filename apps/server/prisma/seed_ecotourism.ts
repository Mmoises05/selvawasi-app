
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌿 Seeding Ecotourism Experiences...');

    // 1. Ensure we have an Operator for Experiences
    const email = 'eco@selvawasi.com';
    let operator = await prisma.operator.findFirst({
        where: { user: { email } }
    });

    if (!operator) {
        console.log('Creating Eco Operator...');
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password: hashedPassword,
                fullName: 'EcoAmazonas Guide',
                role: 'OPERATOR'
            }
        });

        operator = await prisma.operator.create({
            data: {
                companyName: 'EcoAmazonas Expeditions',
                description: 'Expertos en turismo sostenible y contacto con la naturaleza.',
                userId: user.id
            }
        });
    }

    const experiences = [
        {
            title: 'Isla de los Monos',
            description: 'Visita este santuario de rescate donde podrás interactuar con diversas especies de primates en su hábitat natural. Una experiencia enternecedora y educativa para toda la familia.',
            price: 120.00,
            duration: '4 Horas',
            location: 'Río Amazonas (30km de Iquitos)',
            images: JSON.stringify(['https://www.peru.travel/Contenido/Atractivo/Imagen/en/189/1.1/Principal/isla-de-los-monos.jpg']),
            operatorId: operator.id
        },
        {
            title: 'Caminata Nocturna en la Selva',
            description: 'Adéntrate en la selva bajo la luz de la luna. Descubre la fascinante vida nocturna del Amazonas: insectos exóticos, ranas coloridas y quizás algún mamífero escurridizo.',
            price: 85.00,
            duration: '3 Horas',
            location: 'Reserva Allpahuayo Mishana',
            images: JSON.stringify(['https://www.rainforestcruises.com/wp-content/uploads/2018/06/jungle-night-walk-amazon.jpg']),
            operatorId: operator.id
        },
        {
            title: 'Amazonas Lodge Premium - 3D/2N',
            description: 'Desconecta del mundo en nuestro Lodge de lujo. Incluye alimentación completa, excursiones en canoa, búsqueda de delfines rosados y visitas a comunidades nativas.',
            price: 850.00,
            duration: '3 Días / 2 Noches',
            location: 'Río Yanayacu',
            images: JSON.stringify(['https://cf.bstatic.com/xdata/images/hotel/max1024x768/275267154.jpg?k=5c30656113824f20387406674393693245c38622146864817478052168936374&o=&hp=1']),
            operatorId: operator.id
        },
        {
            title: 'Pesca de Pirañas y Atardecer',
            description: 'Una aventura clásica. Aprende las técnicas locales para pescar pirañas y termina el día contemplando un atardecer inolvidable sobre el río Amazonas.',
            price: 60.00,
            duration: '5 Horas',
            location: 'Lago Quistococha',
            images: JSON.stringify(['https://www.rainforestcruises.com/wp-content/uploads/2016/09/piranha-fishing-amazon.jpg']),
            operatorId: operator.id
        }
    ];

    for (const exp of experiences) {
        // Check if exists by title to avoid dupes
        const exists = await prisma.experience.findFirst({ where: { title: exp.title } });
        if (!exists) {
            await prisma.experience.create({ data: exp });
            console.log(`✅ Created: ${exp.title}`);
        } else {
            console.log(`Skipping ${exp.title} (Already exists)`);
        }
    }

    console.log('🎉 Ecotourism Seeding Complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
