"use client";

import { useAuth } from "@/context/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Edit2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import { authService } from "@/services/auth.service";

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isAuthenticated && typeof window !== 'undefined') {
            // router.push('/'); // Optional: Redirect if not logged in
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
            if (e.response && e.response.data) {
                console.log("DETALLE ERROR BACKEND:", e.response.data);
            }
            alert("Error al actualizar: " + (e.response?.data?.message || e.message));
        } finally {
            setSaving(false);
            setIsEditing(false);
        }
    };

    if (!user) {
        return (
            <main className="min-h-screen bg-jungle-950 text-white flex items-center justify-center">
                <p>Cargando información del perfil...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-jungle-950 text-white font-sans selection:bg-emerald-500/30">
            <Navbar />

            <div className="container mx-auto px-4 py-32 md:py-40">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-cinzel text-white mb-8 border-b border-white/10 pb-4">Mi Perfil</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Sidebar / Card */}
                        <div className="md:col-span-1">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500/30 mb-6 bg-emerald-900 flex items-center justify-center">
                                    <span className="text-4xl font-cinzel text-emerald-200">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                                <p className="text-stone-400 text-sm mb-6">{user.email}</p>

                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full bg-white/10 hover:bg-emerald-600 border border-white/10 mb-3 gap-2"
                                >
                                    <Edit2 size={16} /> Editar Perfil
                                </Button>
                                <Button variant="ghost" className="w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 gap-2" onClick={logout}>
                                    <LogOut size={16} /> Cerrar Sesión
                                </Button>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Shield className="text-emerald-400" /> Información Personal
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase text-stone-500 font-bold tracking-wider">Nombre Completo</label>
                                        <div className={`flex items-center gap-3 bg-black/20 p-4 rounded-xl border ${isEditing ? 'border-emerald-500/50' : 'border-white/5'} text-stone-200`}>
                                            <User size={20} className="text-emerald-500" />
                                            {isEditing ? (
                                                <input
                                                    value={editedName}
                                                    onChange={(e) => setEditedName(e.target.value)}
                                                    className="bg-transparent border-none focus:outline-none w-full text-white"
                                                    placeholder="Tu nombre completo"
                                                />
                                            ) : (
                                                <span>{user.name || "Sin nombre"}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase text-stone-500 font-bold tracking-wider">Correo Electrónico</label>
                                        <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5 text-stone-200">
                                            <Mail size={20} className="text-emerald-500" />
                                            <span>{user.email || "No disponible"}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase text-stone-500 font-bold tracking-wider">Rol de Usuario</label>
                                        <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5 text-stone-200">
                                            <Shield size={20} className="text-emerald-500" />
                                            <span className="capitalize">{user.role?.toLowerCase() || 'Usuario'}</span>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex gap-4 mt-4">
                                            <Button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white"
                                            >
                                                {saving ? "Guardando..." : "Guardar Cambios"}
                                            </Button>
                                            <Button
                                                onClick={() => setIsEditing(false)}
                                                variant="ghost"
                                                disabled={saving}
                                                className="text-stone-400 hover:text-white"
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-2xl p-6 flex gap-4 items-start">
                                <div className="bg-emerald-500/20 p-3 rounded-full text-emerald-400 mt-1">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-emerald-100 text-lg">Cuenta Segura</h4>
                                    <p className="text-stone-400 text-sm leading-relaxed mt-1">
                                        Tu cuenta está protegida con los estándares de seguridad de SelvaWasi.
                                        Recomendamos cambiar tu contraseña periódicamente.
                                    </p>
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
