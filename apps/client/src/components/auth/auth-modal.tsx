"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/auth-context";

interface AuthModalProps {
    children?: React.ReactNode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess?: () => void;
}

export function AuthModal({ children, isOpen: externalOpen, onOpenChange: externalOnOpenChange, onSuccess }: AuthModalProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    // Controlled vs Uncontrolled logic
    const isControlled = externalOpen !== undefined;
    const isOpen = isControlled ? externalOpen : internalIsOpen;
    const setIsOpen = isControlled ? externalOnOpenChange! : setInternalIsOpen;

    const [activeTab, setActiveTab] = useState("login");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { login, register } = useAuth();

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");

    const validatePassword = (pwd: string) => {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/;
        return regex.test(pwd);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await login({ email, password });
            setIsOpen(false);
            if (onSuccess) onSuccess();
        } catch (err: any) {
            console.error("Login failed", err);
            // Show the actual error to debug
            const msg = err.response?.data?.message || err.message || "Error desconocido";
            setError(`Error: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePassword(password)) {
            setError("La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await register({ email, password, name, lastname });
            setSuccessMsg("¡Cuenta creada exitosamente! Por favor inicia sesión.");
            setActiveTab("login");
            setPassword("");
            // Note: If auto-login desired, call onSuccess here too after login
        } catch (err) {
            console.error("Register failed", err)
            setError("Error al crear cuenta. Intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); setError(null); }}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            {/* Content: Heavy Glassmorphism + Jungle Tones */}
            <DialogContent className="sm:max-w-[425px] bg-jungle-950/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <DialogHeader>
                    <DialogTitle className="text-3xl font-serif text-center font-[family-name:var(--font-cormorant)] italic tracking-wide">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-amber-200">
                            SelvaWasi
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-center text-stone-300 font-light">
                        Explora la biodiversidad amazónica
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2 relative z-10">
                    <TabsList className="grid w-full grid-cols-2 bg-black/20 p-1 rounded-lg">
                        <TabsTrigger
                            value="login"
                            className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-300 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none transition-all"
                        >
                            Iniciar Sesión
                        </TabsTrigger>
                        <TabsTrigger
                            value="register"
                            className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300 data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none transition-all"
                        >
                            Registrarse
                        </TabsTrigger>
                    </TabsList>

                    {error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-200 text-sm animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}
                    {successMsg && activeTab === 'login' && (
                        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-emerald-200 text-sm animate-in fade-in slide-in-from-top-2">
                            <Check size={16} />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {/* LOGIN FORM */}
                    <TabsContent value="login" className="space-y-5 mt-4 focus-visible:outline-none">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-emerald-100/90 text-xs uppercase tracking-wider font-semibold">Correo Electrónico</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu@email.com"
                                        className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:bg-white/10 transition-all rounded-xl"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-emerald-100/90 text-xs uppercase tracking-wider font-semibold">Contraseña</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-9 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:bg-white/10 transition-all rounded-xl"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-stone-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white border-0 shadow-lg shadow-emerald-900/20 rounded-xl h-11 font-medium tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? <Spinner className="w-5 h-5 text-white" /> : "Ingresar"}
                            </Button>
                        </form>

                        <div className="text-center text-xs text-stone-500">
                            <Link href="#" className="hover:text-amber-400 transition-colors underline decoration-stone-700 underline-offset-4 hover:decoration-amber-400">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </TabsContent>

                    {/* REGISTER FORM */}
                    <TabsContent value="register" className="space-y-5 mt-4 focus-visible:outline-none">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-emerald-100/90 text-xs uppercase tracking-wider font-semibold">Nombre</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Juan"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-amber-500/50 focus:bg-white/10 rounded-xl"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastname" className="text-emerald-100/90 text-xs uppercase tracking-wider font-semibold">Apellido</Label>
                                    <Input
                                        id="lastname"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                        placeholder="Pérez"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-amber-500/50 focus:bg-white/10 rounded-xl"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reg-email" className="text-emerald-100/90 text-xs uppercase tracking-wider font-semibold">Correo</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-500 group-focus-within:text-amber-400 transition-colors" />
                                    <Input
                                        id="reg-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu@email.com"
                                        className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-amber-500/50 focus:bg-white/10 rounded-xl"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reg-password" className="text-emerald-100/90 text-xs uppercase tracking-wider font-semibold">Contraseña</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-500 group-focus-within:text-amber-400 transition-colors" />
                                    <Input
                                        id="reg-password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-9 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-amber-500/50 focus:bg-white/10 rounded-xl"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-stone-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-amber-900/20 rounded-xl h-11 font-medium tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? <Spinner className="w-5 h-5 text-white" /> : "Registrarse"}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
