"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Cinzel } from "next/font/google";

// PREMIUM FONT SETUP - Direct Import
const cinzel = Cinzel({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    display: "swap",
});

export function Preloader() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Velocidad de carga suave y realista
                const increment = Math.random() * 1.5 + 0.5;
                return Math.min(prev + increment, 100);
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress === 100) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                const unmountTimer = setTimeout(() => {
                    setIsMounted(false);
                }, 800);
                return () => clearTimeout(unmountTimer);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [progress]);

    if (!isMounted) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-[9999] flex flex-col justify-between transition-all duration-1000 ease-in-out cursor-none overflow-hidden",
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none scale-110 filter blur-xl",
                "bg-stone-950 text-white"
            )}
        >
            {/* 1. Fullscreen Background Image - Sunset Amazon */}
            <div className="absolute inset-0 z-0 select-none">
                <img
                    src="/images/preloader-bg.jpg"
                    alt="Sunset Amazon"
                    className="w-full h-full object-cover opacity-100 animate-pulse-slow scale-105"
                    style={{ animationDuration: '40s' }}
                />
                {/* Cinematic Gradient overlay for text visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-transparent to-stone-950/90" />
                <div className="absolute inset-0 bg-stone-900/10 backdrop-brightness-90" />
            </div>

            {/* Top Bar - Elegant & Minimal */}
            <div className="relative z-10 flex justify-between items-start w-full p-8 md:p-12 lg:p-16 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                <div className="flex flex-col">
                    <span
                        className={cn("text-xs md:text-sm font-light tracking-[0.3em] uppercase text-orange-200/90 mb-2 drop-shadow-md")}
                    >
                        Bienvenido a
                    </span>
                    <h1
                        className={cn(
                            "text-4xl md:text-6xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wide leading-tight",
                            cinzel.className
                        )}
                    >
                        Selva<span className="text-orange-400">Wasi</span>
                    </h1>
                </div>

                <div className="hidden md:flex flex-col text-right">
                    <span className={cn("text-xs md:text-sm font-light tracking-[0.3em] uppercase text-orange-200/90 mb-2")}>Estado</span>
                    <div className="flex items-center gap-3 justify-end">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping shadow-[0_0_10px_#F97316]" />
                        <span className={cn("text-lg font-light text-white drop-shadow-md", cinzel.className)}>Cargando experiencia</span>
                    </div>
                </div>
            </div>

            {/* Bottom Interface Area */}
            <div className="relative z-10 flex justify-between items-end w-full px-8 md:px-12 lg:px-16 pb-32 md:pb-40">
                {/* Identity - REDESIGNED: Luxury Bracket Style */}
                <div className="relative p-6 md:p-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
                    {/* Decorative Corners - GOLDEN TOUCH */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-orange-400/80 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-orange-400/80 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" />

                    {/* Content */}
                    <div className="flex flex-col gap-2 pl-2">
                        <span className="text-xs md:text-sm tracking-[0.4em] text-orange-100/70 uppercase font-light ml-1">Ubicación Actual</span>
                        <h2
                            className={cn(
                                "text-5xl md:text-8xl text-white uppercase tracking-tighter drop-shadow-2xl leading-none",
                                cinzel.className
                            )}
                        >
                            Amazonía
                        </h2>

                        <div className="flex items-center gap-4 mt-2">
                            <div className="h-[1px] w-16 bg-gradient-to-r from-orange-400 to-transparent" />
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                                <span
                                    className={cn(
                                        "text-lg md:text-xl tracking-[0.2em] font-medium text-orange-50",
                                        cinzel.className
                                    )}
                                >
                                    IQUITOS, PERÚ
                                </span>
                                <span className="text-[10px] md:text-xs text-orange-300/60 font-mono tracking-widest">03°44′S 73°15′W</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Counter - ELEGANT SERIF STYLE */}
                <div className="flex flex-col items-end leading-none select-none drop-shadow-2xl relative">
                    <div className="flex items-start relative">
                        {/* Number with Gradient */}
                        <span
                            className={cn(
                                "text-[8rem] md:text-[13rem] font-medium italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-orange-100 to-orange-500 drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] pr-8 z-10",
                                cinzel.className
                            )}
                        >
                            {Math.floor(progress)}
                        </span>
                        {/* Percentage Symbol */}
                        <span
                            className={cn(
                                "text-3xl md:text-6xl italic text-orange-400 mt-8 md:mt-12 opacity-90 absolute right-0 top-0",
                                cinzel.className
                            )}
                        >
                            %
                        </span>
                    </div>

                    <span className={cn("text-xs md:text-sm tracking-[0.6em] text-orange-200/60 uppercase font-light mr-4 -mt-6 md:-mt-10", cinzel.className)}>
                        Preparando entorno...
                    </span>
                </div>
            </div>

            {/* "Jungle Floor" - SIMPLIFIED / CLEANER */}
            <div className="absolute bottom-0 left-0 w-full h-40 z-20 pointer-events-none">
                {/* Soft Gradient for Contrast */}
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black via-black/80 to-transparent opacity-95" />

                {/* Elegant Gold Progress Line */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
                    <div
                        className="h-full bg-gradient-to-r from-orange-600 via-orange-400 to-amber-200 shadow-[0_0_25px_#F97316] transition-all duration-300 ease-linear relative"
                        style={{ width: `${progress}%` }}
                    >
                        {/* Glowing Tip */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-1 bg-white blur-[2px]" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-orange-300 rounded-full blur-[4px]" />
                    </div>
                </div>

                {/* The Jaguar - STATIC GLIDE (High Quality Original) */}
                <div
                    className="absolute bottom-0 z-30 h-32 w-48 md:h-52 md:w-80 transition-all duration-300 ease-linear will-change-transform"
                    style={{
                        left: `${progress}%`,
                        transform: 'translateX(-65%) translateY(5px)' // Slight adjustment to sit on line
                    }}
                >
                    {/* Main Static High-Res Image - No CSS distortion */}
                    <img
                        src="/images/jaguar-running.png"
                        alt="Running Jaguar"
                        className="w-full h-full object-contain brightness-110 contrast-110 filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]"
                    />

                    {/* Subtle Motion Blur/Trail Effect (Static) */}
                    <div className="absolute bottom-6 right-1/4 w-40 h-20 bg-gradient-to-r from-transparent to-orange-600/10 blur-2xl transform translate-y-2 opacity-60 mix-blend-screen" />
                </div>
            </div>
        </div>
    );
}
