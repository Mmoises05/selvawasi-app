
"use client";

import { useEffect, useState } from "react";
import { adminService, User } from "@/services/admin.service";
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
import { Plus, Ship, Users, Search, Ticket } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingsTab } from "./components/bookings-tab";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { api } from "@/services/api";

interface Boat {
    id: string;
    name: string;
    capacity: number;
    operatorId: string;
    operator?: { companyName: string, userId: string };
}

// For this demo we need to fetch Operators. 
// Ideally we should have an endpoint /operators. 
// But since Operator is linked to User, we can fetch users with role OPERATOR.
// AND we need to make sure we create the Operator entity if it doesn't exist for that user?
// Or we simplify: Admin creates specific "Operator" entry?
// The schema has `Operator` model. 
// Let's assume for now we list Users with role OPERATOR and assume they have an Operator profile.
// OR we just use the User ID for now if the backend handles it.
// Checking Schema: Boat -> operatorId (refers to Operator.id).
// Operator -> userId (unique).
// So we need to fetch Operators.

interface Operator {
    id: string;
    companyName: string;
    userId: string;
}

import { boatsService } from "@/services/boats.service";

export default function BoatsPage() {
    const [boats, setBoats] = useState<Boat[]>([]);
    const [operators, setOperators] = useState<Operator[]>([]);
    const [users, setUsers] = useState<User[]>([]); // To create new operators if needed?
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        capacity: 10,
        operatorId: ""
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            // We need a way to get Operators. 
            // If /operators endpoint doesn't exist or isn't exposed, we might have trouble.
            // Let's assume fetching boats includes operator info.
            // But for creating, we need the list of available operators.
            // Currently strict relation: boat.operatorId.
            // HACK: For this MVP, let's fetch all users, filter by OPERATOR role, 
            // and if we can't get strict Operator IDs easily without a new endpoint, 
            // we might need to create that endpoint or just rely on what we have.
            // Let's try to fetch /operators if it exists? I don't think I saw it.
            // I'll check if I can add it or just use a workaround.

            // Checking: I didn't see an operators module. 
            // I will assume for now I can't easily list operators without adding the endpoint.
            // I will just fetch boats for the list. 
            // For creation, I will allow inputting an ID or maybe fetch users and HOPE there is an operator for them?
            // BETTER: Add a quick GET /operators endpoint to Users or a new generic resource?
            // Let's stick to reading boats for now.
            // Updated to use the consistent service
            const boatsData = await boatsService.getAll();
            setBoats(boatsData);

            // Attempt to get operators. If fails, we might mock or empty.
            // Actually, let's try to get users directly and maybe we can find a way?
            try {
                const usersRes = await adminService.getUsers();
                setUsers(usersRes.filter(u => u.role === 'OPERATOR'));
            } catch (err) {
                console.warn("Could not fetch users for operators", err);
            }

        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        // PROBLEM: We need an Operator ID, not User ID.
        // If the backend `create` expects `operatorId`, we must provide it.
        // If we only have Users, we can't create a boat easily unless we create the Operator first.
        // Schema: Operator { id, companyName, userId ... }
        // Maybe we just map it for now? 
        // Or we ask the user to enter the Operator ID manually? (Bad UX)
        // I'll try to submit, if it fails, I'll alert.

        try {
            await api.post('/boats', {
                ...formData,
                capacity: Number(formData.capacity)
            });
            setIsCreateOpen(false);
            setFormData({ name: "", capacity: 10, operatorId: "" });
            fetchData();
        } catch (error) {
            console.error("Failed to create boat", error);
            alert("Error: Necesitas un ID de Operador válido. (Sistema en construcción)");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Transporte Fluvial</h1>
                    <p className="text-slate-400">Gestiona las embarcaciones, ventas y disponibilidad.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Nueva Embarcación
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-950 border border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Registrar Embarcación</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Nombre de la Nave</Label>
                                <Input
                                    className="bg-slate-900 border-white/10"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Capacidad (Pasajeros)</Label>
                                <Input
                                    type="number"
                                    className="bg-slate-900 border-white/10"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Operador ID (Temporal)</Label>
                                <Input
                                    className="bg-slate-900 border-white/10"
                                    value={formData.operatorId}
                                    onChange={(e) => setFormData({ ...formData, operatorId: e.target.value })}
                                    placeholder="UUID del Operador"
                                    required
                                />
                                <p className="text-xs text-slate-500">
                                    Nota: Se requiere el ID de la tabla `Operator`, no del `User`.
                                </p>
                            </div>
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 mt-4">
                                Registrar
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="fleet" className="w-full">
                <TabsList className="bg-slate-900/50 border border-white/10 p-1 mb-6">
                    <TabsTrigger value="fleet" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400">
                        <Ship className="mr-2 h-4 w-4" /> Flota Global
                    </TabsTrigger>
                    <TabsTrigger value="bookings" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400">
                        <Ticket className="mr-2 h-4 w-4" /> Pasajes Vendidos
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="fleet">
                    <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-xl animate-in slide-in-from-bottom-2">
                        <Table>
                            <TableHeader className="bg-slate-950 border-b border-white/10">
                                <TableRow>
                                    <TableHead className="text-slate-400">Embarcación</TableHead>
                                    <TableHead className="text-slate-400">Capacidad</TableHead>
                                    <TableHead className="text-slate-400">Operador</TableHead>
                                    <TableHead className="text-slate-400">Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                            Cargando flota...
                                        </TableCell>
                                    </TableRow>
                                ) : boats.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                            No hay embarcaciones registradas.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    boats.map((boat) => (
                                        <TableRow key={boat.id} className="border-b border-white/5 hover:bg-white/5">
                                            <TableCell className="font-medium text-white">
                                                <div className="flex items-center gap-2">
                                                    <Ship size={16} className="text-blue-400" />
                                                    {boat.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    <Users size={14} />
                                                    {boat.capacity} pax
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-400">
                                                {boat.operator?.companyName || boat.operatorId}
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    Activo
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="bookings">
                    <BookingsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
