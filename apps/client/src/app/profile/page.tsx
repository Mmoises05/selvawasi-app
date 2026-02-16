"use client";

import { useAuth } from "@/context/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Edit2, LogOut, MapPin, Calendar, CreditCard, Camera, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { authService } from "@/services/auth.service";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isAuthenticated && typeof window !== 'undefined') {
            // router.push('/'); 
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (user) setEditedName(user.name || "");
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await authService.updateProfile(editedName);
            window.location.reload();
        } catch (e: any) {
            console.error("Error actualizando perfil:", e);
            alert("Error al actualizar: " + (e.response?.data?.message || e.message));
        } finally {
            setSaving(false);
            setIsEditing(false);
        }
    };

    if (!user) {
        return (
            <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 font-cinzel tracking-widest">CARGANDO PERFIL...</p>
                </div>
            </main>
        );
    }

    // Mock Activities for the placeholder section
    const recentActivity = [
        { id: 1, type: 'booking', title: 'Exploración Río Amazonas', date: '15 Ago 2026', status: 'Confirmado', image: '/images/lodges/1.jpg' },
        { id: 2, type: 'review', title: 'EcoLodge Selva Profunda', date: '02 Ene 2026', rating: 5, comment: 'Increíble experiencia...', image: '/images/lodges/2.jpg' },
    ];

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
            <Navbar />

            {/* --- COVER IMAGE --- */}
            <div className="relative h-80 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 z-10" />
                <img
                    src="/images/bg-experiences.jpg"
                    onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1596395819057-d37eace86915?q=80&w=2070&auto=format&fit=crop"}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-60"
                />
            </div>

            <div className="container mx-auto px-4 -mt-32 relative z-20 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- LEFT SIDEBAR (PROFILE CARD) --- */}
                    <div className="lg:col-span-4">
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl flex flex-col items-center text-center sticky top-24">
                            {/* Avatar */}
                            <div className="relative w-40 h-40 mb-6">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 blur-md opacity-50 animate-pulse" />
                                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-slate-950 bg-slate-800 flex items-center justify-center shadow-inner">
                                    <span className="text-6xl font-cinzel text-emerald-100 font-bold">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </span>
                                </div>
                                <div className="absolute bottom-2 right-2 flex items-center justify-center w-10 h-10 bg-emerald-500 rounded-full border-4 border-slate-950 text-white shadow-lg">
                                    <Shield size={16} fill="currentColor" />
                                </div>
                            </div>

                            <h1 className="text-3xl font-cinzel font-bold text-white mb-1">{user.name}</h1>
                            <p className="text-emerald-400 font-medium tracking-wide text-sm mb-6 uppercase border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 rounded-full">
                                {user.role === 'ADMIN' ? 'Administrador' : user.role === 'RESTAURANT_OWNER' ? 'Partner: Restaurante' : user.role === 'OPERATOR' ? 'Partner: Operador' : 'Explorador'}
                            </p>

                            <div className="w-full space-y-3">
                                <div className="flex items-center gap-3 text-slate-400 bg-black/20 p-4 rounded-xl border border-white/5 mx-auto w-full">
                                    <Mail className="text-emerald-500 shrink-0" size={18} />
                                    <span className="text-sm truncate">{user.email}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full mt-8">
                                <Button
                                    onClick={() => setIsEditing(!isEditing)}
                                    variant={isEditing ? "secondary" : "default"}
                                    className="flex-1 rounded-xl font-bold bg-white text-emerald-950 hover:bg-emerald-50"
                                >
                                    {isEditing ? 'Cancelar' : 'Editar'}
                                </Button>
                                <Button
                                    onClick={logout}
                                    variant="outline"
                                    className="flex-1 rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                >
                                    Salir
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT CONTENT (DETAILS & ACTIVITY) --- */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. PERSONAL INFO SECTION */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-lg">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-cinzel font-bold text-white flex items-center gap-3">
                                    <User className="text-emerald-400" /> Información Personal
                                </h2>
                                {isEditing && <Badge className="bg-amber-500 text-black animate-pulse">Modo Edición</Badge>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Nombre Completo</label>
                                    <div className="relative group">
                                        <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-xl opacity-0 transition-opacity ${isEditing ? 'opacity-100' : ''}`} />
                                        <div className={`relative flex items-center gap-4 bg-black/40 p-5 rounded-2xl border transition-colors ${isEditing ? 'border-emerald-500/50' : 'border-white/5'}`}>
                                            <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                                                <User size={20} />
                                            </div>
                                            {isEditing ? (
                                                <input
                                                    value={editedName}
                                                    onChange={(e) => setEditedName(e.target.value)}
                                                    className="bg-transparent border-none focus:outline-none w-full text-white font-medium text-lg placeholder:text-slate-600"
                                                    placeholder="Tu nombre completo"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="text-lg font-medium text-white">{user.name || "Sin nombre"}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 opacity-70">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">ID de Usuario</label>
                                    <div className="flex items-center gap-4 bg-black/40 p-5 rounded-2xl border border-white/5">
                                        <div className="bg-slate-700/50 p-2 rounded-lg text-slate-400">
                                            <Shield size={20} />
                                        </div>
                                        <span className="text-lg font-mono text-slate-400 truncate w-full block" title={user.id}>
                                            {user.id?.substring(0, 16)}...
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-8 flex justify-end animate-in fade-in slide-in-from-bottom-2">
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl px-8 py-6 text-lg font-bold shadow-lg shadow-emerald-900/20"
                                    >
                                        {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : <Edit2 size={18} className="mr-2" />}
                                        Guardar Cambios
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* 2. MY ACTIVITY PLACEHOLDER SECTION */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-lg relative overflow-hidden">
                            {/* Decorative Background Pattern */}
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <img src="/images/pattern-jungle.png" className="w-64 h-64 object-contain" alt="" />
                            </div>

                            <h2 className="text-2xl font-cinzel font-bold text-white mb-8 flex items-center gap-3">
                                <Calendar className="text-amber-400" /> Mi Actividad Reciente
                            </h2>

                            <div className="space-y-4">
                                {recentActivity.map((item) => (
                                    <div key={item.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            {item.type === 'booking' && <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center"><Calendar className="text-white drop-shadow-md" size={24} /></div>}
                                            {item.type === 'review' && <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center"><Star className="text-white drop-shadow-md" size={24} /></div>}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-lg text-white truncate group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                                                {item.status && <Badge className="bg-emerald-500/20 text-emerald-400 border-none">{item.status}</Badge>}
                                                {item.rating && <div className="flex text-amber-400"><Star size={14} fill="currentColor" /><span className="text-xs ml-1 font-bold">{item.rating}</span></div>}
                                            </div>
                                            <p className="text-slate-400 text-sm mb-1">{item.date}</p>
                                            {item.comment && <p className="text-slate-300 text-sm italic">"{item.comment}"</p>}
                                        </div>
                                    </div>
                                ))}

                                <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-2xl">
                                    <p className="text-slate-500 mb-2">No hay más actividad reciente</p>
                                    <Button variant="link" className="text-emerald-400 hover:text-emerald-300">Explorar nuevas expediciones</Button>
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
