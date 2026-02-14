
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { AdminSidebar } from "./components/admin-sidebar";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push("/");
                return;
            }

            // Role Check
            if (user?.role !== 'ADMIN' && user?.role !== 'RESTAURANT_OWNER' && user?.role !== 'OPERATOR') {
                router.push("/");
                return;
            }

            // Specific Route Protection
            if (pathname.startsWith('/admin/users') && user.role !== 'ADMIN') {
                router.push("/admin");
                return;
            }

            setIsAuthorized(true);
        }
    }, [isAuthenticated, isLoading, user, router, pathname]);

    if (isLoading || !isAuthorized) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-950">
                <Spinner className="w-10 h-10 text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen text-slate-200 font-sans flex relative selection:bg-emerald-500/30 overflow-hidden">
            {/* 🌿 FOTOGRAFÍA DE FONDO (REAL) */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/images/bg-nanay.jpg"
                    alt="Background"
                    fill
                    className="object-cover opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/80 to-emerald-950/90 mix-blend-multiply" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50" />
            </div>

            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 ml-72 p-10 pt-12 overflow-y-auto h-screen relative z-10 custom-scrollbar">
                <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                    {children}
                </div>
            </main>
        </div>
    );
}
