"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollHint } from "@/components/landing/scroll-hint";
import { Categories } from "@/components/landing/categories";
import { History } from "@/components/landing/history";
import { IntroReveal } from "@/components/landing/intro-reveal";
import { CallToAction } from "@/components/landing/call-to-action";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      {/* 
          HERO SECTION - STRATEGY FOR SHORT IMAGES ("BLUR STRETCH")
      */}
      <section className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center z-0 bg-stone-900">

        {/* PARALLAX CONTAINER */}
        <div
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }} // Slow parallax bg
        >
          {/* Layer 1: AMBIANCE (Blur Stretch) */}
          <div
            className="absolute inset-0 bg-[url('/images/iquitos-river.jpg')] bg-cover bg-center opacity-60 blur-2xl scale-110"
            aria-hidden="true"
          />

          {/* Layer 2: MAIN IMAGE (Crisp) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-transparent to-stone-900/60 z-10" />
            <div
              className="relative w-full h-full bg-[url('/images/iquitos-river.jpg')] bg-cover bg-center z-0 shadow-2xl"
            />
          </div>
        </div>

        {/* CONTENT OVERLAY - STICKY FADE */}
        <div
          className="relative z-30 container mx-auto px-4 h-full flex flex-col items-center justify-start text-center pt-32 md:pt-40 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.4}px)`,
            opacity: Math.max(0, 1 - scrollY / 600)
          }}
        >
          {/* Badge */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-stone-900/40 backdrop-blur-md border border-white/10 text-amber-200 text-sm font-semibold tracking-widest uppercase shadow-2xl hover:bg-stone-900/60 transition-colors cursor-default">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Vive la Amazonía
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tighter drop-shadow-2xl font-cinzel text-white animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            SELVA<span className="text-amber-400">WASI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-stone-100 max-w-2xl font-light leading-relaxed drop-shadow-md font-sans mb-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            Explora la biodiversidad, navega los ríos y conecta con la cultura.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 w-full justify-center animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <a href="/routes" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-emerald-900/20 text-lg tracking-wide w-full sm:w-auto min-w-[200px]">
              Explorar Rutas
            </a>
            <a href="/experiences" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white text-lg tracking-wide w-full sm:w-auto min-w-[200px]">
              Experiencias
            </a>
          </div>
        </div>

        {/* Scroll Hint */}
        <div style={{ opacity: Math.max(0, 1 - scrollY / 300) }}>
          <ScrollHint />
        </div>
      </section>

      {/* REVEAL CURTAIN - New Section (Intro) */}
      <IntroReveal />

      {/* MAIN CONTENT - Pushed down */}
      <div className="bg-stone-50 relative z-10">
        <Categories />
        <History />

        {/* "LA YAPITA" - Call To Action Section */}
        <CallToAction />
      </div>

      <Footer />
    </div>
  );
}
