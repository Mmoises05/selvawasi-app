"use client";

import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Landmark, Leaf, Sparkles, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

interface TimelineItemProps {
    title: string;
    category: string;
    description: string;
    image: string;
    icon: React.ReactNode;
    align: "left" | "right";
    index: number;
    imageFit?: "cover" | "contain";
}

function TimelineItem({ title, category, description, image, icon, align, index, imageFit = "cover" }: TimelineItemProps) {
    const isLeft = align === "left";

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-24 md:mb-40 relative z-10 ${isLeft ? '' : 'md:flex-row-reverse'}`}
        >
            {/* Image Card - Glassmorphism */}
            <div className="w-full md:w-1/2 group">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl transition-all duration-500 hover:shadow-emerald-500/20 hover:border-white/20">
                    <div className="aspect-[4/3] overflow-hidden flex items-center justify-center bg-black/20">
                        <img
                            src={image}
                            alt={title}
                            className={`w-full h-full object-${imageFit} transition-transform duration-700 group-hover:scale-110`}
                        />
                        {/* Gradient Overlay for Text Readability if needed, but keeping it clean for 'transparency' feel */}
                        <div className="absolute inset-0 bg-gradient-to-t from-jungle-950/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                    </div>

                    {/* Floating Badge on Image */}
                    <div className="absolute top-4 left-4">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg">
                            {icon}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Text */}
            <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
                <motion.div
                    initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10 px-4 py-1 text-xs tracking-[0.2em] uppercase backdrop-blur-md">
                        {category}
                    </Badge>
                </motion.div>

                <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight font-serif tracking-tight">
                    {title}
                </h3>

                <p className="text-stone-300 text-lg leading-relaxed font-light">
                    {description}
                </p>

                <div className="pt-4">
                    <button className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2 mx-auto md:mx-0 uppercase tracking-widest group">
                        Explorar Historia
                        <span className="block h-[1px] w-8 bg-emerald-500 transition-all group-hover:w-12" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export function History() {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start center", "end center"]
    });

    const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

    const timelineEvents = [
        {
            category: "Nuestros Orígenes",
            title: "La Época del Caucho",
            description: "Un viaje al pasado glorioso de Iquitos. Recorre las casonas históricas, los azulejos importados de Europa y revive la bonanza que transformó una aldea amazónica en una metrópoli cosmopolita.",
            image: "/images/history/origins.png",
            icon: <Landmark size={20} />,
            align: "left"
        },
        {
            category: "Cultura Viva",
            title: "El Ayaymama",
            description: "Déjate envolver por los mitos ancestrales. Desde el canto triste del Ayaymama hasta los misterios del Tunche. Historias que cobran vida en cada rincón de la selva y en la calidez de nuestra gente.",
            image: "/images/history/ayaymama.png",
            icon: <Sparkles size={20} />,
            align: "right"
        },
        {
            category: "Flora y Fauna",
            title: "Biodiversidad Única",
            description: "El hogar del delfín rosado, manatíes y miles de especies que solo encontrarás aquí. Una explosión de vida y color que te conecta directamente con el corazón del planeta.",
            image: "/images/history/biodiversity-collage.png",
            icon: <Leaf size={20} />,
            align: "left"
        }
    ];
    // RETRYING THOUGHT PROCESS: 
    // User said "no recortes" (don't crop). 
    // If I use object-cover, it crops. 
    // If I use object-contain, it doesn't crop but might leave bars.
    // I will use `imageFit: "contain"` (as a string literal in the object).
    // Wait, I messed up the ReplacementContent above in my thought process. I need to deliver the code.

    // Let's implement the `imageFit` prop correctly in the component and pass "contain" for the last item.


    return (
        <section ref={containerRef} className="relative w-full py-32 overflow-hidden bg-jungle-950">
            {/* Background Image - Parallax/Fixed Feel */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/bg-nanay.jpg"
                    alt="Background"
                    className="w-full h-full object-cover opacity-20 blur-sm scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-jungle-950 via-jungle-950/80 to-jungle-950" />

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            <div className="container px-4 sm:px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-32 space-y-6">
                    {/* Rainbow Dolphin Animation */}
                    <div className="relative w-full max-w-3xl mx-auto h-40 mb-4 overflow-visible pointer-events-none select-none">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 600 150" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0" />
                                    <stop offset="10%" stopColor="#EF4444" /> {/* Red */}
                                    <stop offset="25%" stopColor="#F97316" /> {/* Orange */}
                                    <stop offset="40%" stopColor="#EAB308" /> {/* Yellow */}
                                    <stop offset="55%" stopColor="#22C55E" /> {/* Green */}
                                    <stop offset="70%" stopColor="#3B82F6" /> {/* Blue */}
                                    <stop offset="85%" stopColor="#A855F7" /> {/* Purple */}
                                    <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            {/* Rainbow Arc */}
                            <motion.path
                                d="M0,140 Q300,-40 600,140"
                                fill="none"
                                stroke="url(#rainbowGradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                filter="url(#glow)"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 0.6 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                        </svg>


                    </div>

                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="text-6xl md:text-8xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 via-amber-100 to-emerald-200 font-[family-name:var(--font-cormorant)] italic tracking-tight"
                    >
                        Ecos de la Amazonía
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Una historia escrita por el río, la naturaleza y sus leyendas.
                    </motion.p>
                </div>

                {/* Timeline Container */}
                <div ref={timelineRef} className="relative">
                    {/* Central Line */}
                    {/* Central Vine & Monkey */}
                    {/* Central Vine & Monkey */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[80px] -translate-x-1/2 hidden md:block pointer-events-none">
                        {/* The Vine (Liana) */}
                        <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 60 100">
                            {/* Base Vine Path */}
                            <path
                                d="M30,0 Q35,25 30,50 Q25,75 30,100"
                                className="stroke-jungle-800/40"
                                strokeWidth="3"
                                fill="none"
                                vectorEffect="non-scaling-stroke"
                            />
                            {/* Growing Green Vine Effect */}
                            <motion.path
                                d="M30,0 Q35,25 30,50 Q25,75 30,100"
                                className="stroke-lime-500"
                                strokeWidth="3"
                                fill="none"
                                vectorEffect="non-scaling-stroke"
                                style={{ pathLength: scrollYProgress }}
                            />
                        </svg>

                        {/* The Sliding Monkey */}
                        <motion.div
                            style={{
                                top: height,
                                x: "-50%"
                            }}
                            className="absolute left-1/2 w-20 h-20 -ml-0 -mt-2 z-20 pointer-events-none"
                        >
                            <img
                                src="/images/hanging-monkey.png"
                                alt="Monito"
                                className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                            />
                        </motion.div>
                    </div>

                    {/* Timeline Items */}
                    <div className="space-y-20 md:space-y-0">
                        {timelineEvents.map((event, idx) => (
                            <TimelineItem
                                key={idx}
                                index={idx}
                                {...event}
                                align={event.align as "left" | "right"}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
