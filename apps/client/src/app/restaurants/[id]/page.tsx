"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { marketplaceService } from "@/services/marketplace.service";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Star,
    Utensils,
    Clock,
    CheckCircle,
    Users,
    Calendar as CalendarIcon,
    ChevronRight,
    ChefHat,
    Info,
    Share2,
    Heart,
    ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// --- Mock Data for "Tech" Features ---
const REVIEWS = [
    { user: "Sofia M.", rating: 5, comment: "Una experiencia inolvidable. El paiche estaba en su punto perfecto.", date: "Hace 2 días" },
    { user: "Carlos R.", rating: 5, comment: "La vista al río al atardecer es impagable. Servicio de primera.", date: "Hace 1 semana" },
    { user: "Elena T.", rating: 4, comment: "Delicioso, aunque tuvimos que esperar un poco por la mesa. Vale la pena.", date: "Hace 3 semanas" },
];

const AMENITIES = ["Vista al Río", "Aire Acondicionado", "Música en Vivo", "Barra de Tragos", "Zona Privada"];

export default function RestaurantDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [guests, setGuests] = useState(2);
    const [bookingStep, setBookingStep] = useState(0); // 0: Form, 1: Loading, 2: Success

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const data = await marketplaceService.getRestaurantById(id);
                // Enhance data
                setRestaurant({
                    ...data,
                    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070", // Fallback high-quality image
                    images: [
                        "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800",
                        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800",
                        "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800"
                    ]
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurant();
    }, [id]);

    const { isAuthenticated, openLoginModal } = useAuth(); // Get auth tools

    // ... useEffect ...

    const handleBooking = async () => {
        if (!isAuthenticated) {
            openLoginModal();
            return;
        }

        if (!selectedDate) {
            alert("Por favor selecciona una fecha");
            return;
        }

        setBookingStep(1);
        try {
            // Calculate Date
            const date = new Date();
            if (selectedDate === 'Mañana') {
                date.setDate(date.getDate() + 1);
            } else if (selectedDate === 'Viernes') {
                // Simple logic: next friday
                const day = date.getDay();
                const diff = (5 - day + 7) % 7;
                date.setDate(date.getDate() + diff || 7);
            }
            // If 'Hoy', date is already now.

            // Create Reservation Request using the Service
            await marketplaceService.createReservation({
                restaurantId: id,
                pax: guests,
                requestedDate: date.toISOString(),
                operatorNote: "Solicitud desde la web (Verificada)"
            });
            setBookingStep(2);
        } catch (error) {
            console.error("Error creating reservation:", error);
            alert("Hubo un error al enviar tu solicitud. Intenta nuevamente.");
            setBookingStep(0);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-emerald-500 font-cinzel animate-pulse">Cargando Experiencia...</p>
            </div>
        </div>
    );

    if (!restaurant) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Restaurante no encontrado</div>;

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
            <Navbar />

            {/* --- CINEMATIC HERO --- */}
            <div className="relative h-[85vh] w-full overflow-hidden">
                {/* Back Button */}
                <Link href="/restaurants" className="absolute top-24 md:top-28 left-4 md:left-8 z-50 flex items-center gap-2 text-white/90 hover:text-emerald-400 bg-black/30 hover:bg-black/50 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 transition-all group shadow-lg">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-cinzel font-bold text-sm tracking-wide">Volver a la Lista</span>
                </Link>

                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop"
                        alt="Hero Details"
                        className="w-full h-full object-cover animate-in fade-in zoom-in-105 duration-[20s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 w-full z-20 pb-16 pt-32 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
                    <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                        <div className="lg:col-span-2 space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                            <div className="flex gap-2">
                                <Badge className="bg-emerald-500 text-white border-none px-3 py-1 text-sm font-medium shadow-lg shadow-emerald-900/50">
                                    Gastronomía Amazónica
                                </Badge>
                                <Badge variant="outline" className="text-white border-white/20 backdrop-blur-md">
                                    Experiencia Premium
                                </Badge>
                            </div>
                            <h1 className="font-cinzel text-5xl md:text-7xl font-bold text-white drop-shadow-2xl leading-none">
                                {restaurant.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-slate-300 text-lg">
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-emerald-400" />
                                    {restaurant.address}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="text-amber-400 fill-amber-400" />
                                    <span className="font-bold text-white">{restaurant.rating}</span> (128 Reseñas)
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="text-blue-400" />
                                    <span className="text-white">Abierto</span> • Cierra 11:00 PM
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                            <Button variant="outline" size="icon" className="rounded-full w-14 h-14 border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md">
                                <Share2 className="w-6 h-6" />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full w-14 h-14 border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md">
                                <Heart className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTENT LAYOUT --- */}
            <div className="container mx-auto px-4 py-8 relative z-30 -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* MAIN CONTENT */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Description & Amenities */}
                        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            <div className="prose prose-invert max-w-none">
                                <h2 className="text-3xl font-cinzel text-white flex items-center gap-3">
                                    <Utensils className="text-emerald-400" /> La Experiencia
                                </h2>
                                <p className="text-slate-300 text-lg leading-relaxed font-light mt-4">
                                    {restaurant.description} Sumérgete en un viaje culinario donde los ingredientes ancestrales de la selva se encuentran con técnicas modernas. Cada plato cuenta una historia de tradición y pasión.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {AMENITIES.map((item, i) => (
                                    <div key={i} className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-sm flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" /> {item}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Visual Menu (Grid) */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-cinzel text-white">Platos de Autor</h2>
                                <Button variant="link" className="text-emerald-400">Ver Carta Completa</Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(restaurant.dishes || []).map((dish: any, idx: number) => (
                                    <div key={dish.id} className="group relative bg-slate-900 border border-white/5 p-4 rounded-2xl flex gap-4 hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all cursor-default">
                                        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                                            <img
                                                src={`https://source.unsplash.com/random/200x200?food,sig=${idx}`} // Placeholder dynamic
                                                alt={dish.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                // Fallback if unsplash source is tricky in preview, using reliable static for demo consistency
                                                // Using static for stability:
                                                srcSet="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">{dish.name}</h3>
                                                <span className="text-emerald-400 font-bold">S/. {dish.price}</span>
                                            </div>
                                            <p className="text-sm text-slate-400 mt-1 line-clamp-2">Ingredientes seleccionados del mercado de Belén, preparados con técnica francesa.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Reviews */}
                        <section className="space-y-8 pb-12 border-t border-white/5 pt-12">
                            <h2 className="text-2xl font-cinzel text-white">Lo que dicen nuestros comensales</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {REVIEWS.map((review, i) => (
                                    <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex text-amber-400">
                                                {[...Array(5)].map((_, starI) => (
                                                    <Star key={starI} className={cn("w-4 h-4", starI < review.rating ? "fill-current" : "text-slate-700")} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-slate-500">{review.date}</span>
                                        </div>
                                        <p className="text-slate-300 text-sm italic">"{review.comment}"</p>
                                        <p className="text-xs font-bold text-slate-400 uppercase">{review.user}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* STICKY SIDEBAR - BOOKING ENGINE */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {/* Reservation Card */}
                            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                                {bookingStep === 0 && (
                                    <div className="space-y-6 animate-in fade-in">
                                        <div className="text-center space-y-2">
                                            <h3 className="text-2xl font-cinzel text-white">Solicitar Mesa</h3>
                                            <p className="text-slate-400 text-sm">Envía tu solicitud y espera la confirmación.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs uppercase text-emerald-400 font-bold flex items-center gap-2">
                                                    <CalendarIcon className="w-4 h-4" /> Fecha
                                                </label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {['Hoy', 'Mañana', 'Viernes'].map(d => (
                                                        <button
                                                            key={d}
                                                            className={cn("px-2 py-2 rounded-lg text-sm border transition-all", selectedDate === d ? "bg-emerald-500 border-none text-white font-bold" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10")}
                                                            onClick={() => setSelectedDate(d)}
                                                        >
                                                            {d}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs uppercase text-emerald-400 font-bold flex items-center gap-2">
                                                    <Clock className="w-4 h-4" /> Hora Preferida
                                                </label>
                                                <select className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:ring-1 focus:ring-emerald-500 outline-none">
                                                    <option>19:00 PM - Cena</option>
                                                    <option>20:00 PM - Cena</option>
                                                    <option>21:00 PM - Cena</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs uppercase text-emerald-400 font-bold flex items-center gap-2">
                                                    <Users className="w-4 h-4" /> Personas
                                                </label>
                                                <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-white/10">
                                                    <Button variant="ghost" size="sm" onClick={() => setGuests(Math.max(1, guests - 1))} className="text-white hover:text-emerald-400">-</Button>
                                                    <span className="flex-1 text-center font-bold text-lg">{guests}</span>
                                                    <Button variant="ghost" size="sm" onClick={() => setGuests(guests + 1)} className="text-white hover:text-emerald-400">+</Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-14 rounded-xl text-lg shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all"
                                                onClick={handleBooking}
                                            >
                                                Solicitar Reserva
                                            </Button>
                                            <p className="text-xs text-center text-slate-500 mt-3 flex justify-center items-center gap-1">
                                                <Info className="w-3 h-3" /> Sujeto a confirmación del restaurante
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {bookingStep === 1 && (
                                    <div className="flex flex-col items-center justify-center py-12 animate-in fade-in space-y-4">
                                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-white font-cinzel text-lg">Enviando solicitud...</p>
                                    </div>
                                )}

                                {bookingStep === 2 && (
                                    <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in space-y-4 text-center">
                                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)] mb-4 border border-emerald-500">
                                            <CheckCircle className="w-10 h-10 text-emerald-400" />
                                        </div>
                                        <h3 className="text-2xl font-cinzel text-white font-bold">¡Solicitud Enviada!</h3>
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 text-sm space-y-2">
                                            <p className="text-slate-300">El restaurante revisará tu solicitud.</p>
                                            <p className="text-emerald-400 font-bold">Estado: Pendiente de Aprobación</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="mt-6 border-white/20 text-white hover:bg-white/10"
                                            onClick={() => setBookingStep(0)}
                                        >
                                            Hacer otra solicitud
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Trust Badge */}
                            <div className="bg-emerald-900/20 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-4">
                                <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-400">
                                    <ChefHat size={20} />
                                </div>
                                <div>
                                    <p className="text-emerald-400 font-bold text-sm">Selección SelvaWasi</p>
                                    <p className="text-xs text-emerald-500/70">Calidad verificada por expertos.</p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </main>
    );
}
