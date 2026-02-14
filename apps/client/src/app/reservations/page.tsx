"use client";

import { useAuth } from "@/context/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Ship, MapPin, Search } from "lucide-react";
import { bookingsService } from "@/services/bookings.service";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Preloader } from "@/components/ui/preloader";

export default function ReservationsPage() {
    const { user, isAuthenticated } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]); // simplified type
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (user?.id) {
                try {
                    const data = await bookingsService.getUserBookings(user.id);
                    setBookings(data);
                } catch (error) {
                    console.error("Failed to fetch bookings", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        if (isAuthenticated) fetchBookings();
        else setLoading(false);
    }, [user, isAuthenticated]);

    if (loading) return <div className="min-h-screen bg-jungle-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <main className="min-h-screen bg-jungle-950 text-white font-sans selection:bg-emerald-500/30">
            <Navbar />

            <div className="container mx-auto px-4 py-32 md:py-40">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                        <h1 className="text-4xl font-cinzel text-white">Mis Reservas</h1>
                        <Link href="/">
                            <Button variant="outline" className="border-white/10 text-stone-300 hover:text-white hover:bg-white/10 gap-2">
                                <Search size={16} /> Explorar más
                            </Button>
                        </Link>
                    </div>

                    {!isAuthenticated ? (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-stone-400 mb-4">Inicia sesión para ver tus reservas.</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-stone-600 mb-4">
                                <Calendar size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Sin reservas activas</h3>
                            <p className="text-stone-400 mb-6 max-w-md">
                                Aún no has realizado ninguna reserva. Explora nuestras experiencias, barcos y restaurantes.
                            </p>
                            <Link href="/">
                                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
                                    Explorar SelvaWasi
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    <div className="w-16 h-16 bg-emerald-900/50 rounded-lg flex items-center justify-center text-emerald-400 shrink-0">
                                        <Ship size={32} />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <Badge className={
                                                booking.status === 'CONFIRMED' ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                                                    booking.status === 'PENDING' ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                                                        "bg-red-500/20 text-red-300 border-red-500/30"
                                            }>
                                                {booking.status === 'PENDING' ? 'Pendiente' : booking.status === 'CONFIRMED' ? 'Confirmada' : 'Cancelada'}
                                            </Badge>
                                            <span className="text-xs text-stone-500 font-mono uppercase tracking-widest">{booking.id.substring(0, 8)}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">
                                            {booking.schedule?.route?.origin || "Reserva General"}
                                            {booking.schedule?.route?.destination && ` ➔ ${booking.schedule.route.destination}`}
                                        </h3>
                                        <p className="text-stone-400 text-sm flex items-center gap-4">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(booking.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><MapPin size={14} /> {booking.seatNumber || 'General'}</span>
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-stone-500 mb-1">Total Pagado</p>
                                        <p className="text-2xl font-bold text-amber-400">S/. {Number(booking.totalPrice).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
