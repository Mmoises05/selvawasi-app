
"use client";

import { useEffect, useState } from "react";
import { adminService, User } from "@/services/admin.service";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Search, ShieldAlert, UserCog, User as UserIcon, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        // Optimistic update
        const originalUsers = [...users];
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));

        try {
            await adminService.updateUserRole(userId, newRole);
        } catch (error) {
            console.error("Failed to update role", error);
            // Revert
            setUsers(originalUsers);
            alert("Error al actualizar el rol");
        }
    };

    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-4xl font-serif italic text-white mb-2 tracking-wide font-[family-name:var(--font-cormorant)]">
                        Gestión de Usuarios
                        <span className="text-emerald-500">.</span>
                    </h1>
                    <p className="text-slate-400 font-light max-w-xl">
                        Administra los usuarios y sus permisos de acceso a la plataforma.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-2 rounded-2xl border border-white/5 shadow-lg max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/70" />
                    <Input
                        placeholder="Buscar por nombre o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-transparent border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
                <Table>
                    <TableHeader className="bg-white/5 border-b border-white/5">
                        <TableRow className="hover:bg-transparent border-white/5">
                            <TableHead className="text-emerald-400/70 uppercase text-xs tracking-wider font-semibold py-5">Usuario</TableHead>
                            <TableHead className="text-emerald-400/70 uppercase text-xs tracking-wider font-semibold py-5">Rol Actual</TableHead>
                            <TableHead className="text-emerald-400/70 uppercase text-xs tracking-wider font-semibold py-5">Asignar Rol</TableHead>
                            <TableHead className="text-emerald-400/70 uppercase text-xs tracking-wider font-semibold py-5">Registrado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full" />
                                        <p className="text-xs">Cargando usuarios...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-slate-500 italic">
                                    No se encontraron usuarios.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-500/20 flex items-center justify-center text-emerald-100 font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                                                {user.fullName?.substring(0, 2).toUpperCase() || <UserIcon size={16} />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{user.fullName || 'Sin Nombre'}</p>
                                                <p className="text-xs text-slate-500 font-light">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`
                                            backdrop-blur-md border px-3 py-1 rounded-full font-normal tracking-wide
                                            ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' : ''}
                                            ${user.role === 'RESTAURANT_OWNER' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : ''}
                                            ${user.role === 'OPERATOR' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : ''}
                                            ${user.role === 'TOURIST' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : ''}
                                        `}>
                                            {user.role?.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={user.role}
                                            onValueChange={(val) => handleRoleUpdate(user.id, val)}
                                        >
                                            <SelectTrigger className="w-[180px] bg-slate-900/50 border-white/10 text-white h-8 text-xs focus:border-emerald-500/50 focus:ring-emerald-500/20">
                                                <SelectValue placeholder="Seleccionar Rol" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-950 border-white/10 text-white">
                                                <SelectItem value="TOURIST">TOURIST</SelectItem>
                                                <SelectItem value="RESTAURANT_OWNER">RESTAURANT OWNER</SelectItem>
                                                <SelectItem value="OPERATOR">OPERATOR (Barcos)</SelectItem>
                                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} />
                                            {format(new Date(user.createdAt), "d MMM, yyyy", { locale: es })}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
