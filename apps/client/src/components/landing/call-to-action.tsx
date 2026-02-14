"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";

export function CallToAction() {
    return (
        <section className="relative py-32 overflow-hidden w-full">
            {/* Animated Wave Transition */}
            <div className="absolute top-0 left-0 right-0 z-20 overflow-hidden h-24 md:h-32 -translate-y-[98%] w-full pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path
                        fill="#0c0a09"
                        fillOpacity="0.2"
                        d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        className="animate-wave-slow"
                    ></path>
                    <path
                        fill="#0c0a09"
                        fillOpacity="0.5"
                        d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        className="animate-wave-medium"
                    ></path>
                    <path
                        fill="#0c0a09"
                        fillOpacity="1"
                        d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,160C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        className="animate-wave-fast"
                    ></path>
                </svg>
            </div>

            {/* Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/plaza-iquitos.jpg"
                    alt="Plaza de Iquitos"
                    className="w-full h-full object-cover grayscale-[0.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-stone-900/10" />

                {/* Decorative Rainbow/Light effect via excessive gradient mixing */}
                <div className="absolute top-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-amber-500/10 mix-blend-overlay" />
            </div>

            <div className="container relative z-10 px-4 pt-8">
                <div className="max-w-4xl mx-auto text-center space-y-8">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-sm font-medium animate-pulse">
                        <Sparkles size={16} className="text-amber-400" />
                        <span className="tracking-wider uppercase">La Yapita</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
                        ¿Listo para tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">próxima gran historia?</span>
                    </h2>

                    <p className="text-lg md:text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed shadow-black drop-shadow-md">
                        No dejes que te lo cuenten. Suscríbete para recibir guías secretas, descuentos en lodges y la inspiración que necesitas para tu viaje.
                    </p>

                    {/* Newsletter Form */}
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto pt-4">
                        <Input
                            type="email"
                            placeholder="Tu correo electrónico..."
                            className="h-14 bg-white/10 border-white/20 text-white placeholder:text-stone-300 focus:bg-white/20 transition-all rounded-full px-6 text-lg backdrop-blur-sm"
                        />
                        <Button className="h-14 px-8 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-lg shadow-xl shadow-emerald-900/30 hover:scale-105 transition-all">
                            Suscribirme <Send size={18} className="ml-2" />
                        </Button>
                    </div>

                    <p className="text-sm text-stone-400 pt-4 italic">
                        * Tu aventura comienza aquí. Inspiración pura, directo a ti.
                    </p>
                </div>
            </div>
        </section>
    );
}
