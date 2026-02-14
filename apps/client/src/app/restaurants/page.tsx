'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    MapPin,
    Star,
    Utensils,
    ChefHat,
    Search,
    Filter,
    Flame,
    Wine,
    Clock,
    Users,
    ArrowRight,
    Sparkles
} from "lucide-react";
import { marketplaceService } from '@/services/marketplace.service';
import { cn } from '@/lib/utils'; // Assuming this exists, common in shadcn

// --- Types ---
interface Dish {
    id: string;
    name: string;
    price: number;
}

interface Restaurant {
    id: number;
    name: string;
    description: string;
    address: string;
    rating: number;
    dishes: Dish[];
    tags?: string[];
    // Extended properties for the "Tech" demo
    image?: string;
    isLive?: boolean;
    tablesLeft?: number;
    category?: 'Fusion' | 'Tradicional' | 'Parrilla' | 'Bar' | 'Café';
}

// --- Mock Data Extensions (Simulating High-End Backend) ---
const EXOTIC_IMAGES = [
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800", // Mood lighting
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800", // Amazonian vibes
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800", // Plating
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800", // View
];

const COLLECTIONS = [
    { title: "Cena Romántica", icon: Wine, color: "from-rose-500 to-pink-600", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400" },
    { title: "Vista al Río", icon: Sparkles, color: "from-sky-500 to-blue-600", image: "/images/vista-al-rio.jpg" },
    { title: "Sabores de la Selva", icon: Flame, color: "from-emerald-500 to-green-600", image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=400" },
    { title: "Alta Cocina", icon: ChefHat, color: "from-amber-500 to-orange-600", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400" },
];

export default function RestaurantsPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("Todos");

    // Scroll Effect for sticky search
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await marketplaceService.getRestaurants();
                // Enhance data with fake "live" stats
                const enhancedData = data.map((r: any, index: number) => ({
                    ...r,
                    image: EXOTIC_IMAGES[index % EXOTIC_IMAGES.length],
                    isLive: Math.random() > 0.6,
                    tablesLeft: Math.floor(Math.random() * 5) + 1,
                    category: ['Fusion', 'Tradicional', 'Parrilla', 'Bar'][Math.floor(Math.random() * 4)]
                }));
                setRestaurants(enhancedData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredRestaurants = restaurants.filter(r =>
        (activeFilter === "Todos" || r.category === activeFilter) &&
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-emerald-500/30">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
                        alt="Gastronomy Hero"
                        className="w-full h-full object-cover opacity-60 scale-105 animate-in fade-in zoom-in-105 duration-[20s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950" />
                </div>

                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center space-y-6">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-2 text-sm uppercase tracking-widest backdrop-blur-md animate-in slide-in-from-bottom-4 duration-700">
                        Experiencia Culinaria
                    </Badge>
                    <h1 className="text-5xl md:text-8xl font-cinzel font-bold text-white tracking-tight drop-shadow-2xl animate-in slide-in-from-bottom-8 duration-700 delay-100">
                        Sabores del <br /><span className="text-emerald-400 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">Amazonas</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-300 max-w-2xl font-light leading-relaxed animate-in slide-in-from-bottom-8 duration-700 delay-200">
                        Descubre la fusión de ingredientes ancestrales y alta cocina en los lugares más exclusivos.
                    </p>
                </div>
            </div>

            {/* --- SMART STICKY SEARCH BAR --- */}
            <div className={cn(
                "sticky top-0 z-50 transition-all duration-300 ease-in-out py-6",
                scrolled ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl" : "bg-transparent -mt-20"
            )}>
                <div className="container mx-auto px-4">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full p-2 flex flex-col md:flex-row gap-2 max-w-4xl mx-auto shadow-lg">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <Input
                                placeholder="Busca por restaurante, plato o chef..."
                                className="pl-12 bg-transparent border-none text-white h-12 focus-visible:ring-0 placeholder:text-slate-400 text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto px-2 no-scrollbar">
                            {['Todos', 'Fusion', 'Tradicional', 'Parrilla'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                        activeFilter === cat
                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-900/50"
                                            : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <Button size="icon" className="rounded-full w-12 h-12 bg-emerald-600 hover:bg-emerald-500 shadow-xl shrink-0">
                            <Filter className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <main className="relative z-10 container mx-auto px-4 py-12 space-y-24">

                {/* --- CHEF'S COLLECTIONS (NETFLIX STYLE) --- */}
                <section className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="text-3xl font-cinzel text-white flex items-center gap-3">
                                <ChefHat className="text-orange-400" /> Colecciones del Chef
                            </h2>
                            <p className="text-slate-400 mt-2">Listas curadas para cada ocasión especial.</p>
                        </div>
                        <Button variant="link" className="text-emerald-400 hover:text-emerald-300">Ver todas</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {COLLECTIONS.map((col, idx) => (
                            <div key={idx} className="group relative h-64 rounded-[2rem] overflow-hidden cursor-pointer">
                                <img src={col.image} alt={col.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-6">
                                    <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg group-hover:-translate-y-2 transition-transform duration-300", col.color)}>
                                        <col.icon className="text-white w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">{col.title}</h3>
                                    <p className="text-slate-400 text-sm mt-1">5 restaurantes</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- LIVE LISTINGS --- */}
                <section className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <Utensils className="text-white w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-cinzel text-white">Restaurantes Destacados</h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => <div key={i} className="h-96 bg-white/5 rounded-3xl animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredRestaurants.map((restaurant) => (
                                <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id} className="group">
                                    <div className="h-full bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-900/20 flex flex-col">

                                        {/* Image Area */}
                                        <div className="relative h-72 overflow-hidden">
                                            <img
                                                src={restaurant.image}
                                                alt={restaurant.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                                            {/* Badges */}
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                {restaurant.isLive && (
                                                    <Badge className="bg-red-500/90 text-white border-none animate-pulse">
                                                        <Flame className="w-3 h-3 mr-1" /> Muy Solicitado
                                                    </Badge>
                                                )}
                                                {restaurant.category && (
                                                    <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-md border-none">
                                                        {restaurant.category}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="absolute top-4 right-4">
                                                <Badge className="bg-emerald-500 text-white border-none shadow-lg font-bold text-lg px-3 py-1">
                                                    {restaurant.rating} <Star className="w-3 h-3 ml-1 fill-current" />
                                                </Badge>
                                            </div>

                                            {/* Bottom Info on Image */}
                                            <div className="absolute bottom-4 left-6 right-6">
                                                <h3 className="text-3xl font-cinzel font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{restaurant.name}</h3>
                                                <div className="flex items-center text-slate-300 text-sm">
                                                    <MapPin className="w-4 h-4 mr-1 text-emerald-500" /> {restaurant.address}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-8 flex-1 flex flex-col space-y-6">
                                            <p className="text-slate-400 leading-relaxed font-light line-clamp-2">
                                                {restaurant.description}
                                            </p>

                                            {/* Tech Stats */}
                                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/5 border-b">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                        <Clock className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-slate-500 uppercase font-bold">Espera</span>
                                                        <span className="text-sm text-white font-medium">~15 min</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                                                        <Users className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-slate-500 uppercase font-bold">Mesas</span>
                                                        <span className={cn("text-sm font-medium", restaurant.tablesLeft && restaurant.tablesLeft < 3 ? "text-red-400" : "text-emerald-400")}>
                                                            {restaurant.tablesLeft} disponibles
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dishes Preview */}
                                            <div className="space-y-3">
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Platos Estrella</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {restaurant.dishes.slice(0, 3).map((dish: Dish) => (
                                                        <span key={dish.id} className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-300 border border-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors cursor-default">
                                                            {dish.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4">
                                                <Button className="w-full bg-slate-800 hover:bg-emerald-600 text-white rounded-xl h-12 font-medium transition-all group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                                    Ver Disponibilidad <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}
