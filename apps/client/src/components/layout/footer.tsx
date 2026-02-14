import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone, Heart } from "lucide-react";

import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
    return (
        <footer className={cn("relative bg-stone-950 text-stone-300 pt-20 pb-10 overflow-hidden", className)}>
            {/* Decorative Top Gradient - Macaw Flow */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-yellow-500 to-blue-600 bg-[length:200%_auto] animate-flow opacity-90 shadow-[0_0_15px_rgba(255,255,255,0.3)]" />

            {/* Subtle Background Texture */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="text-3xl font-cinzel font-bold text-white tracking-wide">
                                SelvaWasi
                            </span>
                        </Link>
                        <p className="text-stone-400 leading-relaxed max-w-sm">
                            Tu puerta de entrada a la Amazonía. Conectamos viajeros con la esencia, la cultura y la magia de Iquitos, creando memorias que duran para siempre.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { icon: Facebook, href: "#" },
                                { icon: Instagram, href: "#" },
                                { icon: Twitter, href: "#" },
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 transition-all duration-300 group"
                                >
                                    <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-white font-bold text-lg">Descubre</h4>
                        <ul className="space-y-3">
                            {['Experiencias', 'Destinos', 'Gastronomía', 'Hospedaje', 'Blog'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href="#"
                                        className="text-stone-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-red-500 hover:via-yellow-500 hover:to-blue-600 transition-all duration-300 font-medium"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="lg:col-span-3 space-y-6">
                        <h4 className="text-white font-bold text-lg">Contacto</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-stone-400 group">
                                <MapPin className="mt-1 text-emerald-500 group-hover:text-emerald-400 transition-colors" size={18} />
                                <span>Jr. Próspero 123, Iquitos,<br />Loreto, Perú</span>
                            </li>
                            <li className="flex items-center gap-3 text-stone-400 group">
                                <Mail className="text-emerald-500 group-hover:text-emerald-400 transition-colors" size={18} />
                                <a href="mailto:hola@selvawasi.com" className="hover:text-white transition-colors">hola@selvawasi.com</a>
                            </li>
                            <li className="flex items-center gap-3 text-stone-400 group">
                                <Phone className="text-emerald-500 group-hover:text-emerald-400 transition-colors" size={18} />
                                <a href="tel:+51987654321" className="hover:text-white transition-colors">+51 987 654 321</a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal/App Column */}
                    <div className="lg:col-span-3 space-y-6">
                        <h4 className="text-white font-bold text-lg">Legal</h4>
                        <ul className="space-y-3">
                            {['Términos y Condiciones', 'Política de Privacidad', 'Libro de Reclamaciones'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href="#"
                                        className="text-stone-400 hover:text-white transition-colors text-sm"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-6">
                            <p className="text-xs font-semibold text-emerald-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Próximamente
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                {/* App Store Badge - User's Custom Icon */}
                                <button className="flex items-center bg-black border border-stone-800 rounded-lg px-3 py-2 transition-transform hover:-translate-y-1 hover:shadow-lg w-auto h-[48px] min-w-[150px]">
                                    <div className="mr-3 shrink-0">
                                        {/* Using the copied image with white filter for contrast on black bg */}
                                        <img
                                            src="/images/apple-logo-final.png"
                                            alt="Apple Logo"
                                            className="h-[24px] w-auto object-contain invert"
                                        />
                                    </div>
                                    <div className="flex flex-col items-start justify-center leading-none">
                                        <span className="text-[10px] text-stone-300 font-medium mb-0.5">Download on the</span>
                                        <span className="text-[16px] font-bold text-white font-sans tracking-wide">App Store</span>
                                    </div>
                                </button>

                                {/* Google Play Badge - User's Custom Icon */}
                                <button className="flex items-center bg-black border border-stone-800 rounded-lg px-3 py-2 transition-transform hover:-translate-y-1 hover:shadow-lg w-auto h-[48px] min-w-[160px]">
                                    <div className="mr-3 shrink-0">
                                        {/* Using the copied image with original colors */}
                                        <img
                                            src="/images/google-play-v2.png"
                                            alt="Google Play Logo"
                                            className="h-[24px] w-auto object-contain"
                                        />
                                    </div>
                                    <div className="flex flex-col items-start justify-center leading-none">
                                        <span className="text-[10px] text-stone-300 font-medium uppercase mb-0.5">GET IT ON</span>
                                        <span className="text-[16px] font-bold text-white font-sans tracking-wide">Google Play</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-center text-center gap-4">
                    <p className="text-stone-500 text-sm flex items-center justify-center gap-1.5">
                        © {new Date().getFullYear()} SelvaWasi. Hecho con <Heart size={14} className="text-emerald-500 fill-emerald-500 animate-pulse" /> en la Amazonía.
                    </p>
                </div>
            </div>
        </footer>
    );
}
