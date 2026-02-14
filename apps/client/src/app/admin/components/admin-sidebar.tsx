
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Utensils,
    Ship,
    TentTree,
    LogOut,
    Home,
    CalendarClock,
    ArrowUpRight
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    const isAdmin = user?.role === 'ADMIN';

    const links = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard, adminOnly: false },
        { name: "Usuarios", href: "/admin/users", icon: Users, adminOnly: true },
        { name: "Restaurantes", href: "/admin/restaurants", icon: Utensils, adminOnly: false },
        { name: "Transporte", href: "/admin/boats", icon: Ship, adminOnly: true },
        { name: "Ecoturismo", href: "/admin/experiences", icon: TentTree, adminOnly: true },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-72 flex flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.5)] border-r border-white/10 backdrop-blur-2xl bg-slate-950/30">
            {/* Logo Section */}
            <div className="p-8 border-b border-white/5 relative overflow-hidden group flex justify-between items-start">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 opacity-80" />

                <Link href="/" className="relative z-10 flex flex-col gap-1">
                    <span className="text-3xl font-serif italic tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-emerald-200 via-white to-emerald-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] font-[family-name:var(--font-cormorant)]">
                        SelvaWasi
                    </span>
                    <span className="text-[10px] text-emerald-400/90 uppercase tracking-[0.3em] font-medium border border-emerald-500/20 px-2 py-0.5 rounded-full w-fit bg-emerald-950/40 backdrop-blur-sm">
                        Admin Panel
                    </span>
                </Link>

                <Link
                    href="/"
                    className="group/icon relative z-10 p-2 rounded-lg bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 text-slate-400 hover:text-emerald-400"
                    title="Volver al Portal"
                >
                    <ArrowUpRight size={18} />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto custom-scrollbar">
                <div>
                    <h3 className="px-4 text-[10px] uppercase tracking-widest text-emerald-400/60 font-bold mb-4 font-sans">
                        Menú Principal
                    </h3>
                    <div className="space-y-2">
                        {links.filter(link => !link.adminOnly || isAdmin).map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden backdrop-blur-sm",
                                        isActive
                                            ? "bg-white/10 border border-white/20 text-white shadow-lg"
                                            : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                                    )}
                                >
                                    <Icon
                                        size={18}
                                        className={cn(
                                            "transition-all duration-300",
                                            isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-emerald-300"
                                        )}
                                    />
                                    <span className={cn("font-medium tracking-wide text-sm", isActive ? "text-white" : "")}>
                                        {link.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 m-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-800 p-[1px] shadow-lg">
                        <div className="h-full w-full rounded-full bg-slate-950/90 flex items-center justify-center text-emerald-100 font-bold text-sm">
                            {user?.name?.substring(0, 2).toUpperCase()}
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-white truncate font-serif tracking-wide">{user?.name}</p>
                        <p className="text-[10px] text-emerald-400 truncate uppercase tracking-wider font-semibold opacity-80">{user?.role?.replace('_', ' ')}</p>
                    </div>
                </div>
                <Button
                    onClick={logout}
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2 h-9 text-xs uppercase tracking-wider font-semibold border border-transparent hover:border-red-500/20 rounded-lg transition-all"
                >
                    <LogOut size={14} />
                    <span>Cerrar Sesión</span>
                </Button>
            </div>


        </aside>
    );
}
