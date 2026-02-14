import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-cream-50">
            <Navbar />

            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-amazon-100">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-amazon-900">
                            Bienvenido de nuevo
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Ingresa a tu cuenta para gestionar tus reservas
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" action="#" method="POST">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input id="email" name="email" type="email" autoComplete="email" required placeholder="tu@email.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-amazon-600 focus:ring-amazon-500"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Recordarme
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link href="#" className="font-medium text-amazon-600 hover:text-amazon-500">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <Button type="submit" className="w-full" variant="default" size="lg">
                                Ingresar
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">O continúa con</span>
                            </div>
                        </div>

                        <Button variant="outline" type="button" className="w-full">
                            Google
                        </Button>

                    </form>

                    <p className="mt-2 text-center text-sm text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <Link href="/auth/register" className="font-medium text-amazon-600 hover:text-amazon-500">
                            Regístrate gratis
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
