"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function IntroReveal() {
    return (
        <section className="relative z-10 bg-stone-50 pt-32 pb-16 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
            <div className="container px-4">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 leading-tight">
                        "La Amazonía no se visita, <span className="text-emerald-700 italic">se vive</span>."
                    </h2>
                    <p className="text-lg md:text-xl text-stone-600 leading-relaxed font-light">
                        SelvaWasi es tu puerta de entrada al corazón del planeta. Hemos curado las mejores experiencias para que descubras Iquitos más allá de lo convencional. Desde navegar ríos infinitos hasta probar sabores que no sabías que existían.
                    </p>
                    <div className="pt-8">
                        <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}
