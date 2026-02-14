"use client";

import { useState, useEffect } from "react";
import { Compass, Sparkles } from "lucide-react";

export function HeroContent() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="relative z-30 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center pt-20">

            {/* STATE 1: INITIAL (Gold Title) - Fades OUT on Scroll */}
            <div
                className={`transition-all duration-700 ease-in-out absolute flex flex-col items-center ${scrolled ? "opacity-0 translate-y-10 scale-95 pointer-events-none" : "opacity-100 translate-y-0 scale-100"
                    }`}
            >
                {/* Badge */}
                <div className="mb-8">
                    <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-stone-900/30 backdrop-blur-sm border border-white/10 text-amber-200 text-sm font-semibold tracking-widest uppercase shadow-lg">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Vive la Amazonía
                    </span>
                </div>

                {/* Main Title - Serif & Gold */}
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tighter drop-shadow-2xl font-cinzel text-white">
                    SELVA<span className="text-amber-400">WASI</span>
                </h1>

                <p className="text-xl md:text-2xl text-stone-200/90 max-w-2xl font-light leading-relaxed drop-shadow-md font-sans">
                    Explora la biodiversidad, navega los ríos y conecta con la cultura.
                </p>
            </div>


            {/* STATE 2: SCROLLED (Bottom Curtain / Sheet) */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${scrolled ? "translate-y-0" : "translate-y-full"
                    }`}
            >
                {/* Glass Sheet Container - 70% Height, Rounded Top */}
                <div className="w-full h-[70vh] bg-stone-900/80 backdrop-blur-2xl border-t border-white/20 rounded-t-[4rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-center relative overflow-hidden">

                    {/* Glossy Reflection overlay */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm" />

                    <div className="container mx-auto px-4 max-w-4xl relative z-10 flex flex-col items-center">

                        {/* Compass Icon */}
                        <div className="mb-8 p-5 rounded-full border border-white/10 bg-white/5 shadow-inner">
                            <Compass className="w-10 h-10 text-emerald-200" strokeWidth={1} />
                        </div>

                        {/* Italic Subtitle */}
                        <p className="text-3xl md:text-4xl font-serif italic text-amber-200 mb-6 font-cinzel tracking-wider animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            La selva te llama
                        </p>

                        {/* Main CTA Title */}
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-10 font-cinzel tracking-tight leading-none drop-shadow-2xl">
                            EMPIEZA LA AVENTURA
                        </h2>

                        {/* Separator */}
                        <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent mb-12" />

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                            <a
                                href="/routes"
                                className="group px-10 py-5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-full transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-emerald-900/40 text-lg tracking-wide w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-3"
                            >
                                <Sparkles className="w-5 h-5 text-emerald-200 animate-pulse" />
                                Explorar Rutas
                            </a>

                            <a
                                href="/experiences"
                                className="px-10 py-5 bg-transparent border border-white/20 text-white font-bold rounded-full transition-all duration-500 hover:bg-white/10 hover:border-white text-lg tracking-wide w-full sm:w-auto min-w-[220px]"
                            >
                                Experiencias
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
