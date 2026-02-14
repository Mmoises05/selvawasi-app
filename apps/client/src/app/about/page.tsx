
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Leaf, Heart, Globe } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-jungle-950/80 z-10" />
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1591787140888-c419996df3f3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-60"
                />
                <div className="relative z-20 container px-4 sm:px-6 flex flex-col items-center text-center">
                    <Badge variant="macaw" className="mb-6 px-4 py-1 text-sm uppercase tracking-widest">
                        Nuestra Historia
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 drop-shadow-lg">
                        Conectando la <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Amazonía</span> con el Mundo
                    </h1>
                    <p className="max-w-2xl text-lg md:text-xl text-white/90 leading-relaxed font-light">
                        Somos una plataforma nacida en el corazón de la selva, dedicada a digitalizar y potenciar el turismo sostenible en la región Loreto.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-background">
                <div className="container px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary opacity-20 blur-2xl rounded-3xl group-hover:opacity-30 transition-opacity duration-500" />
                            <img
                                src="https://images.unsplash.com/photo-1544636952-b88d3ca56453?q=80&w=2070&auto=format&fit=crop"
                                alt="Equipo SelvaWasi"
                                className="relative rounded-3xl shadow-2xl object-cover h-[500px] w-full transform group-hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                Nuestra Misión
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Facilitar el acceso a la maravillosa biodiversidad y cultura de la Amazonía peruana a través de tecnología innovadora, conectando de manera eficiente a viajeros globales con operadores locales, restaurantes y comunidades.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                                    <CardContent className="p-6 flex flex-col gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                            <Leaf className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-bold text-lg">Sostenibilidad</h3>
                                        <p className="text-sm text-muted-foreground">Promovemos un turismo responsable que respeta la naturaleza.</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                                    <CardContent className="p-6 flex flex-col gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-bold text-lg">Comunidad</h3>
                                        <p className="text-sm text-muted-foreground">Apoyamos el desarrollo económico de las comunidades locales.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-jungle-50">
                <div className="container px-4 sm:px-6 text-center">
                    <Badge variant="outline" className="mb-4 border-primary text-primary">Nuestros Valores</Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-jungle-900 mb-16">Lo que nos impulsa cada día</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center gap-4 p-6 bg-background rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300">
                            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                                <Heart className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Pasión por la Selva</h3>
                            <p className="text-muted-foreground">Amamos nuestra tierra y queremos mostrar su belleza al mundo entero.</p>
                        </div>
                        <div className="flex flex-col items-center gap-4 p-6 bg-background rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300">
                            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                                <Globe className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Innovación</h3>
                            <p className="text-muted-foreground">Usamos la tecnología para romper barreras y mejorar experiencias de viaje.</p>
                        </div>
                        <div className="flex flex-col items-center gap-4 p-6 bg-background rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300">
                            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Confianza</h3>
                            <p className="text-muted-foreground">Verificamos cada operador para garantizar tu seguridad y satisfacción.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
