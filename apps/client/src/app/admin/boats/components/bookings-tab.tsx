"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    CalendarClock,
    Ship,
    MapPin,
    Users,
    Search,
    Ticket,
    RefreshCw
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function BookingsTab() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await adminService.getBookings();
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // Helper status badge (Bookings usually are Created = Confirmed in this MVP or PENDING)
    const getStatusBadge = (status: string) => {
        // Assuming status string, default PENDING if not present
        const s = status || 'PENDING';
        if (s === 'CONFIRMED' || s === 'PAID') return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Confirmado</Badge>;
        if (s === 'CANCELLED') return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">Cancelado</Badge>;
        return <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">Activo</Badge>;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Control Bar */}
            <div className="flex justify-between items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                <div className="text-sm text-slate-400 font-medium">
                    Mostrando últimos pasajes vendidos
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <Input
                        placeholder="Buscar pasaje por usuario..."
                        className="pl-9 bg-slate-950/50 border-white/10 text-sm focus:ring-emerald-500 h-9"
                    />
                </div>
                <button
                    onClick={fetchBookings}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                    title="Actualizar lista"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Table */}
            <div className="bg-slate-900/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-xl shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ruta / Barco</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Pasajero</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Salida</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Asientos</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">Cargando pasajes...</td>
                                </tr>
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">No hay pasajes vendidos.</td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-white font-medium text-sm">
                                                    <Ship size={14} className="text-blue-400" />
                                                    {booking.schedule?.boat?.name || 'Barco'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <MapPin size={12} />
                                                    {booking.schedule?.route?.origin || 'Origen'} ➝ {booking.schedule?.route?.destination || 'Destino'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-300 font-bold">{booking.passengerName || booking.user?.name || 'Usuario'}</span>
                                                <span className="text-xs text-slate-500 uppercase tracking-wider">
                                                    {(booking.passengerDocType && booking.passengerDocNumber)
                                                        ? `${booking.passengerDocType}: ${booking.passengerDocNumber}`
                                                        : `Usuario: ${booking.user?.email}`
                                                    }
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {booking.schedule?.departureTime ? (
                                                <>
                                                    <div className="text-sm text-slate-300">
                                                        {format(new Date(booking.schedule.departureTime), "d MMM, yyyy", { locale: es })}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {format(new Date(booking.schedule.departureTime), "HH:mm")}
                                                    </div>
                                                </>
                                            ) : <span className="text-slate-500">-</span>}

                                        </td>
                                        <td className="p-4 text-center">
                                            <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                                                <Ticket size={10} className="mr-1" /> {booking.seatNumber || '1'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 font-mono text-emerald-400 text-sm">
                                            S/. {booking.totalPrice}
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(booking.status)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
