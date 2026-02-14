import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
    return (
        <div className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 text-center z-10">
            {/* Decorative Gradient Line (Rainbow Arc simplified) */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 rounded-full blur-sm" />

            <h1 className="text-5xl md:text-6xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 to-amber-100 font-[family-name:var(--font-cormorant)] italic tracking-tight mb-4 drop-shadow-sm">
                {title}
            </h1>

            {subtitle && (
                <p className="text-stone-300 text-lg md:text-xl font-light max-w-2xl mx-auto mb-8 leading-relaxed">
                    {subtitle}
                </p>
            )}

            {children}
        </div>
    );
}
