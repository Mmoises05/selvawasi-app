"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export function ParallaxHero() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
    const foregroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <div
            ref={ref}
            className="relative w-full h-[120vh] overflow-hidden bg-stone-900"
        >
            {/* 1. Background Layer (Sky/River) - Moves slowest */}
            <motion.div
                className="absolute inset-0 z-0 h-[120%]"
                style={{ y: backgroundY }}
            >
                <Image
                    src="/images/iquitos-river.jpg"
                    alt="Amazon River Background"
                    fill
                    className="object-cover brightness-75"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-900/40" />
            </motion.div>

            {/* 2. Middle Layer (Text) - Moves faster but is BEHIND foreground */}
            <motion.div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-20"
                style={{ y: textY }}
            >
                <h1 className="text-[12vw] md:text-[8vw] font-bold text-white tracking-tighter drop-shadow-2xl leading-none font-outfit text-center">
                    SELVA<span className="text-emerald-400">WASI</span>
                </h1>
                <p className="text-xl md:text-3xl text-white/90 font-light tracking-widest mt-4 uppercase drop-shadow-lg">
                    La Esencia del Amazonas
                </p>
            </motion.div>

            {/* 3. Foreground Layer (Vegetation/Macaw) - Moves seemingly faster or differently to create depth */}
            {/* Since we don't have a perfect jungle cutout, we'll use a gradient mask at the bottom and a floating element */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 z-20 h-full pointer-events-none"
                style={{ y: foregroundY }}
            >
                {/* Simulated Foreground Gradient to hide bottom text clipping */}
                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-stone-50 via-stone-50/80 to-transparent" />

                {/* Optional: Floating Macaw in foreground */}
                <div className="absolute bottom-[20%] right-[10%] w-[30vw] max-w-[400px] aspect-square opacity-90 hidden md:block">
                    <Image
                        src="/images/macaw-isolated.png"
                        alt="Macaw"
                        fill
                        className="object-contain drop-shadow-2xl"
                    />
                </div>
            </motion.div>

            {/* Content Overlay for spacing */}
            <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center pb-20">
                <div className="animate-bounce">
                    <svg
                        className="w-10 h-10 text-white opacity-80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
