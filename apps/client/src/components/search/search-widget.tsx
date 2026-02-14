"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Calendar as CalendarIcon, Users, ArrowRight, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SearchWidgetProps {
    onSearch?: (filters: { origin: string; destination: string; date?: Date }) => void;
}

export function SearchWidget({ onSearch }: SearchWidgetProps) {
    const [origin, setOrigin] = useState("Iquitos")
    const [destination, setDestination] = useState("")
    const [date, setDate] = useState<Date>()
    const [passengers, setPassengers] = useState(1)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const handleSearch = () => {
        if (onSearch) {
            onSearch({ origin, destination, date })
        }
    }

    return (
        <div className="w-full max-w-6xl mx-auto font-sans relative z-30">
            {/* Main Light Glass Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden relative group"
            >
                {/* Decorative Top Line (Orange Gradient) */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600 opacity-90" />

                <div className="flex flex-col md:flex-row items-stretch">

                    {/* 1. Origin Input Area */}
                    <div className="flex-1 p-6 relative hover:bg-white/40 transition-colors group/input">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-orange-500" /> Origen
                        </Label>
                        <Input
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="bg-transparent !border-none !ring-0 !outline-none !shadow-none p-0 h-auto text-2xl font-medium text-slate-800 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none font-cormorant focus:bg-transparent"
                        />
                        {/* Animated Underline */}
                        <div className="absolute bottom-0 left-0 h-[3px] bg-orange-500 w-0 group-hover/input:w-full transition-all duration-500" />
                    </div>

                    {/* 2. Destination Input Area */}
                    <div className="flex-1 p-6 relative hover:bg-white/40 transition-colors group/input">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-orange-500" /> Destino
                        </Label>
                        <Input
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="¿A dónde vas?"
                            className="bg-transparent !border-none !ring-0 !outline-none !shadow-none p-0 h-auto text-2xl font-medium text-slate-800 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none font-cormorant focus:bg-transparent"
                        />
                        <div className="absolute bottom-0 left-0 h-[3px] bg-orange-500 w-0 group-hover/input:w-full transition-all duration-500" />
                    </div>

                    {/* 3. Date Selection */}
                    <div className="flex-1 p-6 relative hover:bg-white/40 transition-colors cursor-pointer group/input">
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                                <div className="w-full h-full flex flex-col justify-center outline-none ring-0 focus:ring-0 focus:outline-none">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <CalendarIcon className="w-3 h-3 text-orange-500" /> Fecha
                                    </Label>
                                    <span className={cn("text-xl md:text-2xl font-medium text-slate-800 truncate font-cormorant block pt-1", !date && "text-slate-400 italic")}>
                                        {date ? format(date, "d 'de' MMMM", { locale: es }) : "Seleccionar fecha"}
                                    </span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl overflow-hidden shadow-2xl border-0 bg-white border-slate-100" align="center">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(selectedDate) => {
                                        setDate(selectedDate);
                                        setIsCalendarOpen(false);
                                    }}
                                    initialFocus
                                    className="p-4 bg-white text-slate-800"
                                    classNames={{
                                        day_selected: "bg-orange-500 text-white shadow-md hover:bg-orange-600",
                                        day_today: "bg-slate-100 text-orange-600 font-bold",
                                        head_cell: "text-slate-400 font-bold",
                                        day: cn(
                                            "h-9 w-9 p-0 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-full transition-colors text-slate-600"
                                        ),
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        <div className="absolute bottom-0 left-0 h-[3px] bg-orange-500 w-0 group-hover/input:w-full transition-all duration-500" />
                    </div>

                    {/* 4. Action Button Area */}
                    <div className="w-full md:w-auto min-w-[200px] p-2 flex items-stretch">
                        <Button
                            onClick={handleSearch}
                            className="w-full h-auto rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white shadow-lg hover:shadow-orange-500/30 transition-all duration-300 group/btn border border-orange-400/20 relative overflow-hidden flex flex-col items-center justify-center gap-1"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

                            <span className="relative z-10 text-[10px] font-bold tracking-[0.2em] text-orange-50 uppercase opacity-90">Explorar</span>
                            <div className="relative z-10 flex items-center gap-2">
                                <span className="text-xl font-cinzel font-bold tracking-wide">BUSCAR</span>
                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                        </Button>
                    </div>

                </div>
            </motion.div>
        </div>
    )
}
