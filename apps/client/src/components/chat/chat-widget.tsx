'use client';
// Restaurando nucleo del bot original - Macaw v1

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Loader2, Bot, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useChat } from '@/hooks/use-chat';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Cinzel } from "next/font/google";

// Import Premium Font Locally
const cinzel = Cinzel({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap",
});

export function ChatWidget() {
    const { messages, loading, sendMessage } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            {isOpen && (
                <Card className="w-80 md:w-[26rem] h-[36rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.2)] border border-white/40 mb-6 animate-in slide-in-from-bottom-5 fade-in duration-300 flex flex-col overflow-hidden rounded-[2.5rem] bg-white/80 backdrop-blur-2xl ring-1 ring-white/60 supports-[backdrop-filter]:bg-white/60">

                    {/* Header: Glassy Emerald Gradient */}
                    <CardHeader className="p-0 overflow-hidden shrink-0 border-b border-white/10">
                        <div className="bg-gradient-to-br from-[#154D2E] via-[#0f3d24] to-[#0A2918] p-6 relative">
                            {/* Subtle Texture */}
                            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

                            <div className="flex justify-between items-center relative z-10">
                                <div className="flex gap-4 items-center">
                                    <div className="relative group">
                                        <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:bg-white/20 transition-all">
                                            <Bot size={24} className="text-[#FCD34D] drop-shadow-sm" />
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-[3px] border-[#0f3d24] rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
                                    </div>
                                    <div>
                                        <CardTitle className={cn("text-xl text-white font-semibold tracking-wide drop-shadow-md", cinzel.className)}>SelvaWasi</CardTitle>
                                        <div className="flex items-center gap-1.5 opacity-90">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                            <p className="text-[10px] text-emerald-50 font-bold tracking-[0.2em] uppercase">En línea</p>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-full w-9 h-9 transition-colors border border-transparent hover:border-white/10"
                                >
                                    <X size={20} />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    {/* Chat Content: Clean Transparent Glass (No Watermark) */}
                    <CardContent className="flex-1 overflow-y-auto p-5 space-y-6 relative scrollbar-thin scrollbar-thumb-emerald-900/10 scrollbar-track-transparent">

                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-5 opacity-90 z-10 relative mt-2">
                                <div className="w-16 h-16 bg-gradient-to-tr from-white to-emerald-50 rounded-2xl flex items-center justify-center rotate-3 shadow-[0_10px_20px_rgba(0,0,0,0.05)] border border-white/80">
                                    <Sparkles className="text-emerald-600" size={26} />
                                </div>
                                <div className="space-y-2 px-4">
                                    <p className={cn("text-xl text-stone-800 font-bold", cinzel.className)}>Explora el Amazonas</p>
                                    <p className="text-sm text-stone-500 leading-relaxed font-medium">
                                        ¿Deseas conocer rutas, gastronomía o leyendas locales?
                                    </p>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn("flex w-full z-10 relative animate-in fade-in slide-in-from-bottom-2 duration-300", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                <div className={cn(
                                    "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm transition-all hover:shadow-md",
                                    msg.role === 'user'
                                        ? "bg-gradient-to-br from-[#154D2E] to-[#0A3320] text-white rounded-br-none shadow-emerald-900/10 border border-emerald-800/20"
                                        : "bg-white/80 backdrop-blur-sm text-stone-700 border border-white/60 rounded-tl-none shadow-[0_4px_15px_rgba(0,0,0,0.03)]"
                                )}>
                                    <p>{msg.content}</p>
                                    {msg.links && msg.links.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-dashed border-opacity-20" style={{ borderColor: msg.role === 'user' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}>
                                            {msg.links.map((link, i) => (
                                                <Link key={i} href={link.url} passHref className="no-underline">
                                                    <Badge variant={msg.role === 'user' ? 'secondary' : 'outline'} className={cn(
                                                        "cursor-pointer text-[10px] py-1.5 px-3 transition-transform hover:scale-105 active:scale-95",
                                                        msg.role === 'user'
                                                            ? "bg-white/10 hover:bg-white/20 text-white border-transparent shadow-sm"
                                                            : "bg-emerald-50/50 text-emerald-700 border-emerald-200/50 hover:bg-emerald-100 hover:border-emerald-300"
                                                    )}>
                                                        {link.title} ↗
                                                    </Badge>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                                <div className="bg-white/60 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 flex items-center gap-3 border border-white/50 shadow-sm">
                                    <Loader2 size={16} className="animate-spin text-amber-500" />
                                    <span className="text-xs text-stone-500 tracking-widest uppercase font-bold">Bot Escribiendo...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    {/* Footer: Floating Glass Pill */}
                    <CardFooter className="p-5 pt-2 bg-transparent relative z-10">
                        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 bg-white/70 backdrop-blur-xl p-2 rounded-[1.5rem] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:bg-white/90 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                            <div className="flex-1 relative">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Escribe tu mensaje..."
                                    className="bg-transparent border-none focus-visible:ring-0 text-stone-700 placeholder:text-stone-400/80 pl-4 h-11 shadow-none font-medium"
                                />
                            </div>
                            <Button
                                type="submit"
                                size="icon"
                                disabled={loading || !input.trim()}
                                className="rounded-full w-11 h-11 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shrink-0 shadow-[0_4px_15px_rgba(245,158,11,0.3)] disabled:opacity-50 disabled:shadow-none transition-all hover:scale-105 active:scale-95"
                            >
                                <Send size={20} className="ml-0.5" strokeWidth={2.5} />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}

            {/* Launcher / Close Interaction - ALWAYS RED MACAW when toggling */}
            <div className="relative h-16 w-16 flex items-center justify-center">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "absolute inset-0 group h-16 w-16 rounded-full shadow-[0_10px_40px_rgba(21,77,46,0.25)] transition-all duration-500 z-50 p-0 overflow-visible",
                        "bg-[#154D2E] border-[4px] border-white/20 backdrop-blur-md",
                        "hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(21,77,46,0.35)]"
                    )}
                >
                    {/* Image Mask */}
                    <div className="absolute inset-0 rounded-full overflow-hidden bg-stone-900">
                        <img
                            src="/images/robotic-macaw.png"
                            alt="Chat"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    </div>

                    {/* Satellite (Pulsing Amber) */}
                    <div className="absolute top-0 right-0 h-4 w-4 bg-amber-500 border-[2.5px] border-[#154D2E] rounded-full shadow-[0_0_15px_rgba(245,158,11,0.6)] z-20 group-hover:scale-110 transition-transform">
                        <div className="absolute inset-0 bg-amber-400/50 rounded-full animate-ping"></div>
                    </div>
                </Button>
            </div>
        </div>
    );
}
