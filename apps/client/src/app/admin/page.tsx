
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, Ship, Calendar, Activity, ArrowUpRight } from "lucide-react";
import { adminService } from "@/services/admin.service";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>({
        usersCount: 0,
        restaurantsCount: 0,
        boatsCount: 0,
        pendingReservations: 0,
        revenue: 0
    });
    const [activity, setActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsData, activityData] = await Promise.all([
                    adminService.getStats(),
                    adminService.getActivity()
                ]);
                setStats(statsData);
                setActivity(activityData);
            } catch (error) {
                console.error("Error loading admin dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-4xl font-serif italic text-white mb-2 tracking-wide font-[family-name:var(--font-cormorant)] drop-shadow-md">
                        Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-white">{user?.name?.split(' ')[0]}</span> <span className="text-2xl not-italic">👋</span>
                    </h1>
                    <p className="text-slate-300 font-light max-w-xl text-lg">
                        Bienvenido a <span className="font-semibold text-emerald-400">SelvaWasi</span>. Tu ecosistema digital está activo y funcionando.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-3">


                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 bg-emerald-950/40 px-4 py-2 rounded-full border border-emerald-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        SISTEMA OPERATIVO
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Usuarios Totales"
                    value={loading ? "..." : stats.usersCount}
                    icon={Users}
                    trend="+12% vs mes anterior"
                    gradient="from-blue-500/20 to-blue-600/5"
                    iconColor="text-blue-300"
                    borderColor="border-blue-400/30"
                />
                <StatCard
                    title="Reservas Pendientes"
                    value={loading ? "..." : stats.pendingReservations}
                    icon={Calendar}
                    trend="Requieren atención"
                    gradient="from-amber-500/20 to-amber-600/5"
                    iconColor="text-amber-300"
                    borderColor="border-amber-400/30"
                />
                <StatCard
                    title="Ingresos (Est.)"
                    value={loading ? "..." : `S/. ${stats.revenue}`}
                    icon={ShoppingBag}
                    trend="+8% esta semana"
                    gradient="from-emerald-500/20 to-emerald-600/5"
                    iconColor="text-emerald-300"
                    borderColor="border-emerald-400/30"
                />
                <StatCard
                    title="Barcos Activos"
                    value={loading ? "..." : stats.boatsCount}
                    icon={Ship}
                    trend="Flota operativa"
                    gradient="from-purple-500/20 to-purple-600/5"
                    iconColor="text-purple-300"
                    borderColor="border-purple-400/30"
                />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900/40 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-700" />

                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h2 className="text-xl font-serif text-white tracking-wide">Actividad Reciente</h2>
                        <button className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors px-3 py-1 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10">
                            Ver todo <ArrowUpRight size={12} />
                        </button>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {loading ? (
                            <p className="text-slate-500 text-sm">Cargando actividad...</p>
                        ) : activity.length === 0 ? (
                            <p className="text-slate-500 text-sm">No hay actividad reciente.</p>
                        ) : (
                            activity.map((item) => (
                                <div key={item.id} className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
                                    <div className="h-10 w-10 rounded-full bg-slate-800/80 flex items-center justify-center text-emerald-400 shadow-lg border border-white/5">
                                        <Activity size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-200 font-medium">
                                            {item.message}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                            <span>
                                                {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="h-1 w-1 rounded-full bg-slate-600" />
                                            <span>Usuario: {item.user}</span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Info Panel */}
                <div className="bg-gradient-to-br from-emerald-900/60 to-slate-900/60 border border-emerald-500/30 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-2xl">

                    <div className="relative z-10">
                        <h3 className="text-xl font-serif text-white mb-2 italic">Panel de Control</h3>
                        <p className="text-sm text-emerald-100/70 leading-relaxed mb-6">
                            Utiliza la barra lateral para navegar. El sistema se encuentra operando bajo parámetros normales.
                        </p>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <div className="flex items-center gap-3 text-sm text-emerald-100 bg-white/10 p-3 rounded-lg border border-white/10 backdrop-blur-sm">
                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
                            Servidor Estable
                        </div>
                        <div className="flex items-center gap-3 text-sm text-emerald-100 bg-white/10 p-3 rounded-lg border border-white/10 backdrop-blur-sm">
                            <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]" />
                            Base de Datos Conectada
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, trend, gradient, iconColor, borderColor }: any) {
    return (
        <Card className={`bg-slate-900/40 border-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-xl group overflow-hidden relative shadow-xl hover:shadow-2xl hover:-translate-y-1`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</CardTitle>
                <div className={`p-2.5 rounded-xl bg-slate-950/30 border border-white/10 ${iconColor} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={16} />
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-white font-serif tracking-tight drop-shadow-sm">{value}</div>
                <p className={`text-[10px] mt-2 font-medium bg-white/10 inline-block px-2 py-0.5 rounded-full ${iconColor} backdrop-blur-sm border border-white/5`}>
                    {trend}
                </p>
            </CardContent>
        </Card>
    );
}
