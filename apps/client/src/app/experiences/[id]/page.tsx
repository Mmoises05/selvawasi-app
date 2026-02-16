"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { marketplaceService } from "@/services/marketplace.service";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Clock,
    Star,
    ShieldCheck,
    Info,
    Calendar as CalendarIcon,
    Users,
    CheckCircle2,
    Share2,
    Heart
} from "lucide-react";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/context/auth-context";
import { BookingModal } from "@/components/booking/booking-modal";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ExperienceDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { isAuthenticated } = useAuth();

    const [experience, setExperience] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [bookingOpen, setBookingOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [travelers, setTravelers] = useState(2);
    const [calendarOpen, setCalendarOpen] = useState(false);

    // Parallax Effect
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchExp = async () => {
            try {
                const data = await marketplaceService.getExperienceById(id);
                // Enhance data if needed (e.g. parse images if backend sends string)
                let images = [];
                try {
                    const rawImages = data.images;
                    if (Array.isArray(rawImages)) {
                        images = rawImages;
                    } else if (typeof rawImages === 'string') {
                        images = JSON.parse(rawImages || '[]');
                    }
                } catch (e) { console.error("Error parsing images", e); }

                // Fallback
                if (!images || images.length === 0) {
                    images = ['/images/placeholder-jungle.jpg'];
                    if (data.title && data.title.includes('Monos')) images = ['/images/hanging-monkey.png'];
                }

                setExperience({ ...data, images });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchExp();
    }, [id]);

    const handleBooking = () => {
        if (isAuthenticated) {
            setBookingOpen(true);
        } else {
            setAuthOpen(true);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );

    if (!experience) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Experiencia no encontrada</div>;

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
            <Navbar />

            {/* Auth Modal for Lazy Auth */}
            <AuthModal
                isOpen={authOpen}
                onOpenChange={setAuthOpen}
                onSuccess={() => {
                    setAuthOpen(false);
                    setBookingOpen(true);
                }}
            />

            {/* --- PARALLAX HERO --- */}
            <div className="relative h-[85vh] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center will-change-transform"
                    style={{
                        backgroundImage: `url(${experience.images && experience.images.length > 0 ? experience.images[0] : '/images/placeholder-jungle.jpg'})`,
                        transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0005})`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/40" />

                <div className="absolute inset-0 flex flex-col justify-end pb-32 container mx-auto px-4 z-20">
                    <div className="animate-in slide-in-from-bottom-8 fade-in duration-1000">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 px-4 py-1.5 text-sm uppercase tracking-wide font-bold shadow-lg shadow-emerald-900/40">
                                Ecoturismo Premium
                            </Badge>
                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-amber-400 font-bold shadow-lg">
                                <Star className="w-4 h-4 fill-current" /> 4.9 (128 Reseñas)
                            </div>
                        </div>

                        <h1 className="font-cinzel text-5xl md:text-8xl font-bold text-white mb-8 drop-shadow-2xl leading-[0.9]">
                            {experience.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 text-lg font-medium text-white/90">
                            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/10">
                                <Clock className="w-6 h-6 text-emerald-400" />
                                {experience.duration}
                            </div>
                            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/10">
                                <MapPin className="w-6 h-6 text-emerald-400" />
                                {experience.location}
                            </div>
                            <div className="flex gap-4 ml-auto">
                                <Button size="icon" variant="ghost" className="rounded-full w-12 h-12 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="rounded-full w-12 h-12 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10">
                                    <Heart className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTENT LAYOUT --- */}
            <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 -mt-20 relative z-30">

                {/* LEFT COLUMN (Details) */}
                <div className="lg:col-span-8 space-y-16">

                    {/* Description Card */}
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
                        <h2 className="text-3xl font-cinzel text-white mb-6 flex items-center gap-3">
                            <Info className="text-emerald-500" /> Sobre la Experiencia
                        </h2>
                        <p className="text-slate-300 leading-loose text-lg font-light text-justify">
                            {experience.description}
                        </p>
                    </div>

                    {/* Gallery Grid */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-cinzel text-white mb-6">Galería de Aventuras</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-96">
                            {(experience.images || []).slice(0, 5).map((img: string, i: number) => (
                                <div key={i} className={cn(
                                    "rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5 shadow-lg",
                                    i === 0 ? "col-span-2 row-span-2 h-full" : "h-full"
                                )}>
                                    <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inclusions */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10">
                        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                            <ShieldCheck className="text-emerald-500 w-8 h-8" /> ¿Qué incluye tu expedición?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                "Transporte fluvial ida y vuelta",
                                "Guía local certificado",
                                "Almuerzo regional gourmet",
                                "Entradas a reservas naturales",
                                "Equipo de seguridad completo",
                                "Hidratación constante"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <span className="text-slate-200 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN (Sticky Booking) */}
                <div className="lg:col-span-4 relative">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                            <div className="flex justify-between items-center mb-8 pb-8 border-b border-white/10">
                                <div>
                                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Precio por persona</p>
                                    <div className="flex items-baseline gap-1">
                                        <p className="text-5xl font-cinzel font-bold text-white">S/. {experience.price}</p>
                                        <p className="text-sm text-slate-500">PEN</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                                        Mejor Precio
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400 font-bold uppercase tracking-wider ml-1">Fecha</label>
                                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn(
                                                "w-full justify-start h-14 rounded-2xl border-white/10 bg-white/5 text-left text-base hover:bg-white/10 hover:text-white",
                                                !date && "text-slate-400"
                                            )}>
                                                <CalendarIcon className="mr-2 h-5 w-5 text-emerald-500" />
                                                {date ? format(date, "PPP", { locale: es }) : "Seleccionar Fecha"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-800" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={(d) => {
                                                    setDate(d);
                                                    setCalendarOpen(false);
                                                }}
                                                initialFocus
                                                disabled={(date) => date < new Date()}
                                                className="rounded-xl border border-slate-800 text-slate-200"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400 font-bold uppercase tracking-wider ml-1">Viajeros</label>
                                    <Select value={travelers.toString()} onValueChange={(v) => setTravelers(Number(v))}>
                                        <SelectTrigger className="w-full h-14 rounded-2xl border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-base">
                                            <div className="flex items-center">
                                                <Users className="mr-2 h-5 w-5 text-emerald-500" />
                                                <SelectValue placeholder="Seleccionar" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                <SelectItem key={num} value={num.toString()} className="focus:bg-emerald-500/20 focus:text-white">
                                                    {num} {num === 1 ? 'Adulto' : 'Adultos'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-slate-400">Total estimada</span>
                                        <span className="text-2xl font-bold text-white">S/. {(Number(experience.price) * travelers).toFixed(2)}</span>
                                    </div>
                                    <Button
                                        onClick={handleBooking}
                                        disabled={!date}
                                        className={cn(
                                            "w-full h-16 text-white font-bold rounded-2xl text-lg shadow-xl transition-all hover:-translate-y-1",
                                            date ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-900/20" : "bg-slate-800 text-slate-500 cursor-not-allowed"
                                        )}
                                    >
                                        {date ? "Reservar Aventura" : "Selecciona una fecha"}
                                    </Button>
                                    <p className="text-xs text-center text-slate-500 mt-4 px-8 leading-relaxed">
                                        No se realizará ningún cargo hasta que el operador confirme la disponibilidad. Cancelación gratuita hasta 48h antes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-[2rem] flex gap-4 items-start">
                            <Info className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                            <p className="text-sm text-amber-200/80 leading-relaxed">
                                <strong className="text-amber-400 block mb-1">¡Cupos Limitados!</strong>
                                Esta experiencia es una de las más solicitadas. Recomendamos reservar con al menos 3 días de anticipación.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Booking Modal */}
            {experience && (
                <BookingModal
                    isOpen={bookingOpen}
                    onClose={() => setBookingOpen(false)}
                    scheduleId={experience.id}
                    price={Number(experience.price) * travelers}
                    title={experience.title}
                    subtitle="Experiencia Amazónica Premium"
                    type="EXPERIENCE"
                    date={date}
                    travelers={travelers}
                // Pass image for modal visual context if supported
                />
            )}

            <Footer />
        </main>
    );
}
