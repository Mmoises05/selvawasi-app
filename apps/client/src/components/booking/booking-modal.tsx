"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { bookingsService } from "@/services/bookings.service";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Assuming we have toast or we'll create simple feedback

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    scheduleId: string; // Or entity ID logic
    price: number;
    title: string; // e.g. "Viaje Iquitos - Nauta"
    subtitle?: string;
    type?: 'TRANSPORT' | 'EXPERIENCE';
    date?: Date | undefined;
}

export function BookingModal({ isOpen, onClose, scheduleId, price, title, subtitle, image, type = 'TRANSPORT', date }: BookingModalProps & { image?: string }) {
    const { user, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBooking = async () => {
        if (!isAuthenticated || !user) {
            setError("Debes iniciar sesión para reservar.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const bookingData: any = {
                userId: user.id,
                totalPrice: price,
                status: 'PENDING'
            };

            if (type === 'EXPERIENCE') {
                bookingData.experienceId = scheduleId;
                // Hack: Store date in seatNumber for now as we lack a date field in Booking model
                if (date) {
                    bookingData.seatNumber = date.toISOString();
                }
            } else {
                bookingData.scheduleId = scheduleId;
            }

            await bookingsService.create(bookingData);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError("No se pudo procesar la reserva. Intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-white border-none shadow-2xl rounded-[2rem] flex flex-col md:flex-row h-auto md:h-[500px]">

                {/* LEFT: IMAGE (Hidden on mobile) */}
                <div className="hidden md:block w-2/5 relative h-full">
                    <div className="absolute inset-0 bg-slate-900 mix-blend-multiply z-10 opacity-30" />
                    <img
                        src={image || "/images/bg-fleet.jpg"}
                        alt="Booking Context"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-8 left-8 z-20">
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2">
                            Selva Wasi
                        </div>
                    </div>
                    <div className="absolute bottom-8 left-8 z-20 max-w-[80%]">
                        <p className="text-white/80 text-sm font-light italic">
                            "Tu aventura en el Amazonas comienza aquí."
                        </p>
                    </div>
                </div>

                {/* RIGHT: CONTENT */}
                <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                    <Button
                        variant="ghost"
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        onClick={onClose}
                    >
                        ✕
                    </Button>

                    <DialogHeader className="mb-6 text-left">
                        <DialogTitle className="text-3xl font-cinzel font-bold text-slate-900 mb-2">Confirmar Reserva</DialogTitle>
                        <DialogDescription className="text-slate-500 text-base">
                            {subtitle || "Estás a un paso de confirmar tu viaje."}
                        </DialogDescription>
                    </DialogHeader>

                    {success ? (
                        <div className="flex flex-col items-center justify-center py-4 space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-200">
                                <CheckCircle size={40} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Solicitud Recibida!</h3>
                                <p className="text-slate-600 max-w-xs mx-auto">
                                    Hemos reservado tu espacio. Revisa tu correo electrónico para los detalles del pago.
                                </p>
                            </div>
                            <Button onClick={onClose} className="bg-slate-900 hover:bg-emerald-600 text-white w-full h-12 rounded-xl text-lg font-bold transition-all shadow-lg mt-4">
                                Volver al sitio
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Reservation Summary Card */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-emerald-200 transition-colors">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Itinerario</p>
                                    <h4 className="font-bold text-xl text-slate-900 leading-tight">{title}</h4>
                                    {date && (
                                        <p className="text-sm text-emerald-600 font-medium mt-1">
                                            Fecha: {date.toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Total</p>
                                    <span className="font-bold text-emerald-600 text-2xl">S/. {Number(price).toFixed(2)}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
                                    <AlertCircle size={18} /> {error}
                                </div>
                            )}

                            <div className="pt-2">
                                <Button
                                    onClick={handleBooking}
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-emerald-600 hover:to-emerald-500 text-white h-14 rounded-2xl text-lg font-bold shadow-xl shadow-emerald-900/10 hover:shadow-emerald-900/30 transition-all transform active:scale-95"
                                >
                                    {isLoading ? <Spinner className="w-5 h-5 mr-2 text-white" /> : "Confirmar Reserva"}
                                </Button>
                                <p className="text-center text-xs text-slate-400 mt-4">
                                    Al confirmar, aceptas nuestros términos y condiciones de servicio.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
