"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Anchor, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthModal } from "../auth/auth-modal";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar({ className }: { className?: string }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, isAuthenticated, logout, openLoginModal, closeLoginModal, isLoginModalOpen } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Transporte", href: "/boats" },
        { name: "Gastronomía", href: "/restaurants" },
        { name: "Ecoturismo", href: "/experiences" },
        { name: "Nosotros", href: "/about" },
    ];



    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 w-full z-50 transition-all duration-300",
                    scrolled ? "-translate-y-full opacity-0 pointer-events-none" : "bg-transparent py-5",
                    className
                )}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    {/* LOGO */}
                    <Link href="/" className="group flex items-center gap-2">
                        <span className="text-2xl font-cinzel font-bold text-white tracking-widest group-hover:text-emerald-200 transition-colors">
                            SELVAWASI
                        </span>
                    </Link>

                    {/* DESKTOP NAV */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-stone-300 hover:text-white transition-colors tracking-wide uppercase relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-500 after:transition-all hover:after:w-full"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="h-6 w-px bg-white/20 mx-2" />

                        {/* AUTH UI */}
                        {isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-10 w-10 border-2 border-emerald-500 cursor-pointer hover:scale-105 transition-transform">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                                            <AvatarFallback className="bg-emerald-900 text-emerald-200">{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-slate-950 border-white/10 text-slate-200" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                                            <p className="text-xs leading-none text-slate-400">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />

                                    {/* CONDITIONAL OWNER MENU */}
                                    {/* ADMIN / MANGEMENT LINK */}
                                    {(user.role === 'ADMIN' || user.role === 'RESTAURANT_OWNER' || user.role === 'OPERATOR') && (
                                        <>
                                            <DropdownMenuItem asChild className="focus:bg-emerald-900/50 focus:text-white cursor-pointer">
                                                <Link href="/admin" className="flex items-center w-full font-bold text-emerald-400">
                                                    ⚡ Panel de Gestión
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-white/10" />
                                        </>
                                    )}

                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Mi Perfil</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-white/10" />

                                    <DropdownMenuItem onClick={logout} className="focus:bg-red-900/30 text-red-400 focus:text-red-300 cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Cerrar Sesión</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 backdrop-blur-md border border-white/10"
                                onClick={openLoginModal}
                            >
                                Iniciar Sesión
                            </Button>
                        )}
                    </div>

                    {/* MOBILE MENU TOGGLE */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* MOBILE MENU */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-slate-950 border-t border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg font-medium text-stone-300 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-px w-full bg-white/10 my-2" />

                        {isAuthenticated && user ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 px-2">
                                    <Avatar className="h-10 w-10 border border-emerald-500">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                                        <AvatarFallback>{user.name?.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-white font-bold">{user.name}</p>
                                        <p className="text-xs text-slate-400">{user.email}</p>
                                    </div>
                                </div>
                                {(user.role === 'ADMIN' || user.role === 'RESTAURANT_OWNER' || user.role === 'OPERATOR') && (
                                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full border-emerald-500/50 text-emerald-400 hover:bg-emerald-950">
                                            ⚡ Panel de Gestión
                                        </Button>
                                    </Link>
                                )}
                                <Button onClick={logout} variant="ghost" className="w-full text-red-400 hover:bg-red-950/30 justify-start">
                                    <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                                </Button>
                            </div>
                        ) : (
                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-500"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    openLoginModal();
                                }}
                            >
                                Iniciar Sesión
                            </Button>
                        )}
                    </div>
                )}
            </nav>
            {/* Global Auth Modal Controlled by Context */}
            {/* Global Auth Modal Controlled by Context */}
            <AuthModal
                isOpen={isLoginModalOpen}
                onOpenChange={(open) => {
                    if (!open) closeLoginModal();
                }}
            />
        </>
    );
}
