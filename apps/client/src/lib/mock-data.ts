// MOCK DATA RICH (PHASE B)
// Datasets expandidos para simulación realista de scroll, filtros y carga.

export const mockBoats = [
    {
        id: "1",
        name: "El Gran Delfín",
        description: "Navega con lujo por el río Amazonas. Aire acondicionado, suites privadas y chef a bordo. La experiencia definitiva de crucero amazónico.",
        capacity: 40,
        operator: { fullName: "Amazon Tours Deluxe" },
        status: "available",
        image: "https://images.unsplash.com/photo-1544642005-2b444747eb44?auto=format&fit=crop&q=80&w=1000",
        features: ["Aire Acondicionado", "Wifi Starlink", "Restaurante", "Bar"]
    },
    {
        id: "2",
        name: "Rápido Nanay IV",
        description: "Velocidad y eficiencia para llegar a tu destino. Ideal para viajeros que valoran el tiempo. Conexión Iquitos - Santa Rosa.",
        capacity: 15,
        operator: { fullName: "Transportes Rápidos S.A." },
        status: "available",
        image: "https://images.unsplash.com/photo-1566376547671-558694d76458?auto=format&fit=crop&q=80&w=1000",
        features: ["Velocidad Alta", "Chalecos Vida", "Refrigerio"]
    },
    {
        id: "3",
        name: "Reina de la Selva",
        description: "Experiencia tradicional en madera con hamacas y vistas panorámicas. Viaja como un local disfrutando de la brisa del río.",
        capacity: 60,
        operator: { fullName: "Selva Viajes Tradicionales" },
        status: "maintenance",
        image: "https://images.unsplash.com/photo-1510935570176-904d9c7e0c4f?auto=format&fit=crop&q=80&w=1000",
        features: ["Hamacas", "Carga", "Económico"]
    },
    {
        id: "4",
        name: "Aqua Expedition",
        description: "Diseño moderno y confort superior. Especializado en tours de avistamiento de fauna y fotografía.",
        capacity: 25,
        operator: { fullName: "EcoRiver Expeditions" },
        status: "available",
        image: "https://images.unsplash.com/photo-1559981421-3e0c0d7cfe19?auto=format&fit=crop&q=80&w=1000",
        features: ["Guía Bilingüe", "Binoculares", "Silencioso"]
    },
    {
        id: "5",
        name: "Don José II",
        description: "Motonave de carga y pasajeros. La arteria vital del comercio fluvial. Ideal para mochileros con presupuesto ajustado.",
        capacity: 120,
        operator: { fullName: "Naviera Hermanos" },
        status: "available",
        image: "https://images.unsplash.com/photo-1544866509-0d1276a6d68b?auto=format&fit=crop&q=80&w=1000",
        features: ["Bodega", "Cocina Local", "Hamacas"]
    },
    {
        id: "6",
        name: "Victoria Regia",
        description: "Peque-peque turístico adaptado para adentrarse en los afluentes más estrechos y manglares.",
        capacity: 8,
        operator: { fullName: "Comunidad Nativa Turística" },
        status: "available",
        image: "https://images.unsplash.com/photo-1596423736780-605809ac9c87?auto=format&fit=crop&q=80&w=1000",
        features: ["Auténtico", "Acceso Remoto", "Guía Nativo"]
    }
];

export const mockRestaurants = [
    {
        id: 1,
        name: "Al Frío y al Fuego",
        description: "Exclusivo restaurante flotante con cocina amazónica gourmet y piscina en medio del río Itaya.",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000",
        rating: 4.9,
        reviews: 324,
        priceRange: "$$$",
        address: "Río Itaya, Iquitos",
        tags: ["Gourmet", "Vista al Río", "Piscina", "Romántico"],
        dishes: [
            { id: "d1", name: "Ceviche de Doncellas", price: 45 },
            { id: "d2", name: "Paiche a la Loretana", price: 55 },
            { id: "d3", name: "Chaufa Charapa", price: 38 }
        ]
    },
    {
        id: 2,
        name: "El Mijano",
        description: "Tradición loretana en cada plato. Especialistas en pescados de río y ahumados regionales.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000",
        rating: 4.5,
        reviews: 89,
        priceRange: "$$",
        address: "Av. Quiñones, Iquitos",
        tags: ["Tradicional", "Familiar", "Pescados"],
        dishes: [
            { id: "d4", name: "Patarashca", price: 35 },
            { id: "d5", name: "Tacacho con Cecina", price: 30 },
            { id: "d6", name: "Inchicapi", price: 25 }
        ]
    },
    {
        id: 3,
        name: "Blanquita",
        description: "El mejor lugar para desayunar los tradicionales juanes y tamales. Un clásico de Iquitos.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000",
        rating: 4.7,
        reviews: 215,
        priceRange: "$",
        address: "Calle Próspero, Iquitos",
        tags: ["Desayunos", "Económico", "Clásico"],
        dishes: [
            { id: "d7", name: "Juane de Gallina", price: 15 },
            { id: "d8", name: "Tamalito", price: 5 },
            { id: "d9", name: "Café Regional", price: 8 }
        ]
    },
    {
        id: 4,
        name: "Karma Café",
        description: "Ambiente relajado con opciones vegetarianas, café orgánico y arte local.",
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1000",
        rating: 4.6,
        reviews: 150,
        priceRange: "$$",
        address: "Boulevard, Iquitos",
        tags: ["Café", "Vegetariano", "Arte"],
        dishes: [
            { id: "d10", name: "Pizza Vegetariana", price: 32 },
            { id: "d11", name: "Frappé de Camu Camu", price: 18 },
            { id: "d12", name: "Tarta de Chonta", price: 22 }
        ]
    },
    {
        id: 5,
        name: "Fitzcarraldo",
        description: "Restaurante histórico en el Boulevard con vista al río y decoración de época del caucho.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000",
        rating: 4.4,
        reviews: 180,
        priceRange: "$$$",
        address: "Boulevard, Iquitos",
        tags: ["Histórico", "Bar", "Internacional"],
        dishes: [
            { id: "d13", name: "Lomo Saltado", price: 42 },
            { id: "d14", name: "Dorado a la Plancha", price: 38 }
        ]
    },
    {
        id: 6,
        name: "Amazon Bistro",
        description: "Fusión francesa-amazónica en una casona colonial restaurada frente al malecón.",
        image: "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&q=80&w=1000",
        rating: 4.8,
        reviews: 250,
        priceRange: "$$$",
        address: "Malecón Tarapacá, Iquitos",
        tags: ["Fusión", "Elegante", "Panadería"],
        dishes: [
            { id: "d15", name: "Magret de Pato", price: 65 },
            { id: "d16", name: "Paiche Meunière", price: 58 }
        ]
    },
    {
        id: 7,
        name: "La Tuara",
        description: "Parrilladas selváticas y ahumados al estilo regional en un ambiente rústico.",
        image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=1000",
        rating: 4.3,
        reviews: 95,
        priceRange: "$$",
        address: "Distrito de San Juan",
        tags: ["Parrillas", "Rústico", "Noche"],
        dishes: [{ id: "d17", name: "Costillas Ahumadas", price: 35 }]
    },
    {
        id: 8,
        name: "Bora Bora",
        description: "Discoteca y lounge bar con piqueos regionales y cócteles exóticos.",
        image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&q=80&w=1000",
        rating: 4.2,
        reviews: 300,
        priceRange: "$$",
        address: "Nanay, Iquitos",
        tags: ["Vida Nocturna", "Cócteles", "Música"],
        dishes: [{ id: "d18", name: "Piqueo Selvático", price: 45 }]
    },
    {
        id: 9,
        name: "Suchiche Café",
        description: "Espacio cultural y gastronómico en una casona antigua de Tarapoto (sede sucursal).",
        image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&q=80&w=1000",
        rating: 4.6,
        reviews: 110,
        priceRange: "$$",
        address: "Centro, Iquitos",
        tags: ["Cultural", "Café", "Arte"],
        dishes: [{ id: "d19", name: "Ristretto", price: 10 }]
    },
    {
        id: 10,
        name: "El Sitio",
        description: "Comida rápida con sabor amazónico. Las mejores hamburguesas de cecina.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000",
        rating: 4.5,
        reviews: 145,
        priceRange: "$",
        address: "Plaza 28 de Julio",
        tags: ["Fast Food", "Económico", "Joven"],
        dishes: [{ id: "d20", name: "Royal Charapa", price: 18 }]
    }
];

export const mockRoutes = [
    {
        id: 1,
        origin: "Iquitos",
        destination: "Nauta",
        duration: "2 horas",
        price: 20.00,
        type: "Rápido",
        company: "Transportes Lorena",
        departureTime: "06:00 AM",
        arrivalTime: "08:00 AM",
        image: "https://images.unsplash.com/photo-1559981421-3e0c0d7cfe19?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 2,
        origin: "Iquitos",
        destination: "Santa Rosa (Frontera)",
        duration: "10 horas",
        price: 150.00,
        type: "Lancha Rápida",
        company: "Expreso Amazonas",
        departureTime: "05:00 AM",
        arrivalTime: "03:00 PM",
        image: "https://images.unsplash.com/photo-1566376547671-558694d76458?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 3,
        origin: "Yurimaguas",
        destination: "Iquitos",
        duration: "3 días",
        price: 100.00,
        type: "Lancha de Carga",
        company: "Eduardo Series",
        departureTime: "06:00 PM",
        arrivalTime: "+3 días",
        image: "https://images.unsplash.com/photo-1510935570176-904d9c7e0c4f?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 4,
        origin: "Nauta",
        destination: "Requena",
        duration: "4 horas",
        price: 45.00,
        type: "Deslizador",
        company: "Nauta Express",
        departureTime: "10:00 AM",
        arrivalTime: "02:00 PM",
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 5,
        origin: "Iquitos",
        destination: "Pucallpa",
        duration: "4 días",
        price: 180.00,
        type: "Motonave",
        company: "Henry I",
        departureTime: "05:00 PM",
        arrivalTime: "+4 días",
        image: "https://images.unsplash.com/photo-1621532152399-6e3e1c667630?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 6,
        origin: "Pucallpa",
        destination: "Iquitos",
        duration: "3 días",
        price: 180.00,
        type: "Motonave",
        company: "Henry III",
        departureTime: "08:00 AM",
        arrivalTime: "+3 días",
        image: "https://images.unsplash.com/photo-1544642005-2b444747eb44?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 7,
        origin: "Iquitos",
        destination: "Leticia (Colombia)",
        duration: "12 horas",
        price: 200.00,
        type: "Lancha Rápida",
        company: "Transtur",
        departureTime: "04:30 AM",
        arrivalTime: "04:30 PM",
        image: "https://images.unsplash.com/photo-1596423736780-605809ac9c87?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 8,
        origin: "Iquitos",
        destination: "Tamshiyacu",
        duration: "1 hora",
        price: 15.00,
        type: "Rápido",
        company: "Colectivo Fluvial",
        departureTime: "Cada 30 min",
        arrivalTime: "N/A",
        image: "https://images.unsplash.com/photo-1544866509-0d1276a6d68b?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 9,
        origin: "Requena",
        destination: "Iquitos",
        duration: "4 horas",
        price: 45.00,
        type: "Deslizador",
        company: "Nauta Express",
        departureTime: "02:00 PM",
        arrivalTime: "06:00 PM",
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000"
    }
];

export const mockExperiences = [
    {
        id: 1,
        title: "Tour Nocturno en la Selva",
        description: "Adéntrate en la selva bajo la luz de la luna. Observa caimanes, tarántulas y escucha la sinfonía nocturna.",
        price: 150.00,
        duration: "4 horas",
        location: "Reserva Allpahuayo Mishana",
        image: "https://images.unsplash.com/photo-1577366367500-1c33c3755497?auto=format&fit=crop&q=80&w=1000",
        rating: 4.9,
        reviews: 45
    },
    {
        id: 2,
        title: "Pesca de Pirañas y Delfines Rosados",
        description: "Navega por el Amazonas, observa los míticos delfines rosados y aprende la pesca tradicional.",
        price: 200.00,
        duration: "Full Day",
        location: "Río Amazonas",
        image: "https://images.unsplash.com/photo-1575305177264-839564024c08?auto=format&fit=crop&q=80&w=1000",
        rating: 4.8,
        reviews: 120
    },
    {
        id: 3,
        title: "Visita a la Isla de los Monos",
        description: "Conoce el centro de rescate de primates y comparte con ellos en su hábitat natural semilibre.",
        price: 120.00,
        duration: "5 horas",
        location: "Río Amazonas",
        image: "https://images.unsplash.com/photo-1627830238038-f949c898c8c7?auto=format&fit=crop&q=80&w=1000",
        rating: 4.9,
        reviews: 88
    },
    {
        id: 4,
        title: "Cultura Bora y Mariposario",
        description: "Intercambio cultural con la comunidad Bora y visita al mariposario de Pilpintuwasi.",
        price: 180.00,
        duration: "6 horas",
        location: "Río Nanay",
        image: "https://images.unsplash.com/photo-1544636952-b88d3ca56453?auto=format&fit=crop&q=80&w=1000",
        rating: 4.7,
        reviews: 65
    },
    {
        id: 5,
        title: "Expedición Pacaya Samiria",
        description: "Aventura de 3 días en la 'Selva de los Espejos'. Camping, caminatas y botes.",
        price: 850.00,
        duration: "3 Días",
        location: "Reserva Pacaya Samiria",
        image: "https://images.unsplash.com/photo-1534959145686-ced5ae914f6b?auto=format&fit=crop&q=80&w=1000",
        rating: 5.0,
        reviews: 92
    },
    {
        id: 6,
        title: "Ceremonia de Ayahuasca",
        description: "Experiencia espiritual guiada por chamanes certificados en un entorno seguro y respetuoso.",
        price: 400.00,
        duration: "1 Noche",
        location: "Carretera Iquitos-Nauta",
        image: "https://images.unsplash.com/photo-1520263628383-059990e67615?auto=format&fit=crop&q=80&w=1000",
        rating: 4.6,
        reviews: 30
    },
    {
        id: 7,
        title: "Canopy Walkway",
        description: "Camina sobre las copas de los árboles a más de 30 metros de altura. Vistas inigualables.",
        price: 250.00,
        duration: "Full Day",
        location: "ExplorNapo Lodge",
        image: "https://images.unsplash.com/photo-1596395817833-281b3744655f?auto=format&fit=crop&q=80&w=1000",
        rating: 4.8,
        reviews: 156
    },
    {
        id: 8,
        title: "Mercado de Belén Tour",
        description: "Explora el vibrante mercado flotante, el 'barrio bajo' de Iquitos y Pasaje Paquito.",
        price: 80.00,
        duration: "3 horas",
        location: "Barrio de Belén",
        image: "https://images.unsplash.com/photo-1506103683642-c1b2c48ac1bf?auto=format&fit=crop&q=80&w=1000",
        rating: 4.5,
        reviews: 210
    }
];

export const mockTestimonials = [
    {
        id: 1,
        name: "María Gonzales",
        role: "Viajera Aventurera",
        content: "SelvaWasi hizo que mi viaje a Iquitos fuera inolvidable. Reservar el tour nocturno fue súper fácil y seguro.",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        id: 2,
        name: "Carlos Ruiz",
        role: "Fotógrafo de Naturaleza",
        content: "La mejor plataforma para encontrar transporte fluvial confiable. Me ahorró horas de búsqueda en el puerto.",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        id: 3,
        name: "Ana y Pedro",
        role: "Pareja de Vacaciones",
        content: "Nos encantó la recomendación del restaurante flotante. La comida y la vista fueron espectaculares.",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
        id: 4,
        name: "Jessica Chen",
        role: "Digital Nomad",
        content: "El internet en los coworkings recomendados fue sorprendentemente bueno. Gran recurso para nómadas.",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg"
    }
];

