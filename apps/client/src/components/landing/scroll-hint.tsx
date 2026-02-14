"use client";

import { useState, useEffect } from "react";

export function ScrollHint() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Hide hint as soon as user scrolls down more than 50px
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 hidden md:flex transition-all duration-700 ease-out transform ${isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-10 scale-90 pointer-events-none blur-sm"
                }`}
        >
            <span className="text-xl md:text-2xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-blue-600 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)] font-heading uppercase filter brightness-110 cursor-default animate-pulse">
                Descubre la Amazonía
            </span>

            {/* Macaw Gradient Dashed Line 
          Using bg-gradient + mask-image to create a colored dashed line 
      */}
            <div
                className="h-16 w-[3px] animate-bounce shadow-[0_0_15px_rgba(251,191,36,0.8)]"
                style={{
                    backgroundImage: 'linear-gradient(to bottom, #ef4444, #fbbf24, #2563eb)',
                    maskImage: 'linear-gradient(to bottom, black 60%, transparent 40%)',
                    maskSize: '100% 12px',
                    maskRepeat: 'repeat-y',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 40%)',
                    WebkitMaskSize: '100% 12px',
                    WebkitMaskRepeat: 'repeat-y'
                }}
            />
        </div>
    );
}
