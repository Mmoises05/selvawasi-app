import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex flex-col bg-cream-50">
            <Navbar />

            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-amazon-100">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-amazon-900">
                            Crea tu cuenta SelvaWasi
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Únete a la comunidad de viajeros y exploradores
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" action="#" method="POST">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input id="name" name="name" type="text" required placeholder="Juan" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastname">Apellido</Label>
                                    <Input id="lastname" name="lastname" type="text" required placeholder="Pérez" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input id="email" name="email" type="email" autoComplete="email" required placeholder="tu@email.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input id="password" name="password" type="password" autoComplete="new-password" required placeholder="••••••••" />
                            </div>
                        </div>

                        <div>
                            <Button type="submit" className="w-full" variant="macaw" size="lg">
                                Registrarse
                            </Button>
                        </div>

                        <p className="text-xs text-center text-gray-500">
                            Al registrarte, aceptas nuestros <Link href="/terms" className="underline">Términos</Link> y <Link href="/privacy" className="underline">Política de Privacidad</Link>.
                        </p>
                    </form>

                    <p className="mt-2 text-center text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <Link href="/auth/login" className="font-medium text-amazon-600 hover:text-amazon-500">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
