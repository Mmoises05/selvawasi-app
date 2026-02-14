"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    CalendarClock,
    CheckCircle,
    XCircle,
    MoreHorizontal,
    Users,
    Utensils,
    MessageSquare,
    Search
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ReservationsTab() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const data = await adminService.getReservations();
            setReservations(data);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleStatusUpdate = async (id: string, status: 'CONFIRMED' | 'REJECTED') => {
        try {
            await adminService.updateReservationStatus(id, status);
            setReservations(prev => prev.map(r =>
                r.id === id ? { ...r, status } : r
            ));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error al actualizar el estado");
        }
    };

    const filteredReservations = reservations.filter(r => {
        if (filter === 'ALL') return true;
        return r.status === filter;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Confirmado</Badge>;
            case 'REJECTED':
                return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">Rechazado</Badge>;
            case 'PENDING_APPROVAL':
                return <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">Pendiente</Badge>;
            default:
                return <Badge variant="outline" className="text-slate-400">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                <div className="flex gap-2">
                    <div className="bg-slate-950/50 border border-white/10 rounded-lg p-1 flex">
                        {['ALL', 'PENDING_APPROVAL', 'CONFIRMED'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                {f === 'ALL' ? 'Todas' : f === 'PENDING_APPROVAL' ? 'Pendientes' : 'Confirmadas'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <Input
                        placeholder="Buscar reserva..."
                        className="pl-9 bg-slate-950/50 border-white/10 text-sm focus:ring-emerald-500 h-9"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-xl shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Restaurante</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Cliente</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha Hora</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Pax</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">Cargando reservas...</td>
                                </tr>
                            ) : filteredReservations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">No hay reservas en esta categoría.</td>
                                </tr>
                            ) : (
                                filteredReservations.map((reservation) => (
                                    <tr key={reservation.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                                                    <Utensils size={14} />
                                                </div>
                                                <span className="font-medium text-white text-sm">{reservation.restaurant?.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-300">{reservation.user?.name || reservation.user?.email || 'Usuario'}</span>
                                                <span className="text-xs text-slate-500">{reservation.operatorNote}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-slate-300">
                                                {format(new Date(reservation.requestedDate), "d MMM, yyyy", { locale: es })}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {format(new Date(reservation.requestedDate), "HH:mm")}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                                                <Users size={10} className="mr-1" /> {reservation.pax}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(reservation.status)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-slate-950 border-white/10 text-slate-200">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-white/10" />
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusUpdate(reservation.id, 'CONFIRMED')}
                                                        className="text-emerald-400 focus:text-emerald-300 focus:bg-emerald-900/20 cursor-pointer"
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4" /> Confirmar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusUpdate(reservation.id, 'REJECTED')}
                                                        className="text-red-400 focus:text-red-300 focus:bg-red-900/20 cursor-pointer"
                                                    >
                                                        <XCircle className="mr-2 h-4 w-4" /> Rechazar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
