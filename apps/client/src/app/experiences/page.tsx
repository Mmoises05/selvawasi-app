"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    MapPin,
    Star,
    Compass,
    Search,
    Filter,
    Binoculars,
    Camera,
    Sunrise,
    ArrowRight,
    Leaf
} from "lucide-react";
import { marketplaceService } from '@/services/marketplace.service';
import { cn } from '@/lib/utils';

interface Experience {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    location: string;
    images: string; // JSON string from backend
    operator?: {
        companyName: string;
    };
    // Frontend enhanced props
    parsedImages?: string[];
    rating?: number;
    reviews?: number;
    category?: string;
    difficulty?: 'Baja' | 'Media' | 'Alta';
}

const COLLECTIONS = [
    { title: "Avistamiento de Fauna", icon: Binoculars, color: "from-emerald-500 to-green-600", image: "/images/hanging-monkey.png" },
    { title: "Fotografía Salvaje", icon: Camera, color: "from-sky-500 to-blue-600", image: "/images/jaguar-running.png" },
    { title: "Aventuras al Amanecer", icon: Sunrise, color: "from-amber-500 to-orange-600", image: "/images/vista-al-rio.jpg" },
    { title: "Inmersión Cultural", icon: Compass, color: "from-indigo-500 to-purple-600", image: "/images/iquitos-plaza.jpg" },
];

export default function ExperiencesPage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("Todas");

    // Scroll Effect for sticky search
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchExperiences = async () => {
            setLoading(true);
            try {
                const data = await marketplaceService.getExperiences();
                // RADICAL FIX: Force Hardcoded Images based on ID to bypass DB inconsistencies
                const FORCE_IMAGES: Record<string, string[]> = {
                    'exp-selva-profunda': ['/images/lodges/eco-20.jpg', '/images/lodges/eco-21.jpg'],
                    'exp-amazon-lux': ['/images/lodges/eco-21.jpg', '/images/lodges/eco-22.jpg'],
                    'exp-canopy-adventure': ['/images/lodges/eco-22.jpg', '/images/lodges/eco-23.jpg'],
                    'exp-laguna-mistica': ['/images/lodges/eco-23.jpg', '/images/lodges/eco-24.jpg']
                };

                // Enhance data for UI
                const enhanced = data.map((exp: any) => {
                    let parsedImages = [];

                    // 1. Check Forced Images first (Priority)
                    if (FORCE_IMAGES[exp.id]) {
                        parsedImages = FORCE_IMAGES[exp.id];
                    } else {
                        // 2. Fallback to DB logic
                        try {
                            parsedImages = Array.isArray(exp.images) ? exp.images : JSON.parse(exp.images || '[]');
                        } catch (e) {
                            console.error("Error parsing images for", exp.title, e);
                        }
                    }

                    // Fallbacks if empty
                    if (parsedImages.length === 0) {
                        parsedImages = ['/images/placeholder-jungle.jpg'];
                        if (exp.title.includes('Monos')) parsedImages = ['/images/hanging-monkey.png'];
                    }

                    return {
                        ...exp,
                        parsedImages: parsedImages,
                        rating: (4 + Math.random()).toFixed(1), // Mock rating
                        reviews: Math.floor(Math.random() * 50) + 10, // Mock reviews
                        category: ['Aventura', 'Relax', 'Cultural', 'Fotografía'][Math.floor(Math.random() * 4)],
                        difficulty: ['Baja', 'Media', 'Alta'][Math.floor(Math.random() * 3)]
                    };
                });
                setExperiences(enhanced);
            } catch (error) {
                console.error("Error fetching experiences:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    const filteredExperiences = experiences.filter(exp =>
        (activeFilter === "Todas" || exp.category === activeFilter) &&
        (exp.title.toLowerCase().includes(searchTerm.toLowerCase()) || exp.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-emerald-500/30">
            <Navbar />

            {/* --- HERO SECTION (UPDATED FOR SELVAWASI STYLE) --- */}
            <div className="relative h-[65vh] w-full overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/bg-experiences.jpg"
                        onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1596395819057-d37eace86915?q=80&w=2070&auto=format&fit=crop"}
                        alt="Amazon Rainforest"
                        className="w-full h-full object-cover scale-110 animate-in fade-in zoom-in-105 duration-[20s]"
                    />
                    {/* LIGHTER OVERLAY requested by user */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center pt-16">

                    {/* Badge */}
                    <div className="mb-6 animate-in slide-in-from-bottom-4 duration-700">
                        <Badge className="bg-stone-600/90 hover:bg-stone-600/90 text-white border-none px-6 py-2 rounded-full text-xs font-bold tracking-[0.2em] backdrop-blur-md shadow-2xl flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                            VIVE LA AMAZONÍA
                        </Badge>
                    </div>

                    {/* Main Title - SELVAWASI Style (Split Color) */}
                    <h1 className="text-6xl md:text-9xl font-cinzel font-bold tracking-tight drop-shadow-2xl animate-in slide-in-from-bottom-8 duration-700 delay-100 leading-none">
                        <span className="text-white drop-shadow-md">ECO</span>
                        <span className="text-amber-400 drop-shadow-md">TURISMO</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-2xl text-white max-w-3xl font-sans mt-8 font-medium drop-shadow-lg animate-in slide-in-from-bottom-8 duration-700 delay-200 text-shadow-sm">
                        Explora la biodiversidad, navega los ríos y conecta con la cultura.
                    </p>

                    {/* BUTTONS REMOVED AS REQUESTED */}
                    {/* FOOTER TEXT REMOVED AS REQUESTED */}

                </div>
            </div>

            {/* --- STICKY SEARCH BAR --- */}
            <div className={cn(
                "sticky top-0 z-50 transition-all duration-500 ease-out py-6",
                scrolled ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl" : "-mt-24 pb-12"
            )}>
                <div className="container mx-auto px-4">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-2 flex flex-col md:flex-row gap-2 max-w-5xl mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5 group-focus-within:text-emerald-300 transition-colors" />
                            <Input
                                placeholder="Buscar expediciones, lugares o actividades..."
                                className="pl-14 bg-transparent border-none text-white h-14 focus-visible:ring-0 placeholder:text-slate-400 text-lg font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto px-2 no-scrollbar border-l border-white/10 pl-4">
                            {['Todas', 'Aventura', 'Relax', 'Cultural', 'Fotografía'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border border-transparent",
                                        activeFilter === cat
                                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 border-emerald-500/50"
                                            : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <Button size="icon" className="rounded-full w-14 h-14 bg-emerald-500 hover:bg-emerald-400 shadow-xl shadow-emerald-900/50 shrink-0 transition-transform active:scale-95">
                            <Filter className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </div>

            <main className="relative z-10 container mx-auto px-4 py-16 space-y-32">

                {/* --- COLLECTIONS --- */}
                <section className="animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-cinzel text-white flex items-center gap-3">
                                <Leaf className="text-emerald-500 w-8 h-8" /> Colecciones Recomendadas
                            </h2>
                            <p className="text-slate-400 mt-2 text-lg">Experiencias curadas por nuestros expertos locales.</p>
                        </div>
                        <Button variant="link" className="text-emerald-400 hover:text-emerald-300 font-bold hidden md:flex">Ver todas las categorías</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {COLLECTIONS.map((col, idx) => (
                            <div key={idx} className="group relative h-80 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl">
                                <img
                                    src={col.image}
                                    onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop"}
                                    alt={col.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500">
                                    <ArrowRight className="text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                </div>

                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg group-hover:-translate-y-2 transition-transform duration-500", col.color)}>
                                        <col.icon className="text-white w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors font-cinzel leading-tight">{col.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- MAIN CATALOG --- */}
                <section id="catalog">
                    <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-4">
                        <h2 className="text-4xl font-cinzel text-white">
                            Explora nuestras <span className="text-emerald-400">Expediciones</span>
                        </h2>
                        <span className="text-slate-400">{filteredExperiences.length} resultados encontrados</span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-[500px] bg-slate-900/50 rounded-[3rem] animate-pulse border border-white/5" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredExperiences.map((exp) => (
                                <Link href={`/experiences/${exp.id}`} key={exp.id} className="group block">
                                    <div className="relative h-[550px] w-full bg-slate-900 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl hover:shadow-emerald-900/20 transition-all duration-700 hover:-translate-y-3">

                                        {/* Image Background */}
                                        <div className="absolute inset-0 z-0">
                                            <img
                                                src={exp.parsedImages?.[0]}
                                                alt={exp.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />
                                        </div>

                                        {/* Top Tags */}
                                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                                            <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-none shadow-lg backdrop-blur-sm px-4 py-1.5 text-sm font-bold">
                                                {exp.category}
                                            </Badge>
                                            <div className="flex flex-col gap-2 items-end">
                                                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                    <span className="text-white font-bold">{exp.rating}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Information */}
                                        <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col gap-4">
                                            <div>
                                                <h3 className="text-3xl font-cinzel font-bold text-white mb-2 leading-tight group-hover:text-emerald-300 transition-colors">
                                                    {exp.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-slate-300 text-sm">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                                        {exp.location}
                                                    </div>
                                                    <div className="w-1 h-1 bg-slate-500 rounded-full" />
                                                    <div className="flex items-center gap-1.5">
                                                        <Compass className="w-4 h-4 text-emerald-500" />
                                                        {exp.duration}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                                                <p className="text-slate-400 line-clamp-2 text-sm leading-relaxed mb-4">
                                                    {exp.description}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Desde</span>
                                                    <span className="text-2xl font-bold text-white">S/. {exp.price}</span>
                                                </div>
                                                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 shadow-lg shadow-emerald-500/30">
                                                    <ArrowRight className="w-6 h-6" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* --- CTA SECTION --- */}
                <section className="relative rounded-[3rem] overflow-hidden bg-emerald-900/20 border border-white/5 py-24 text-center">
                    <div className="absolute inset-0 opacity-20">
                        <img src="/images/pattern-jungle.png" alt="pattern" className="w-full h-full object-cover mix-blend-overlay" />
                    </div>
                    <div className="relative z-10 container mx-auto px-4">
                        <h2 className="text-4xl md:text-5xl font-cinzel text-white mb-6">¿Buscas algo a tu medida?</h2>
                        <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-10">
                            Diseñamos expediciones privadas para fotógrafos, investigadores y grupos exclusivos.
                        </p>
                        <Button className="bg-white text-emerald-950 hover:bg-emerald-50 px-10 py-6 text-lg rounded-full font-bold shadow-2xl transform hover:scale-105 transition-all">
                            Contactar un Especialista
                        </Button>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
