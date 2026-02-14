'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { boatsService } from '@/services/boats.service';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ChevronLeft,
    Users,
    Ship,
    Gauge,
    Calendar,
    CheckCircle2,
    Smartphone,
    MapPin,
    Clock,
    User,
    Anchor
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/auth-context';

interface Boat {
    id: string;
    name: string;
    description: string;
    capacity: number;
    operator: {
        fullName: string;
    };
    image?: string;
    specs?: {
        speed: string;
        length: string;
        cabins: number;
        year: number;
    };
    features?: string[];
    schedules?: any[]; // Simplified for now, or define Schedule interface
}

export default function BoatDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { isAuthenticated } = useAuth();

    const [boat, setBoat] = useState<Boat | null>(null);
    const [loading, setLoading] = useState(true);

    // Image Mapping Helper (Consistent with Main Page)
    const getBoatImage = (name: string) => {
        const n = name?.toLowerCase() || '';
        // 1. Luxury / Cruceros
        if (n.includes('delfín iii') || n.includes('delfin iii') || n.includes('gran delfín')) return "/images/boats/delfin-iii.png";
        if (n.includes('delfín ii') || n.includes('delfin ii')) return "/images/boats/delfin-ii.png";
        if (n.includes('aria') || n.includes('aqua')) return "/images/boats/aria.png";
        if (n.includes('zafiro')) return "/images/boats/zafiro.png";

        // 2. Carga / Mixto
        if (n.includes('don josé') || n.includes('jose') || n.includes('henry') || n.includes('eduardo') || n.includes('lorena')) return "/images/boats/don-jose.png";
        if (n.includes('pumacahua')) return "/images/boats/pumacahua.png";
        if (n.includes('reina')) return "/images/boats/reina.png";

        // 3. Fast Boats
        if (n.includes('rápido') || n.includes('rapido') || n.includes('nanay') || n.includes('nauta') || n.includes('transtur')) return "/images/boats/amazonas-ii.png";
        if (n.includes('amazonas i') || n.includes('amazonas 1')) return "/images/boats/amazonas-i.png";
        if (n.includes('amazonas')) return "/images/boats/amazonas-ii.png";

        return "/images/boats/ferry-generic.png";
    };

    useEffect(() => {
        const fetchBoat = async () => {
            if (id) {
                try {
                    const data = await boatsService.getById(id);
                    // Enrich data if needed with defaults
                    const enrichedData = {
                        ...data,
                        specs: {
                            speed: '25 nudos',
                            length: '45m',
                            cabins: 12,
                            year: 2019
                        },
                        features: data.features || [
                            'Aire Acondicionado',
                            'Bar & Lounge',
                            'Vista Panorámica',
                            'Chef a Bordo',
                            'Guía Especializado',
                            'Wifi Starlink'
                        ]
                    };
                    setBoat(enrichedData);
                } catch (error) {
                    console.error("Failed to load boat", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBoat();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
            </div>
        );
    }

    if (!boat) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
                <Link href="/boats">
                    <Button variant="outline">Volver a la Flota</Button>
                </Link>
                <p className="text-slate-600">Embarcación no encontrada.</p>
            </div>
        );
    }

    const heroImage = getBoatImage(boat.name);

    // --- RENDER: NEW PREMIUM LAYOUT ---
    return (
        <div className="min-h-screen bg-jungle-950 text-slate-800 font-sans selection:bg-emerald-500/30">
            <Navbar className="fixed top-0 z-50 w-full transition-all duration-300" />

            {/* 1. HERO - IMMERSIVE FULL WIDTH (Like Experiences) */}
            <div className="relative h-[75vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center animate-in fade-in zoom-in-105 duration-[2s]"
                    style={{ backgroundImage: `url(${heroImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-jungle-950 via-transparent to-transparent z-20" />

                <div className="absolute bottom-0 left-0 w-full z-30 p-6 md:p-20">
                    <div className="container mx-auto">
                        <Link href="/boats" className="inline-flex items-center text-white/80 hover:text-white font-medium mb-6 transition-colors group backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10 w-fit">
                            <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Volver a la Flota
                        </Link>

                        <div className="flex items-center gap-3 mb-4">
                            <Badge className="bg-emerald-600 text-white border-none px-3 py-1 text-sm font-medium tracking-wide shadow-lg shadow-emerald-900/50">Premium Class</Badge>
                            <div className="flex items-center gap-1 bg-black/40 backdrop-blur px-3 py-1 rounded text-amber-400 text-xs font-bold border border-white/10 shadow-sm">
                                <Users size={12} className="text-amber-400" /> Capacidad: {boat.capacity}
                            </div>
                        </div>

                        <h1 className="font-cinzel text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 drop-shadow-2xl max-w-5xl tracking-tight leading-none">
                            {boat.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 text-stone-200 text-lg font-light">
                            <div className="flex items-center gap-3">
                                <Ship className="text-emerald-400" />
                                <span className="font-cinzel tracking-wider">{boat.operator?.fullName}</span>
                            </div>
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
                            <div className="flex items-center gap-3">
                                <Gauge className="text-amber-400" />
                                <span>{boat.specs?.speed || '25 nudos'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. CONTENT - CLEAN GRID LAYOUT */}
            <div className="bg-stone-50 relative z-10">
                <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">

                    {/* LEFT COLUMN: NARRATIVE & SPECS */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Description */}
                        <section>
                            <h2 className="text-3xl font-cinzel font-bold text-slate-900 mb-8 border-l-4 border-emerald-500 pl-4">La Experiencia</h2>
                            <p className="text-slate-600 leading-loose text-xl font-serif italic text-justify opacity-90">
                                "{boat.description || 'Navega por los majestuosos ríos del Amazonas con un nivel de confort incomparable. Cada detalle de esta embarcación ha sido diseñado para conectar con la naturaleza sin sacrificar el lujo y la seguridad que mereces.'}"
                            </p>
                        </section>

                        {/* Specs Grid - Clean & Minimal */}
                        <section>
                            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-widest text-xs">
                                <Gauge className="text-emerald-600" size={16} /> Ficha Técnica
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="text-center space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Velocidad</p>
                                    <p className="text-2xl font-bold text-slate-900">{boat.specs?.speed || '25 nudos'}</p>
                                </div>
                                <div className="text-center space-y-1 border-l border-slate-100">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Eslora</p>
                                    <p className="text-2xl font-bold text-slate-900">{boat.specs?.length || '45m'}</p>
                                </div>
                                <div className="text-center space-y-1 border-l border-slate-100">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Camarotes</p>
                                    <p className="text-2xl font-bold text-slate-900">{boat.specs?.cabins || 12}</p>
                                </div>
                                <div className="text-center space-y-1 border-l border-slate-100">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Año</p>
                                    <p className="text-2xl font-bold text-slate-900">{boat.specs?.year || 2019}</p>
                                </div>
                            </div>
                        </section>

                        {/* Amenities - VISUAL GRID (New Premium Style with BG Image) */}
                        <section className="relative mt-12 group overflow-hidden rounded-[2.5rem]">
                            {/* BACKGROUND IMAGE FOR "PHOTO" FEEL */}
                            <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-jungle-950/80 z-10" />
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                                    style={{ backgroundImage: `url('/images/bg-nanay.jpg')` }}
                                />
                            </div>

                            <div className="relative z-20 p-12">
                                <div className="flex justify-between items-end mb-10">
                                    <h3 className="text-3xl font-cinzel font-bold text-white flex items-center gap-3">
                                        <CheckCircle2 className="text-emerald-400" /> Comodidades
                                    </h3>
                                    <span className="text-emerald-200/60 text-sm font-medium hidden md:block uppercase tracking-widest">
                                        Todo incluido a bordo
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {(boat.features || []).map((feature, idx) => (
                                        <div key={idx} className="group/card relative overflow-hidden bg-white/5 hover:bg-white/10 backdrop-blur-sm p-6 rounded-2xl transition-all duration-300 border border-white/10 hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-900/20 hover:-translate-y-1">
                                            <div className="flex flex-col h-full justify-between gap-4">
                                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover/card:bg-emerald-500 group-hover/card:text-white transition-colors">
                                                    <CheckCircle2 size={24} />
                                                </div>
                                                <span className="font-bold text-white text-lg leading-tight">
                                                    {feature}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* RIGHT COLUMN: BOOKING ACTION (Sticky Sidebar) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">

                            {/* Booking Card */}
                            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-amber-500" />

                                <h3 className="text-2xl font-cinzel font-bold text-slate-900 mb-2">Próximas Salidas</h3>
                                <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">
                                    Selecciona tu itinerario para realizar la reserva.
                                </p>

                                <div className="space-y-6">
                                    {boat.schedules && boat.schedules.length > 0 ? (
                                        boat.schedules.map((schedule: any) => {
                                            const price = schedule.prices?.[0]?.amount || 0;
                                            const date = new Date(schedule.departureTime);
                                            const dayName = date.toLocaleDateString('es-PE', { weekday: 'long' });
                                            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                            return (
                                                <div key={schedule.id} className="group">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                                                            <Calendar size={12} /> {dayName} {date.getDate()}
                                                        </span>
                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-emerald-700">S/. {Number(price).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    <h4 className="font-bold text-slate-900 text-lg mb-3 block group-hover:text-emerald-700 transition-colors">
                                                        {schedule.route?.origin} ➔ {schedule.route?.destination}
                                                    </h4>
                                                    <p className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                                                        <Clock size={14} /> Salida: {time}
                                                    </p>
                                                    <Link href={`/book/${schedule.id}`} className="block w-full">
                                                        <Button
                                                            className="w-full bg-slate-900 text-white hover:bg-emerald-600 hover:text-white font-bold h-12 rounded-xl transition-all shadow-md hover:shadow-lg"
                                                        >
                                                            Reservar Ahora
                                                        </Button>
                                                    </Link>
                                                    <Separator className="bg-slate-100 mt-6" />
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-slate-500">No hay salidas programadas próximamente.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                    <Button variant="ghost" className="text-slate-400 hover:text-slate-600 text-sm font-medium">
                                        Ver calendario completo
                                    </Button>
                                </div>
                            </div>

                            {/* Support Pill */}
                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-center gap-3 text-emerald-800 text-sm font-medium">
                                <Smartphone size={16} />
                                <span>¿Dudas? Llámanos: +51 987 654 321</span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <Footer className="relative z-10" />

        </div>
    );
}

// Helper component for specs
function SpecItem({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
    return (
        <div className="bg-white/60 p-4 rounded-2xl text-center border border-white/50 hover:bg-white/90 transition-colors">
            <div className="mb-2 flex justify-center opacity-80">{icon}</div>
            <p className="text-xs uppercase tracking-bold text-slate-500 mb-1 font-bold">{label}</p>
            <p className="text-lg font-bold text-slate-800">{value}</p>
        </div>
    )
}
