'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    ChevronLeft,
    Calendar,
    Clock,
    Ship,
    User,
    Mail,
    Phone,
    Minus,
    Plus,
    Printer,
    CheckCircle2,
    MapPin,
    AlertCircle,
    UserCircle2,
    Luggage,
    FileText,
    Leaf,
    Compass,
    Waves,
    Armchair,
    ArrowRight,
    CreditCard,
    Sun
} from 'lucide-react';
import QRCode from "react-qr-code";
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { AnimatePresence, motion } from 'framer-motion';

// --- DATA: COUNTRIES & CODES ---
const COUNTRY_CODES = [
    { code: '+51', country: 'Peru', flag: 'https://flagcdn.com/w40/pe.png' },
    { code: '+1', country: 'USA/Canada', flag: 'https://flagcdn.com/w40/us.png' },
    { code: '+55', country: 'Brazil', flag: 'https://flagcdn.com/w40/br.png' },
    { code: '+57', country: 'Colombia', flag: 'https://flagcdn.com/w40/co.png' },
    { code: '+56', country: 'Chile', flag: 'https://flagcdn.com/w40/cl.png' },
    { code: '+54', country: 'Argentina', flag: 'https://flagcdn.com/w40/ar.png' },
    { code: '+52', country: 'Mexico', flag: 'https://flagcdn.com/w40/mx.png' },
    { code: '+34', country: 'Spain', flag: 'https://flagcdn.com/w40/es.png' },
    { code: '+44', country: 'UK', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: '+33', country: 'France', flag: 'https://flagcdn.com/w40/fr.png' },
    { code: '+49', country: 'Germany', flag: 'https://flagcdn.com/w40/de.png' },
    { code: '+39', country: 'Italy', flag: 'https://flagcdn.com/w40/it.png' },
];

interface Passenger {
    id: number;
    firstName: string;
    lastName: string;
    docType: 'DNI' | 'PASAPORTE';
    docNumber: string;
    isPrimary: boolean;
}

// Seat Types for Logic Enhancement
const SEAT_TYPES = [
    { id: 'standard', name: 'Estándar', priceMod: 0, desc: 'Comodidad esencial en cubierta principal.', icon: Armchair },
    { id: 'window', name: 'Ventana Panorámica', priceMod: 20, desc: 'Vistas ininterrumpidas del río.', icon: Waves },
    { id: 'upper', name: 'Cubierta Superior', priceMod: 35, desc: 'Aire libre y mejor vista.', icon: Sun },
];

export default function FleetBookingWizard() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const scheduleId = params.id;

    // Context
    const boatName = searchParams.get('boatName') || 'Experiencia Amazonía';
    const basePrice = parseFloat(searchParams.get('price') || '150');

    // Mock Route Data
    const routeDetails = {
        id: scheduleId as string,
        origin: 'Iquitos',
        destination: 'Nauta',
        time: '08:00 AM',
        date: new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        basePrice: basePrice,
        company: 'Selva Wasi Fleet',
        boatName: boatName,
        duration: '2h 30m'
    };

    // State
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Booking Logic State
    const [selectedSeatType, setSelectedSeatType] = useState('standard');
    const [passengers, setPassengers] = useState<Passenger[]>([
        { id: 1, firstName: '', lastName: '', docType: 'DNI', docNumber: '', isPrimary: true }
    ]);
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+51');
    const [reservationCode, setReservationCode] = useState<string | null>(null);

    // Derived State
    const currentSeatPrice = routeDetails.basePrice + (SEAT_TYPES.find(s => s.id === selectedSeatType)?.priceMod || 0);
    const totalPrice = currentSeatPrice * passengers.length;

    // --- HANDLERS ---
    const updatePassenger = (id: number, field: keyof Passenger, value: string) => {
        setPassengers(prev => prev.map(p => {
            if (p.id !== id) return p;
            if (field === 'docNumber') {
                if (p.docType === 'DNI') {
                    if (!/^\d*$/.test(value)) return p;
                    if (value.length > 8) return p;
                }
                if (p.docType === 'PASAPORTE' && value.length > 12) return p;
            }
            if ((field === 'firstName' || field === 'lastName') && !/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(value)) return p;
            return { ...p, [field]: value };
        }));
    };

    const handlePassengerCountChange = (delta: number) => {
        setPassengers(prev => {
            const count = prev.length + delta;
            if (count < 1 || count > 10) return prev;
            if (delta > 0) {
                return [...prev, { id: Date.now(), firstName: '', lastName: '', docType: 'DNI', docNumber: '', isPrimary: false }];
            } else {
                return prev.slice(0, -1);
            }
        });
    };

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleReservation = async () => {
        // Validation
        if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
            alert("Por favor ingresa un email válido.");
            return;
        }
        if (!contactPhone || contactPhone.length < 6) {
            alert("Por favor ingresa un número de teléfono válido.");
            return;
        }

        setLoading(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 2500));
        const code = 'SW-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        setReservationCode(code);
        setLoading(false);
    };

    const handlePrint = () => window.print();

    // --- RENDER: TICKET GENERATION (One per page) ---
    if (reservationCode) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden print:p-0 print:m-0 print:bg-white print:overflow-visible">

                {/* Screen Feedback */}
                <div className="print:hidden text-center mb-12 animate-in fade-in zoom-in duration-500 relative z-10">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 size={40} className="text-emerald-600" />
                    </div>
                    <h1 className="text-4xl font-cinzel font-bold text-slate-900 mb-4">¡Reserva Exitosa!</h1>
                    <p className="text-slate-500 text-lg mb-8">Tus tickets están listos para imprimir.</p>

                    <div className="flex gap-4 justify-center">
                        <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
                            <Printer size={18} /> Imprimir Todos
                        </Button>
                        <Button onClick={() => router.push('/boats')} variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50 h-12 px-8 rounded-xl font-bold">
                            Volver
                        </Button>
                    </div>
                </div>

                {/* Print Layout: One Ticket Per Page */}
                <div className="w-full max-w-4xl print:max-w-none print:w-full">
                    {passengers.map((p, index) => (
                        <div
                            key={p.id}
                            className={cn(
                                "bg-white border-2 border-slate-200 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-xl print:shadow-none print:border-slate-800 print:rounded-none print:mb-0 print:border-0 print:h-screen print:flex print:flex-col print:justify-center",
                                "print:break-after-page" // FORCE NEW PAGE
                            )}
                        >
                            {/* Decorative Header (Selva Wasi Style) */}
                            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600 print:h-2" />

                            <div className="flex justify-between items-start mb-12 print:mb-8">
                                <div className="flex items-center gap-4">
                                    {/* Logo Placeholder */}
                                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-emerald-700 print:border print:border-slate-300">
                                        <Ship size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-cinzel font-bold text-slate-900 uppercase">Selva Wasi</h2>
                                        <p className="text-sm font-bold tracking-[0.2em] text-amber-600 uppercase">Boarding Pass</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reserva</p>
                                    <p className="text-3xl font-mono font-bold text-slate-900 tracking-wider">{reservationCode}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-12 mb-12 print:gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pasajero</p>
                                        <p className="text-2xl font-bold text-slate-900 capitalize">{p.firstName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Documento</p>
                                        <p className="text-xl font-mono text-slate-600">{p.docType}: {p.docNumber}</p>
                                    </div>
                                    <div className="pt-4">
                                        <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-bold">
                                            {SEAT_TYPES.find(s => s.id === selectedSeatType)?.name || 'Estándar'}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha</p>
                                            <p className="text-xl font-bold text-slate-900 capitalize">{routeDetails.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Hora</p>
                                            <p className="text-xl font-bold text-emerald-600">{routeDetails.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Origen</p>
                                            <p className="text-lg font-bold text-slate-700">{routeDetails.origin}</p>
                                        </div>
                                        <div className="flex items-center text-slate-300">
                                            <ArrowRight size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Destino</p>
                                            <p className="text-lg font-bold text-slate-700">{routeDetails.destination}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer / QR */}
                            <div className="border-t-2 border-dashed border-slate-200 pt-8 flex items-center justify-between">
                                <div className="text-xs text-slate-400 space-y-1">
                                    <p className="uppercase font-bold text-slate-500">Información Importante</p>
                                    <p>1. Presentarse 30 minutos antes de la hora de zarpe.</p>
                                    <p>2. Mostrar este ticket junto con su documento de identidad.</p>
                                    <p>3. El pago se realiza antes de abordar.</p>
                                </div>
                                <div className="bg-white p-2 rounded-lg border border-slate-200">
                                    <QRCode value={`SW-${reservationCode}-${p.docNumber}`} size={96} viewBox={`0 0 256 256`} />
                                </div>
                            </div>

                            {/* Watermark Logo */}
                            <div className="absolute bottom-[-20px] left-[-20px] opacity-[0.03] pointer-events-none transform -rotate-12 scale-150 text-slate-900">
                                <Ship size={300} />
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/images/bg-fleet.jpg')] bg-cover bg-center opacity-[0.05] grayscale" />
            </div>

            <Navbar className="relative z-50 text-slate-900" variant="transparent" />

            <main className="relative z-10 pt-32 pb-20 container mx-auto px-4 max-w-6xl">

                {/* Header & Steps */}
                <div className="mb-12">
                    <button onClick={() => router.back()} className="flex items-center text-slate-500 hover:text-emerald-700 transition-colors mb-6 text-sm font-bold uppercase tracking-wide">
                        <ChevronLeft size={16} className="mr-1" /> Volver
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 font-cinzel">
                                Reserva tu Experiencia
                            </h1>
                            <p className="text-slate-500 flex items-center gap-2 font-medium">
                                <Ship size={18} className="text-emerald-600" />
                                {routeDetails.boatName} <span className="text-slate-300">|</span> {routeDetails.origin} ➔ {routeDetails.destination}
                            </p>
                        </div>

                        {/* Step Indicator - Clean Style */}
                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                                        step === s ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" :
                                            step > s ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                                    )}>
                                        {step > s ? <CheckCircle2 size={16} /> : s}
                                    </div>
                                    {s < 3 && <div className={cn("w-10 h-[2px] mx-2 transition-colors duration-300", step > s ? "bg-emerald-200" : "bg-slate-100")} />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">

                    {/* LEFT: WIZARD CONTENT */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="bg-white border border-slate-200 p-8 md:p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 relative overflow-hidden min-h-[500px]">

                                    {/* Top Accent Gradient */}
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600" />

                                    {/* STEP 1: PREFERENCES */}
                                    {step === 1 && (
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-3 bg-amber-100/50 rounded-xl text-amber-600">
                                                    <Armchair size={24} />
                                                </div>
                                                <h2 className="text-2xl font-bold text-slate-800">Elige tu Comodidad</h2>
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-4">
                                                {SEAT_TYPES.map((seat) => (
                                                    <div
                                                        key={seat.id}
                                                        onClick={() => setSelectedSeatType(seat.id)}
                                                        className={cn(
                                                            "cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group hover:shadow-lg",
                                                            selectedSeatType === seat.id
                                                                ? "bg-emerald-50 border-emerald-500 shadow-md shadow-emerald-500/10"
                                                                : "bg-white border-slate-100 hover:border-emerald-200"
                                                        )}
                                                    >
                                                        {selectedSeatType === seat.id && <div className="absolute top-3 right-3 text-emerald-600"><CheckCircle2 size={20} /></div>}
                                                        <seat.icon className={cn("mb-4", selectedSeatType === seat.id ? "text-emerald-600" : "text-slate-400")} size={28} />
                                                        <h3 className="font-bold text-slate-900 mb-1">{seat.name}</h3>
                                                        <p className="text-xs text-slate-500 mb-4 h-10 leading-relaxed">{seat.desc}</p>
                                                        <div className="flex justify-between items-end border-t border-dashed border-slate-200 pt-3">
                                                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Adicional</span>
                                                            <span className={cn("font-bold text-lg", selectedSeatType === seat.id ? "text-emerald-700" : "text-slate-700")}>
                                                                +{seat.priceMod > 0 ? `S/. ${seat.priceMod}` : 'S/. 0'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <Separator className="bg-slate-100" />

                                            <div className="space-y-4">
                                                <Label className="text-slate-500 uppercase text-xs font-bold tracking-wider">Número de Pasajeros</Label>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
                                                        <Button
                                                            onClick={() => handlePassengerCountChange(-1)}
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:bg-white hover:text-red-500 text-slate-500 rounded-lg shadow-sm"
                                                        >
                                                            <Minus size={18} />
                                                        </Button>
                                                        <span className="w-12 text-center text-2xl font-bold text-slate-800">{passengers.length}</span>
                                                        <Button
                                                            onClick={() => handlePassengerCountChange(1)}
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:bg-white hover:text-emerald-600 text-slate-500 rounded-lg shadow-sm"
                                                        >
                                                            <Plus size={18} />
                                                        </Button>
                                                    </div>
                                                    <p className="text-slate-400 text-sm">
                                                        Máximo 10 personas por reserva.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 2: PASSENGERS */}
                                    {step === 2 && (
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-3 bg-amber-100/50 rounded-xl text-amber-600">
                                                    <User size={24} />
                                                </div>
                                                <h2 className="text-2xl font-bold text-slate-800">Datos de los Viajeros</h2>
                                            </div>

                                            <div className="bg-slate-50/50 rounded-2xl p-2 border border-slate-100">
                                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-2">
                                                    {passengers.map((p, index) => (
                                                        <div key={p.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">Pasajero {index + 1}</Badge>
                                                                    {p.isPrimary && <Badge className="bg-amber-100 text-amber-700 border-none font-bold">Titular</Badge>}
                                                                </div>
                                                            </div>

                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nombre Completo</Label>
                                                                    <Input
                                                                        value={p.firstName}
                                                                        onChange={(e) => updatePassenger(p.id, 'firstName', e.target.value)}
                                                                        className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20"
                                                                        placeholder="Ej: Juan Perez"
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div className="space-y-1">
                                                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Documento</Label>
                                                                        <Select
                                                                            value={p.docType}
                                                                            onValueChange={(v: any) => updatePassenger(p.id, 'docType', v)}
                                                                        >
                                                                            <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white">
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="DNI">DNI</SelectItem>
                                                                                <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Número</Label>
                                                                        <Input
                                                                            value={p.docNumber}
                                                                            onChange={(e) => updatePassenger(p.id, 'docNumber', e.target.value)}
                                                                            className="bg-slate-50 border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20"
                                                                            placeholder="87654321"
                                                                            maxLength={12}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 3: CONFIRMATION */}
                                    {step === 3 && (
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-3 bg-amber-100/50 rounded-xl text-amber-600">
                                                    <CreditCard size={24} />
                                                </div>
                                                <h2 className="text-2xl font-bold text-slate-800">Contacto y Confirmación</h2>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Tus Datos</h3>
                                                    <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                        <div className="space-y-1">
                                                            <Input
                                                                placeholder="Email para enviar tickets"
                                                                type="email"
                                                                value={contactEmail}
                                                                onChange={(e) => setContactEmail(e.target.value)}
                                                                className={cn(
                                                                    "bg-white border-slate-200 text-slate-900 h-12",
                                                                    contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) && "border-red-300 focus-visible:ring-red-300"
                                                                )}
                                                            />
                                                            {contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) && (
                                                                <p className="text-[10px] text-red-500 font-bold ml-1">Ingresa un email válido</p>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Select value={countryCode} onValueChange={setCountryCode}>
                                                                <SelectTrigger className="w-[110px] bg-white border-slate-200 text-slate-900 h-12 px-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <img
                                                                            src={COUNTRY_CODES.find(c => c.code === countryCode)?.flag}
                                                                            alt="flag"
                                                                            className="w-5 h-auto rounded-sm object-cover shadow-sm"
                                                                        />
                                                                        <span className="text-xs font-bold">{countryCode}</span>
                                                                    </div>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {COUNTRY_CODES.map(c => (
                                                                        <SelectItem key={c.code} value={c.code}>
                                                                            <span className="flex items-center gap-2">
                                                                                <img src={c.flag} alt={c.country} className="w-5 h-auto rounded-sm object-cover shadow-sm" />
                                                                                <span className="text-slate-700 font-mono text-xs font-bold">{c.code}</span>
                                                                            </span>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <Input
                                                                placeholder="WhatsApp (Solo números)"
                                                                value={contactPhone}
                                                                onChange={(e) => {
                                                                    const val = e.target.value.replace(/\D/g, ''); // ONLY NUMBERS
                                                                    setContactPhone(val);
                                                                }}
                                                                className="flex-1 bg-white border-slate-200 text-slate-900 h-12"
                                                                maxLength={15}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                                                    <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-widest mb-4">Resumen de Pago</h3>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex justify-between text-slate-600">
                                                            <span>Tarifa Base x {passengers.length}</span>
                                                            <span>S/. {(routeDetails.basePrice * passengers.length).toFixed(2)}</span>
                                                        </div>
                                                        {selectedSeatType !== 'standard' && (
                                                            <div className="flex justify-between text-slate-600">
                                                                <span>Suplemento {SEAT_TYPES.find(s => s.id === selectedSeatType)?.name}</span>
                                                                <span>S/. {(SEAT_TYPES.find(s => s.id === selectedSeatType)!.priceMod * passengers.length).toFixed(2)}</span>
                                                            </div>
                                                        )}
                                                        <Separator className="bg-emerald-200 my-2" />
                                                        <div className="flex justify-between items-end">
                                                            <span className="text-slate-800 font-bold">Total Final</span>
                                                            <span className="text-3xl font-bold text-emerald-700">S/. {totalPrice.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 text-amber-700 text-sm items-start">
                                                <AlertCircle size={18} className="shrink-0 text-amber-500 mt-0.5" />
                                                <p>Nota: El pago se realiza presencialmente en el puerto. Esta reserva garantiza tu cupo por 24 horas. Recibirás tus tickets en PDF al instante.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* NAVIGATION ACTIONS */}
                                    <div className="mt-10 flex justify-between pt-6 border-t border-slate-100">

                                        <Button
                                            onClick={prevStep}
                                            disabled={step === 1}
                                            variant="ghost"
                                            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                        >
                                            Atrás
                                        </Button>

                                        {step < 3 ? (
                                            <Button
                                                onClick={nextStep}
                                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-8 h-12 shadow-lg shadow-slate-900/10"
                                            >
                                                Continuar <ArrowRight size={18} className="ml-2" />
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleReservation}
                                                disabled={loading}
                                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl px-10 h-12 shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105"
                                            >
                                                {loading ? "Procesando..." : "Confirmar Reserva"}
                                            </Button>
                                        )}
                                    </div>

                                </Card>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* RIGHT: LIVE SUMMARY (Sticky) */}
                    <div className="lg:col-span-4 hidden lg:block">
                        <div className="sticky top-32">
                            <Card className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50">
                                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Tu Itinerario</h3>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                            <Ship size={24} />
                                        </div>
                                        <div>
                                            <p className="text-slate-900 font-bold text-lg">{routeDetails.boatName}</p>
                                            <p className="text-slate-500 text-sm">{routeDetails.company}</p>
                                        </div>
                                    </div>

                                    <div className="relative pl-6 border-l-2 border-dashed border-slate-200 space-y-8 ml-2 py-2">
                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-4 border-emerald-500 shadow-sm" />
                                            <p className="text-xs text-slate-400 font-bold mb-1">SALIDA</p>
                                            <p className="text-slate-900 font-bold text-xl">{routeDetails.time}</p>
                                            <p className="text-slate-500 text-sm">{routeDetails.origin}</p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-4 border-amber-500 shadow-sm" />
                                            <p className="text-xs text-slate-400 font-bold mb-1">LLEGADA</p>
                                            <p className="text-slate-900 font-bold text-xl">~10:30 AM</p>
                                            <p className="text-slate-500 text-sm">{routeDetails.destination}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center border border-slate-100">
                                        <span className="text-slate-500 text-sm font-medium">Total Estimado</span>
                                        <span className="text-emerald-700 font-bold text-xl">S/. {totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
