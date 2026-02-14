
"use client";

import { useEffect, useState } from "react";
import { adminService, User } from "@/services/admin.service"; // Need to update service
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Plus, MapPin, Utensils, Search, CalendarClock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReservationsTab } from "./components/reservations-tab";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { api } from "@/services/api"; // Direct API call for now or move to admin service

interface Restaurant {
    id: string;
    name: string;
    description: string;
    address: string;
    userId: string;
    user?: User;
}

export default function RestaurantsPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        userId: ""
    });

    const fetchData = async () => {
        setLoading(true);

        // 1. Fetch Restaurants (Priority)
        try {
            const restoRes = await api.get('/restaurants');
            setRestaurants(restoRes.data);
        } catch (error) {
            console.error("Failed to load restaurants", error);
        }

        // 2. Fetch Users (Secondary - for Admin dropdowns)
        try {
            const usersRes = await adminService.getUsers();
            setUsers(usersRes.filter(u => u.role === 'RESTAURANT_OWNER' || u.role === 'ADMIN'));
        } catch (error) {
            console.warn("Could not load users (likely non-admin or auth error)", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/restaurants', {
                ...formData,
                // userId is required in schema
            });
            setIsCreateOpen(false);
            setFormData({ name: "", description: "", address: "", userId: "" });
            fetchData();
        } catch (error) {
            console.error("Failed to create restaurant", error);
            alert("Error al crear restaurante. Asegúrate de que el usuario no tenga ya un restaurante asignado.");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Gestión de Restaurantes</h1>
                    <p className="text-slate-400">Administra locales y solicitudes de reserva.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Restaurante
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-950 border border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Restaurante</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Nombre del Restaurante</Label>
                                <Input
                                    className="bg-slate-900 border-white/10"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Descripción</Label>
                                <Input
                                    className="bg-slate-900 border-white/10"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Dirección</Label>
                                <Input
                                    className="bg-slate-900 border-white/10"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Dueño (Usuario)</Label>
                                <Select
                                    onValueChange={(val) => setFormData({ ...formData, userId: val })}
                                    value={formData.userId}
                                >
                                    <SelectTrigger className="bg-slate-900 border-white/10">
                                        <SelectValue placeholder="Seleccionar Dueño" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                        {users.map(u => (
                                            <SelectItem key={u.id} value={u.id}>
                                                {u.fullName || u.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-slate-500">Solo usuarios con rol RESTAURANT_OWNER.</p>
                            </div>
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 mt-4">
                                Crear Restaurante
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="restaurants" className="w-full">
                <TabsList className="bg-slate-900/50 border border-white/10 p-1 mb-6">
                    <TabsTrigger value="restaurants" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400">
                        <Utensils className="mr-2 h-4 w-4" /> Restaurantes
                    </TabsTrigger>
                    <TabsTrigger value="reservations" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400">
                        <CalendarClock className="mr-2 h-4 w-4" /> Solicitudes de Reserva
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="restaurants">
                    <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-xl animate-in slide-in-from-bottom-2">
                        <Table>
                            <TableHeader className="bg-slate-950 border-b border-white/10">
                                <TableRow>
                                    <TableHead className="text-slate-400">Nombre</TableHead>
                                    <TableHead className="text-slate-400">Ubicación</TableHead>
                                    <TableHead className="text-slate-400">Dueño Asignado</TableHead>
                                    <TableHead className="text-slate-400">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                            Cargando...
                                        </TableCell>
                                    </TableRow>
                                ) : restaurants.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                            No hay restaurantes registrados.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    restaurants.map((resto) => (
                                        <TableRow key={resto.id} className="border-b border-white/5 hover:bg-white/5">
                                            <TableCell className="font-medium text-white">
                                                <div className="flex items-center gap-2">
                                                    <Utensils size={16} className="text-emerald-500" />
                                                    {resto.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} />
                                                    {resto.address || 'Sin dirección'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-400">
                                                <span className="font-mono text-xs">{resto.userId}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
                                                    Editar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="reservations">
                    <ReservationsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
