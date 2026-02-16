'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    MapPin,
    CreditCard,
    CheckCircle2,
    Ship,
    User,
    Mail,
    Phone,
    Minus,
    Plus,
    Printer,
    Download,
    Ticket,
    Globe,
    AlertCircle,
    UserCircle2,
    Luggage,
    FileText,
    Home
} from 'lucide-react';
import QRCode from "react-qr-code";
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { boatsService } from '@/services/boats.service';
import { bookingsService } from '@/services/bookings.service';

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

export default function BookingPage() {
    const params = useParams();
    const router = useRouter();
    const scheduleId = params.id;

    const { user, isAuthenticated, openLoginModal } = useAuth();
    const [schedule, setSchedule] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch Schedule Data
    useEffect(() => {
        if (!scheduleId) return;
        const fetchSchedule = async () => {
            try {
                const data = await boatsService.getScheduleById(scheduleId as string);
                if (data) {
                    setSchedule(data);
                } else {
                    setError("Horario no encontrado");
                }
            } catch (err) {
                console.error(err);
                setError("Error al cargar la información del viaje");
            }
        };
        fetchSchedule();
    }, [scheduleId]);

    const routeDetails = schedule ? {
        id: schedule.id,
        origin: schedule.route?.origin || 'Origen',
        destination: schedule.route?.destination || 'Destino',
        time: schedule.departureTime ? new Date(schedule.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
        date: schedule.departureTime ? new Date(schedule.departureTime).toLocaleDateString() : '',
        rawDate: schedule.departureTime,
        price: schedule.prices?.[0]?.amount ? Number(schedule.prices[0].amount) : 0,
        company: schedule.boat?.name || 'Transporte',
        duration: schedule.route?.duration ? `${Math.floor(schedule.route.duration / 60)}h ${schedule.route.duration % 60}m` : '--',
        availableSeats: (schedule.boat?.capacity || 0) - (schedule.bookings?.filter((b: any) => b.status === 'CONFIRMED').length || 0),
        capacity: schedule.boat?.capacity || 0
    } : null;

    // ... [KEEPING REST OF COMPONENT UNCHANGED TO LINE 344]


    const [loading, setLoading] = useState(false);

    // --- STATE: PASSENGERS & CONTACT ---
    const [passengers, setPassengers] = useState<Passenger[]>([
        { id: 1, firstName: '', lastName: '', docType: 'DNI', docNumber: '', isPrimary: true }
    ]);
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+51');
    const [reservationCode, setReservationCode] = useState<string | null>(null);

    // --- HANDLERS: PASSENGER MANAGEMENT ---
    const updatePassenger = (id: number, field: keyof Passenger, value: string) => {
        setPassengers(prev => prev.map(p => {
            if (p.id !== id) return p;

            // VALIDATION LOGIC
            if (field === 'firstName' || field === 'lastName') {
                // ONLY LETTERS & SPACES allowed
                if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(value)) return p;
            }
            if (field === 'docNumber') {
                // DNI: Only Numbers, Max 8
                if (p.docType === 'DNI') {
                    if (!/^\d*$/.test(value)) return p;
                    if (value.length > 8) return p;
                }
                // PASSPORT: Alphanumeric, Max 12 (approx)
                if (p.docType === 'PASAPORTE') {
                    if (value.length > 12) return p;
                }
            }
            return { ...p, [field]: value };
        }));
    };

    const handlePassengerCountChange = (delta: number) => {
        setPassengers(prev => {
            const count = prev.length + delta;
            if (count < 1 || count > 10) return prev; // Limit 1-10

            if (delta > 0) {
                // ADD Passenger
                return [...prev, {
                    id: Date.now(), // simple unique id 
                    firstName: '',
                    lastName: '',
                    docType: 'DNI',
                    docNumber: '',
                    isPrimary: false
                }];
            } else {
                // REMOVE Last Passenger (if not primary)
                if (prev.length <= 1) return prev;
                return prev.slice(0, -1);
            }
        });
    };

    // --- HANDLERS: CONTACT ---
    const handlePhoneChange = (val: string) => {
        // ONLY NUMBERS allowed
        if (/^\d*$/.test(val)) {
            setContactPhone(val);
        }
    };

    const handleReservation = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated || !user) {
            openLoginModal();
            return;
        }

        if (!schedule) return;

        setLoading(true);

        try {
            // Create a booking for current user
            // In a real multi-passenger scenario, we might create multiple bookings or one booking with metadata.
            // For MVP, we'll create ONE booking record for the logged-in user, 
            // but effectively we are charging for N passengers.
            // Ideally backend supports 'pax' count or we create N bookings.
            // Given BookingsService logic: const occupiedSeats = schedule.bookings... check capacity.
            // We should loop and create N bookings to properly reserve N seats.

            const totalPrice = Number(routeDetails?.price || 0);

            // Sequential creation
            let lastBookingId = '';
            for (const p of passengers) {
                const res = await bookingsService.create({
                    userId: user.id,
                    scheduleId: schedule.id,
                    totalPrice: totalPrice,
                    status: 'CONFIRMED',
                    seatNumber: undefined, // Backend assigns it
                    passengerName: `${p.firstName} ${p.lastName}`.trim(),
                    passengerDocType: p.docType,
                    passengerDocNumber: p.docNumber
                });
                lastBookingId = res.id;
            }

            // Generate Mock Reservation Code for Display (or use the last booking ID)
            setReservationCode(lastBookingId);

        } catch (error: any) {
            console.error("Booking Error:", error);
            alert(`Error al procesar la reserva: ${error.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // --- RENDER: LOADING / ERROR ---
    if (!reservationCode && (!routeDetails || error)) {
        return (
            <div className="min-h-screen relative overflow-hidden font-sans selection:bg-emerald-500/30">
                <Navbar className="relative z-50 text-white" variant="transparent" />
                <main className="flex-grow container mx-auto px-4 pt-32 pb-20 relative z-10 flex items-center justify-center min-h-[50vh]">
                    {error ? (
                        <div className="text-white text-center">
                            <h2 className="text-2xl font-bold mb-2">Error</h2>
                            <p>{error}</p>
                            <Button variant="link" onClick={() => router.back()} className="text-white underline mt-4">Regresar</Button>
                        </div>
                    ) : (
                        <div className="text-white text-center animate-pulse">
                            <h2 className="text-2xl font-bold">Cargando detalles del viaje...</h2>
                        </div>
                    )}
                </main>
            </div>
        )
    }

    // --- RENDER: TICKET ---
    if (reservationCode && routeDetails) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/30 flex flex-col print:bg-white print:h-auto print:overflow-visible">
                <div className="fixed inset-0 bg-[url('/images/bg-fleet.jpg')] bg-cover bg-center pointer-events-none z-0 print:hidden opacity-20" />
                <Navbar className="relative z-50 print:hidden text-slate-900" />

                <main className="flex-grow container mx-auto px-4 pt-32 pb-20 relative z-10 flex flex-col items-center justify-center min-h-[80vh] print:p-0 print:m-0 print:pt-0 print:block">

                    {/* SUCCESS MESSAGE (Screen Only) */}
                    <div className="text-center mb-8 print:hidden animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 size={48} className="text-emerald-600" />
                        </div>
                        <h1 className="text-4xl font-cinzel font-bold text-slate-900 mb-2">¡Reserva Exitosa!</h1>
                        <p className="text-slate-600 text-lg max-w-md mx-auto">
                            Tu espacio ha sido reservado. Presenta los siguientes tickets en el puerto para realizar el pago.
                        </p>
                    </div>

                    {/* TICKET / BOARDING PASS (Printable Loop) */}
                    <div className="space-y-8 print:space-y-0">
                        {passengers.map((p, index) => (
                            <div
                                key={p.id}
                                id={`ticket-${index}`}
                                className={cn(
                                    "bg-white text-slate-900 w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:rounded-none relative group border border-slate-200 print:border-none mb-8 print:mb-0",
                                    // Only add page break if it's NOT the last ticket
                                    index < passengers.length - 1 ? "print:break-after-page" : ""
                                )}
                            >

                                {/* DECORATIVE HEADER (Amazon Style) */}
                                <div className="h-32 bg-[#022c22] relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[url('/images/bg-fleet.jpg')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                                    <div className="relative z-10 text-center text-white">
                                        <div className="text-xs tracking-[0.3em] font-medium text-emerald-400 mb-1">RESERVA CONFIRMADA</div>
                                        <h2 className="text-4xl font-cinzel font-bold tracking-tight">SELVA WASI</h2>
                                        <p className="text-emerald-200/80 text-xs mt-1 font-sans tracking-widest">EXPERIENCIA AMAZÓNICA</p>
                                    </div>
                                    {/* Circles for cutout effect */}
                                    <div className="absolute -bottom-4 left-0 w-8 h-8 bg-slate-50 rounded-full -translate-x-1/2 border border-slate-200 print:bg-white"></div>
                                    <div className="absolute -bottom-4 right-0 w-8 h-8 bg-slate-50 rounded-full translate-x-1/2 border border-slate-200 print:bg-white"></div>
                                </div>

                                <div className="flex flex-col md:flex-row min-h-[400px] print:flex-row">
                                    {/* LEFT: INFO */}
                                    <div className="flex-1 p-8 md:p-12 relative flex flex-col justify-between print:p-8">
                                        {/* Route Header */}
                                        <div className="flex justify-between items-start border-b border-dashed border-slate-200 pb-8 mb-8">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Transporte</p>
                                                <div className="flex items-center gap-3">
                                                    <Ship className="text-emerald-600" size={28} />
                                                    <h2 className="text-2xl font-cinzel font-bold text-slate-800">{routeDetails.company}</h2>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Código de Reserva</p>
                                                <p className="text-3xl font-mono font-bold text-emerald-700 tracking-wider text-nowrap">{reservationCode}</p>
                                            </div>
                                        </div>

                                        {/* Body Info */}
                                        <div className="grid grid-cols-2 gap-y-10 mb-8">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Origen</p>
                                                <div className="text-4xl font-bold text-slate-800 font-cinzel">{routeDetails.origin}</div>
                                                <div className="text-sm font-medium text-emerald-600 mt-1">{routeDetails.time}</div>
                                            </div>
                                            <div className="text-right sm:text-left">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Destino</p>
                                                <div className="text-4xl font-bold text-slate-800 font-cinzel">{routeDetails.destination}</div>
                                                <div className="text-sm font-medium text-emerald-600 mt-1">Llegada Aprox. 10:30 AM</div>
                                            </div>

                                            <div className="col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-100 print:border-slate-200">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <UserCircle2 size={14} /> Pasajero ({index + 1}/{passengers.length})
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-lg capitalize">{p.firstName} {p.lastName}</p>
                                                        <p className="text-sm text-slate-500 font-mono tracking-wide">{p.docType}: {p.docNumber}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha</p>
                                                <p className="text-lg font-medium text-slate-700 capitalize">
                                                    {routeDetails.rawDate ? new Date(routeDetails.rawDate).toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : routeDetails.date}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Monto a Pagar</p>
                                                {/* Price per passenger shown individually for clarity on individual ticket */}
                                                <p className="text-2xl font-bold text-emerald-700">S/. {(routeDetails.price).toFixed(2)}</p>
                                            </div>
                                        </div>

                                        {/* Footer Note */}
                                        <div className="mt-auto pt-6 border-t border-slate-100 text-xs text-slate-400 text-center print:text-left">
                                            * Presentar este ticket digital o impreso 30 minutos antes del zarpe.
                                        </div>
                                    </div>

                                    {/* RIGHT: QR / ACTIONS (Dark Side) */}
                                    <div className="w-full md:w-80 bg-[#022c22] text-white p-10 flex flex-col items-center justify-center relative print:bg-white print:text-black print:border-l print:border-slate-200">
                                        {/* Holes visually connecting both sides */}
                                        <div className="hidden md:block absolute top-0 left-0 w-8 h-8 bg-slate-50 rounded-full -translate-x-1/2 -translate-y-1/2 border border-slate-200 print:hidden"></div>
                                        <div className="hidden md:block absolute bottom-0 left-0 w-8 h-8 bg-slate-50 rounded-full -translate-x-1/2 translate-y-1/2 border border-slate-200 print:hidden"></div>

                                        <div className="text-center w-full bg-white p-4 rounded-2xl shadow-xl print:shadow-none print:border print:border-slate-300">
                                            <div className="aspect-square w-full relative flex items-center justify-center">
                                                {/* QR Code with Validation URL */}
                                                <div style={{ height: "auto", margin: "0 auto", maxWidth: "100%", width: "100%" }}>
                                                    <QRCode
                                                        size={256}
                                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                                        value={`https://selvawasi.com/validate/${reservationCode}?doc=${p.docNumber}`}
                                                        viewBox={`0 0 256 256`}
                                                        fgColor="#022c22"
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest pt-2 border-t border-slate-100">Escanear para validar</p>
                                        </div>

                                        <div className="print:hidden w-full space-y-3 mt-10">
                                            {/* Only show buttons on the first ticket to avoid clutter */}
                                            {index === 0 && (
                                                <>
                                                    <Button onClick={handlePrint} className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#022c22] font-bold h-12 rounded-xl transition-all shadow-lg shadow-emerald-900/20">
                                                        <Printer className="mr-2 h-4 w-4" /> Imprimir Todo
                                                    </Button>
                                                    <Button
                                                        onClick={() => router.push('/boats')}
                                                        variant="ghost"
                                                        className="w-full text-white/50 hover:text-white hover:bg-white/5 font-bold h-10 rounded-xl"
                                                    >
                                                        Inicio
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden print:block mt-8 px-8">
                                    <div className="grid grid-cols-3 gap-6 text-xs text-slate-500 mb-8">
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                                <Luggage size={14} className="text-emerald-600" /> Equipaje
                                            </h4>
                                            <p>Permitido hasta 20kg por pasajero. Equipaje de mano debe caber debajo del asiento.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                                <Clock size={14} className="text-emerald-600" /> Check-in
                                            </h4>
                                            <p>Presentarse 30 minutos antes de la hora de zarpe indicada. El embarque cierra 10 min antes.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                                <FileText size={14} className="text-emerald-600" /> Documentos
                                            </h4>
                                            <p>Es obligatorio presentar DNI o Pasaporte físico original junto con este ticket para abordar.</p>
                                        </div>
                                    </div>

                                    {/* Decorative Footer */}
                                    <div className="border-t border-slate-200 pt-4 flex flex-col items-center justify-center text-center opacity-60">
                                        <h3 className="font-cinzel font-bold text-xl text-slate-300">SELVA WASI</h3>
                                        <p className="text-[10px] tracking-[0.3em] uppercase text-emerald-800/40">Travel & Adventure</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </main>

                <div className="fixed bottom-8 right-8 z-50 print:hidden animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                    <Button
                        onClick={() => router.push('/boats')}
                        className="bg-slate-900 text-white shadow-2xl hover:scale-105 hover:bg-slate-800 rounded-full px-8 py-6 h-auto text-lg font-bold flex items-center gap-3 transition-all"
                    >
                        <Home size={24} /> Volver al Inicio
                    </Button>
                </div>
            </div>
        );
    }

    if (!routeDetails) return null;

    return (
        <div className="min-h-screen relative overflow-hidden font-sans selection:bg-emerald-500/30">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 fixed">
                <img src="/images/bg-fleet.jpg" alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 via-slate-900/20 to-emerald-900/30 brightness-75" />
            </div>

            <Navbar className="relative z-50 text-white" variant="transparent" />

            <main className="flex-grow container mx-auto px-4 pt-32 pb-20 relative z-10">
                <button onClick={() => router.back()} className="flex items-center text-white/90 mb-8 hover:text-white font-medium transition-all hover:-translate-x-1 group">
                    <ChevronLeft className="mr-2 group-hover:animate-pulse" /> Volver a resultados
                </button>

                <div className="grid lg:grid-cols-12 gap-8">

                    {/* LEFT: FORM */}
                    <div className="lg:col-span-8 animate-in slide-in-from-left-4 duration-500">
                        <Card className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-600" />

                            <div className="flex justify-between items-center mb-8">
                                <h1 className="text-3xl font-cinzel font-bold text-slate-900">Confirmar Reserva</h1>
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1 font-bold">Sin Pago Online</Badge>
                            </div>

                            <form onSubmit={handleReservation} className="space-y-8">

                                {/* 1. CONTACT INFO (Once) */}
                                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-6">
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 py-2 border-b border-slate-100">
                                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Phone size={18} /></div>
                                        Datos de Contacto
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-slate-600 font-semibold text-sm">Validar con Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="juan@email.com"
                                                    required
                                                    value={contactEmail}
                                                    onChange={(e) => setContactEmail(e.target.value)}
                                                    className="pl-10 bg-white border-slate-200 h-11 rounded-xl focus:ring-emerald-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-slate-600 font-semibold text-sm">Teléfono / WhatsApp</Label>
                                            <div className="flex gap-2">
                                                <Select value={countryCode} onValueChange={setCountryCode}>
                                                    <SelectTrigger className="w-[110px] h-11 bg-white border-slate-200 rounded-xl px-2">
                                                        <div className="flex items-center gap-2">
                                                            {(() => {
                                                                const selected = COUNTRY_CODES.find(c => c.code === countryCode);
                                                                return selected ? (
                                                                    <>
                                                                        <img src={selected.flag} alt="flag" className="w-5 h-auto rounded-sm object-cover shadow-sm" />
                                                                        <span className="text-xs font-medium">{selected.code}</span>
                                                                    </>
                                                                ) : <span className="text-muted-foreground">Code</span>
                                                            })()}
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {COUNTRY_CODES.map((c) => (
                                                            <SelectItem key={c.code} value={c.code}>
                                                                <span className="flex items-center gap-2">
                                                                    <img src={c.flag} alt={c.country} className="w-5 h-auto rounded-sm object-cover shadow-sm" />
                                                                    <span className="text-slate-700 font-mono text-xs font-medium">{c.code}</span>
                                                                </span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <div className="relative flex-1">
                                                    <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                    <Input
                                                        id="phone"
                                                        placeholder="999 999 999"
                                                        required
                                                        value={contactPhone}
                                                        onChange={(e) => handlePhoneChange(e.target.value)}
                                                        className="pl-10 bg-white border-slate-200 h-11 rounded-xl focus:ring-emerald-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. PASSENGER LIST (Dynamic) */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><User size={18} /></div>
                                            Datos de Pasajeros
                                        </h3>

                                        {/* Passenger Counter UI */}
                                        <div className="flex items-center gap-3 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                                            <Button
                                                type="button"
                                                onClick={() => handlePassengerCountChange(-1)}
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full hover:bg-white hover:text-red-500"
                                            >
                                                <Minus size={14} />
                                            </Button>
                                            <span className="font-bold text-slate-800 w-4 text-center">{passengers.length}</span>
                                            <Button
                                                type="button"
                                                onClick={() => handlePassengerCountChange(1)}
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full hover:bg-white hover:text-emerald-600"
                                            >
                                                <Plus size={14} />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {passengers.map((p, index) => (
                                            <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-emerald-300 transition-colors">
                                                <div className="absolute -left-3 top-6 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-r-md shadow-sm">
                                                    #{index + 1}
                                                </div>

                                                <div className="grid md:grid-cols-12 gap-4">
                                                    <div className="md:col-span-5 space-y-1">
                                                        <Label className="text-xs text-slate-500 font-semibold uppercase">Nombres y Apellidos</Label>
                                                        <Input
                                                            placeholder="Como figura en DNI"
                                                            required
                                                            className="h-10 border-slate-200 bg-slate-50/50 focus:bg-white transition-all uppercase placeholder:normal-case font-medium text-slate-700 placeholder:text-slate-400"
                                                            value={p.firstName} // For simplicity using full name in one field or split? 
                                                            // Logic above used firstName/lastName but UI usually asks "Nombre Completo". 
                                                            // Let's use firstName as "FullName" and update validation.
                                                            onChange={(e) => updatePassenger(p.id, 'firstName', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-3 space-y-1">
                                                        <Label className="text-xs text-slate-500 font-semibold uppercase">Tipo Doc.</Label>
                                                        <Select
                                                            value={p.docType}
                                                            onValueChange={(val: 'DNI' | 'PASAPORTE') => updatePassenger(p.id, 'docType', val)}
                                                        >
                                                            <SelectTrigger className="h-10 border-slate-200 bg-slate-50/50">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="DNI">DNI</SelectItem>
                                                                <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="md:col-span-4 space-y-1">
                                                        <Label className="text-xs text-slate-500 font-semibold uppercase">N° Documento</Label>
                                                        <Input
                                                            placeholder={p.docType === 'DNI' ? '8 dígitos' : 'Alfanumérico'}
                                                            required
                                                            className="h-10 border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-mono tracking-wide"
                                                            value={p.docNumber}
                                                            onChange={(e) => updatePassenger(p.id, 'docNumber', e.target.value)}
                                                            maxLength={p.docType === 'DNI' ? 8 : 12}
                                                            minLength={p.docType === 'DNI' ? 8 : 5}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Area */}
                                <div className="pt-4">
                                    <div className="flex items-center gap-2 mb-4 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 text-sm">
                                        <AlertCircle size={16} />
                                        <span>Verifica que los números de documento sean correctos para evitar problemas al abordar.</span>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading || (routeDetails?.availableSeats || 0) < passengers.length}
                                        className="w-full h-16 text-xl font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden group disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        {loading ? 'Generando Reserva...' : (
                                            (routeDetails?.availableSeats || 0) < passengers.length
                                                ? 'Sin Asientos Suficientes'
                                                : `Confirmar Reserva (S/. ${(routeDetails!.price * passengers.length).toFixed(2)})`
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>

                    {/* RIGHT: SUMMARY CARD */}
                    <div className="lg:col-span-4 animate-in slide-in-from-right-4 duration-500">
                        <div className="sticky top-32">
                            <Card className="bg-white/80 backdrop-blur-md border border-white/50 rounded-[2.5rem] p-8 shadow-xl">
                                <h2 className="text-xl font-cinzel font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Clock size={20} className="text-slate-400" />
                                    Resumen del Viaje
                                </h2>

                                {/* Content similar to before but updated styling */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 pb-6 border-b border-slate-200/50">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600 border border-slate-100">
                                            <Ship size={28} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-lg">{routeDetails.company}</p>
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal">Servicio Rápido</Badge>
                                        </div>
                                    </div>

                                    <div className="relative pl-8 space-y-10 border-l-2 border-dashed border-slate-300 ml-3 py-2">
                                        <div className="relative group">
                                            <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4 border-emerald-500 shadow-sm z-10" />
                                            <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-widest">Salida</p>
                                            <p className="text-2xl font-bold text-slate-800">{routeDetails.time}</p>
                                            <p className="text-sm font-medium text-slate-600">{routeDetails.origin}</p>
                                            <p className="text-xs text-slate-400 mt-1 capitalize">{routeDetails.date}</p>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4 border-amber-500 shadow-sm z-10" />
                                            <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-widest">Llegada (Aprox)</p>
                                            <p className="text-2xl font-bold text-slate-800">10:30 AM</p>
                                            <p className="text-sm font-medium text-slate-600">{routeDetails.destination}</p>
                                        </div>
                                    </div>

                                    {/* Seat Availability Display */}
                                    <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-emerald-800 font-medium">
                                            <Ticket size={18} />
                                            <span>Asientos Disponibles</span>
                                        </div>
                                        <div className="text-emerald-700 font-bold text-lg">
                                            {routeDetails.availableSeats} / {routeDetails.capacity}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 shadow-inner">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-slate-600 font-medium text-sm">Precio Individual</span>
                                            <span className="font-bold text-slate-900">S/. {routeDetails.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-slate-600 font-medium text-sm">Pasajeros</span>
                                            <span className="font-bold text-slate-900">x {passengers.length}</span>
                                        </div>
                                        <div className="mt-4 border-t border-dashed border-slate-300 pt-4 flex justify-between items-end">
                                            <span className="text-emerald-800 font-bold text-lg">Total a Pagar</span>
                                            <span className="text-emerald-700 font-black text-3xl">S/. {(routeDetails.price * passengers.length).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                </div>

            </main>
            <Footer className="relative z-10" />
        </div>
    );
}
