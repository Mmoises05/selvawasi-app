"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Categories() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
    const dolphinOffset = useTransform(scrollYProgress, [0, 0.6], ["0%", "100%"]);

    return (
        <section ref={containerRef} className="relative z-10 py-24 bg-stone-50 overflow-hidden">
            {/* Scroll-Linked Animation Layer - Absolute overlay spanning the FULL SECTION WIDTH - V11 HIGH ARCH SKETCH */}
            <div className="absolute top-[-100px] left-0 right-0 h-[600px] pointer-events-none z-0 hidden md:block">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1200 600">
                    <defs>
                        <linearGradient id="rainbowScrollGradientV8" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                            <stop offset="20%" stopColor="#10b981" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
                            <stop offset="80%" stopColor="#0ea5e9" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {/* The Path: ADJUSTED ARC V8 - Slightly lower than V7 */}
                    <path
                        id="dolphinPathV11"
                        d="M -100,550 Q 600,-50 1300,550"
                        fill="none"
                        stroke="url(#rainbowScrollGradientV8)"
                        strokeWidth="0"
                        strokeLinecap="round"
                        strokeDasharray="15 15"
                        className="opacity-0"
                    />
                </svg>

                {/* The Dolphin */}
                <motion.div
                    key="dolphin-animation-v11"
                    className="absolute top-0 left-0 w-32 h-32"
                    style={{
                        offsetPath: "path('M -100,550 Q 600,-50 1300,550')",
                        offsetDistance: dolphinOffset,
                        offsetRotate: "auto",
                        offsetAnchor: "center"
                    }}
                >
                    <img
                        src="/images/jumping-dolphin.png"
                        alt="Delfín Viajero"
                        className="w-full h-full object-contain filter drop-shadow-xl"
                        style={{ transform: "rotateY(0deg)" }}
                    />
                </motion.div>
            </div>

            <div className="container px-4 relative">

                {/* Section Header */}
                <div className="text-center mb-16 space-y-4 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-sm">
                        <span className="bg-gradient-to-r from-emerald-600 via-amber-500 to-sky-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
                            ¿Qué aventura buscas?
                        </span>
                    </h2>
                    <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        Explora nuestras categorías y conecta con el alma de la selva.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 px-2 relative z-10">
                    {/* CARD 1: Transporte (River Theme) */}
                    <Link href="/boats" className="group">
                        <Card className="h-full border-0 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-15px_rgba(2,132,199,0.3)] overflow-hidden relative rounded-[2.5rem] transition-all duration-500 hover:-translate-y-3">
                            {/* Cinematic Background Image (Faded) */}
                            <div className="absolute inset-0 z-0">
                                <img src="/images/categories/transporte.jpg" alt="Background" className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-all duration-700 blur-[2px] group-hover:blur-0 scale-110 group-hover:scale-100" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent mix-blend-overlay" />
                            </div>

                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-river-50/80 via-white/50 to-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                            <CardHeader className="relative z-10 pb-0">
                                {/* Image Logo Container */}
                                <div className="h-28 w-28 rounded-[2rem] p-1 bg-white shadow-lg shadow-river-900/10 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-out">
                                    <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative">
                                        <img src="/images/categories/transporte.jpg" alt="Transporte" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <CardTitle className="text-3xl font-black text-slate-800 group-hover:text-river-700 transition-colors">Transporte</CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10 pt-4">
                                <CardDescription className="text-base font-medium text-slate-500 mb-6 leading-relaxed group-hover:text-slate-700">
                                    Navega los inmensos ríos amazónicos. Lanchas rápidas, carga y rutas fluviales.
                                </CardDescription>
                                <div className="flex flex-wrap gap-2">
                                    <Badge className="bg-white/80 text-river-700 shadow-sm hover:bg-river-100 border border-river-100 transition-colors backdrop-blur-sm">Fluvial</Badge>
                                    <Badge variant="outline" className="border-river-200 text-river-600 bg-white/30 group-hover:bg-white/50">Logística</Badge>
                                </div>
                            </CardContent>
                            <CardFooter className="relative z-10 pt-2 pb-10">
                                <div className="flex items-center text-river-600 font-black text-sm uppercase tracking-widest group-hover:gap-3 transition-all">
                                    Ver Rutas <ArrowRight size={16} className="ml-2" />
                                </div>
                            </CardFooter>
                        </Card>
                    </Link>

                    {/* CARD 2: Gastronomía (Sunset/Flavor Theme) */}
                    <Link href="/restaurants" className="group">
                        <Card className="h-full border-0 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-15px_rgba(234,88,12,0.3)] overflow-hidden relative rounded-[2.5rem] transition-all duration-500 hover:-translate-y-3">
                            {/* Cinematic Background Image (Faded) */}
                            <div className="absolute inset-0 z-0">
                                <img src="/images/categories/gastronomia.jpg" alt="Background" className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-all duration-700 blur-[2px] group-hover:blur-0 scale-110 group-hover:scale-100" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent mix-blend-overlay" />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-br from-sunset-50/80 via-white/50 to-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                            <CardHeader className="relative z-10 pb-0">
                                {/* Image Logo Container */}
                                <div className="h-28 w-28 rounded-[2rem] p-1 bg-white shadow-lg shadow-sunset-900/10 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 ease-out">
                                    <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative">
                                        <img src="/images/categories/gastronomia.jpg" alt="Gastronomía" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <CardTitle className="text-3xl font-black text-slate-800 group-hover:text-sunset-700 transition-colors">Gastronomía</CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10 pt-4">
                                <CardDescription className="text-base font-medium text-slate-500 mb-6 leading-relaxed group-hover:text-slate-700">
                                    Sabores ancestrales y fusión exótica. Tacacho, Juane y la mejor cocina de la selva.
                                </CardDescription>
                                <div className="flex flex-wrap gap-2">
                                    <Badge className="bg-white/80 text-sunset-700 shadow-sm hover:bg-sunset-100 border border-sunset-100 transition-colors backdrop-blur-sm">Exótico</Badge>
                                    <Badge variant="outline" className="border-sunset-200 text-sunset-600 bg-white/30 group-hover:bg-white/50">Gourmet</Badge>
                                </div>
                            </CardContent>
                            <CardFooter className="relative z-10 pt-2 pb-10">
                                <div className="flex items-center text-sunset-600 font-black text-sm uppercase tracking-widest group-hover:gap-3 transition-all">
                                    Ver Carta <ArrowRight size={16} className="ml-2" />
                                </div>
                            </CardFooter>
                        </Card>
                    </Link>

                    {/* CARD 3: Ecoturismo (Jungle Theme) */}
                    <Link href="/experiences" className="group">
                        <Card className="h-full border-0 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-15px_rgba(22,163,74,0.3)] overflow-hidden relative rounded-[2.5rem] transition-all duration-500 hover:-translate-y-3">
                            {/* Cinematic Background Image (Faded) */}
                            <div className="absolute inset-0 z-0">
                                <img src="/images/categories/ecoturismo.png" alt="Background" className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-all duration-700 blur-[2px] group-hover:blur-0 scale-110 group-hover:scale-100" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent mix-blend-overlay" />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-br from-jungle-50/80 via-white/50 to-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                            <CardHeader className="relative z-10 pb-0">
                                {/* Image Logo Container */}
                                <div className="h-28 w-28 rounded-[2rem] p-1 bg-white shadow-lg shadow-jungle-900/10 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-out">
                                    <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative">
                                        <img src="/images/categories/ecoturismo.png" alt="Ecoturismo" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <CardTitle className="text-3xl font-black text-slate-800 group-hover:text-jungle-700 transition-colors">Ecoturismo</CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10 pt-4">
                                <CardDescription className="text-base font-medium text-slate-500 mb-6 leading-relaxed group-hover:text-slate-700">
                                    Conecta con la naturaleza virgen. Lodges, caminatas y expediciones salvajes.
                                </CardDescription>
                                <div className="flex flex-wrap gap-2">
                                    <Badge className="bg-white/80 text-jungle-700 shadow-sm hover:bg-jungle-100 border border-jungle-100 transition-colors backdrop-blur-sm">Aventura</Badge>
                                    <Badge variant="outline" className="border-jungle-200 text-jungle-600 bg-white/30 group-hover:bg-white/50">Naturaleza</Badge>
                                </div>
                            </CardContent>
                            <CardFooter className="relative z-10 pt-2 pb-10">
                                <div className="flex items-center text-jungle-600 font-black text-sm uppercase tracking-widest group-hover:gap-3 transition-all">
                                    Explorar <ArrowRight size={16} className="ml-2" />
                                </div>
                            </CardFooter>
                        </Card>
                    </Link>
                </div>
            </div>
        </section>
    );
}
