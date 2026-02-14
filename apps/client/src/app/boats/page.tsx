'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchWidget } from "@/components/search/search-widget";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { boatsService } from '@/services/boats.service';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/layout/page-header';
import { MapPin, Users, Anchor, ChevronRight, Search, Calendar as CalendarIcon, Ship, Clock, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addDays, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

import { cn } from "@/lib/utils"

interface Boat {
    id: string;
    name: string;
    description: string;
    capacity: number;
    operator: {
        fullName: string;
    };
    image?: string;
}

interface Route {
    id: string | number;
    origin: string;
    destination: string;
    duration: string;
    price: number;
    type: string;
    company: string;
    departureTime: string;
    arrivalTime: string;
    image: string;
    date?: Date; // Added date property
}

export default function TransportPage() {
    // Boats State
    const [boats, setBoats] = useState<Boat[]>([]);
    const [boatsLoading, setBoatsLoading] = useState(true);

    // Routes State
    const [allRoutes, setAllRoutes] = useState<Route[]>([]); // Store ALL generated routes
    const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]); // Store FILTERED routes
    const [routesLoading, setRoutesLoading] = useState(true);

    // Search State
    const [searchFilters, setSearchFilters] = useState<{
        origin: string;
        destination: string;
        date?: Date;
    }>({ origin: '', destination: '', date: undefined });

    // Active Tab State
    const [activeTab, setActiveTab] = useState("flota");

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentRoutes = filteredRoutes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRoutes.length / ITEMS_PER_PAGE);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Helper to process backend routes into displayable itineraries
    const processRoutes = (backendRoutes: any[]) => {
        const displayRoutes: Route[] = [];

        backendRoutes.forEach((route: any) => {
            if (route.schedules && route.schedules.length > 0) {
                route.schedules.forEach((schedule: any) => {
                    // Find the lowest price or default
                    const price = schedule.prices && schedule.prices.length > 0
                        ? parseFloat(schedule.prices[0].amount)
                        : 0;

                    displayRoutes.push({
                        id: schedule.id, // Use schedule ID as unique key
                        origin: route.origin,
                        destination: route.destination,
                        duration: `${Math.floor(route.duration / 60)}h ${route.duration % 60 > 0 ? (route.duration % 60) + 'm' : ''}`,
                        price: price,
                        type: schedule.boat.type || 'Transporte', // schedule.boat.type might need to be added to Boat model or inferred
                        company: schedule.boat.name,
                        departureTime: format(new Date(schedule.departureTime), 'hh:mm a'),
                        arrivalTime: format(new Date(schedule.arrivalTime), 'hh:mm a'),
                        image: getBoatImage(schedule.boat.name),
                        date: new Date(schedule.departureTime),
                    });
                });
            }
        });

        // Sort by date/time
        return displayRoutes.sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));
    };

    useEffect(() => {
        const fetchData = async () => {
            setBoatsLoading(true);
            setRoutesLoading(true);

            // Fetch Boats
            try {
                const boatsData = await boatsService.getAll();
                setBoats(boatsData);
            } catch (error) {
                console.error("Failed to load boats", error);
            } finally {
                setBoatsLoading(false);
            }

            // Fetch Routes
            try {
                const routesData = await boatsService.getRoutes();
                const processed = processRoutes(routesData);
                setAllRoutes(processed);
                setFilteredRoutes(processed);
            } catch (error) {
                console.error("Failed to load routes", error);
            } finally {
                setRoutesLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle Search from Widget
    const handleSearch = (filters: { origin: string; destination: string; date?: Date }) => {
        setSearchFilters(filters);
        setActiveTab("rutas"); // Switch to routes tab automatically
        setCurrentPage(1); // Reset to first page

        let results = allRoutes;

        // Filter by Origin
        if (filters.origin) {
            results = results.filter(r => r.origin.toLowerCase().includes(filters.origin.toLowerCase()));
        }

        // Filter by Destination
        if (filters.destination) {
            results = results.filter(r => r.destination.toLowerCase().includes(filters.destination.toLowerCase()));
        }

        // Filter by Date
        if (filters.date) {
            results = results.filter(r => r.date && filters.date && isSameDay(new Date(r.date), filters.date));
        }

        setFilteredRoutes(results);
    };

    // Mapeo de imagenes de alta calidad para las embarcaciones
    // PRIORITIZE LOCAL FILES THAT EXIST
    const getBoatImage = (name: string) => {
        const n = name.toLowerCase();

        // 1. Luxury / Cruceros
        // "El Gran Delfín" -> Delfin III
        if (n.includes('delfín iii') || n.includes('delfin iii') || n.includes('gran delfín')) return "/images/boats/delfin-iii.png";
        // "Delfín II" -> Delfin II
        if (n.includes('delfín ii') || n.includes('delfin ii')) return "/images/boats/delfin-ii.png";
        // "Aqua Expedition" -> Aria
        if (n.includes('aria') || n.includes('aqua')) return "/images/boats/aria.png";
        // "Zafiro" (NEW)
        if (n.includes('zafiro')) return "/images/boats/zafiro.png";

        // 2. Carga / Mixto (Motonaves grandes)
        // "Don José", "Henry", "Eduardo", "Lorena" -> Don Jose / Reina Style
        if (n.includes('don josé') || n.includes('jose') || n.includes('henry') || n.includes('eduardo') || n.includes('lorena')) return "/images/boats/don-jose.png";
        // "Pumacahua" (NEW)
        if (n.includes('pumacahua')) return "/images/boats/pumacahua.png";

        // "Reina de la Selva" -> Reina (Exists)
        if (n.includes('reina')) return "/images/boats/reina.png";

        // 3. Variables / Fallbacks for missing specific images
        // "Rápido Nanay", "Expreso Amazonas", "Nauta", "Transtur" -> Amazonas II (Generic Fast Boat equivalent that EXISTS)
        if (n.includes('rápido') || n.includes('rapido') || n.includes('nanay') || n.includes('nauta') || n.includes('transtur')) return "/images/boats/amazonas-ii.png";
        // "Amazonas I" (NEW)
        if (n.includes('amazonas i') || n.includes('amazonas 1')) return "/images/boats/amazonas-i.png";
        // Match generic amazonas if not I
        if (n.includes('amazonas')) return "/images/boats/amazonas-ii.png";

        // Default fallback 
        return "/images/boats/ferry-generic.png";
    };

    return (
        // KEY CHANGE: Removed 'overflow-hidden' which was blocking scroll on long content.
        // Kept 'min-h-screen' and 'relative' for standard layout.
        <div className="min-h-screen relative font-sans selection:bg-emerald-500/30 bg-slate-50">
            {/* Background Image - Original */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/bg-fleet.jpg"
                    alt="Nanay Bridge View"
                    className="w-full h-full object-cover fixed inset-0 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-transparent to-emerald-900/20 mix-blend-multiply fixed inset-0 pointer-events-none" />
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] fixed inset-0 pointer-events-none" />
            </div>

            <Navbar />

            <main className="relative z-10 container mx-auto px-4 pb-20 pt-32">

                {/* Header - Glass Card */}
                <div className="text-center mb-16 space-y-4 bg-white/20 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-[2.5rem] shadow-xl max-w-3xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-sm font-cinzel">
                        <span className="bg-gradient-to-r from-red-500 via-amber-400 via-emerald-500 to-sky-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x p-1">
                            Logística Fluvial
                        </span>
                    </h1>
                    <p className="text-white text-lg md:text-2xl font-serif italic tracking-wide drop-shadow-md max-w-xl mx-auto opacity-95">
                        "Excelencia y Confort en el Amazonas"
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">
                    <div className="flex justify-center mb-12">
                        <TabsList className="bg-white/20 border border-white/30 p-1.5 rounded-full backdrop-blur-xl shadow-lg">
                            <TabsTrigger value="flota" className="rounded-full px-8 py-3 text-lg font-cinzel font-bold text-white/90 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/10 hover:text-white transition-all">
                                Nuestra Flota
                            </TabsTrigger>
                            <TabsTrigger value="rutas" className="rounded-full px-8 py-3 text-lg font-cinzel font-bold text-white/90 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/10 hover:text-white transition-all">
                                Itinerarios y Rutas
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* TAB: FLOTA */}
                    <TabsContent value="flota" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {boatsLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-96 bg-white/20 rounded-[2.5rem] animate-pulse border border-white/10" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {!boatsLoading && boats.length === 0 && (
                                    <div className="col-span-full text-center py-20 bg-white/20 rounded-[3rem] border border-dashed border-white/40 backdrop-blur-sm">
                                        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Ship className="w-8 h-8 text-white/70" />
                                        </div>
                                        <h3 className="text-white font-bold text-xl font-cinzel mb-2">No se encontraron embarcaciones</h3>
                                        <p className="text-white/80 font-medium">Estamos actualizando nuestra flota o hubo un error de conexión.</p>
                                    </div>
                                )}
                                {boats.map((boat) => (
                                    <Card key={boat.id} className="group overflow-hidden bg-white/30 backdrop-blur-xl border border-white/40 hover:border-white/60 hover:bg-white/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(8,112,184,0.2)] rounded-[2.5rem] shadow-lg">
                                        <div className="h-64 w-full relative overflow-hidden m-2 rounded-[2rem] shadow-inner mb-0">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                                            {/* IMAGE FIX: Use getBoatImage strictly if external URLs are unreliable, OR prefer external but fallback correctly. 
                                                User complained about 'blanks', suggesting external URLs might be broken or blocked. 
                                                SAFE BET: Use getBoatImage() as primary source since we verified local files exist. */}
                                            <img
                                                src={getBoatImage(boat.name)}
                                                alt={boat.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 right-4 z-20">
                                                <Badge className="bg-emerald-500/80 text-white border-none backdrop-blur-md px-3 py-1 shadow-lg font-sans tracking-wide">Disponible</Badge>
                                            </div>
                                        </div>
                                        <CardHeader className="relative z-20 px-8 pt-6 pb-2">
                                            <CardTitle className="text-3xl font-cinzel font-bold text-slate-800 group-hover:text-emerald-800 transition-colors drop-shadow-sm">{boat.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-2 text-slate-600 font-medium uppercase tracking-wider text-xs bg-white/40 inline-flex px-3 py-1 rounded-full w-fit mt-2">
                                                <Anchor size={12} className="text-emerald-600" /> {boat.operator?.fullName || 'Operador Local'}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="px-8 py-4 space-y-4">
                                            <p className="text-slate-700 text-sm leading-relaxed line-clamp-2 font-medium">{boat.description || 'Una experiencia única navegando los ríos amazónicos con el máximo confort y seguridad.'}</p>
                                            <div className="flex items-center gap-4 text-sm text-slate-700">
                                                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-white/50 shadow-sm">
                                                    <Users size={16} className="text-emerald-600" />
                                                    <span>Capacidad: <span className="text-slate-900 font-bold">{boat.capacity}</span></span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="px-8 pb-8 pt-2">
                                            <Link href={`/boats/${boat.id}`} className="w-full">
                                                <Button className="w-full h-12 bg-slate-800 hover:bg-emerald-700 text-white border-0 shadow-xl transition-all rounded-2xl justify-between group-hover:px-8 text-base font-medium">
                                                    Ver Detalles <ChevronRight size={18} />
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* TAB: RUTAS */}
                    <TabsContent value="rutas" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* SEARCH WIDGET - CONNECTED */}
                        <div className="mt-8 mb-16 px-4">
                            <SearchWidget onSearch={handleSearch} />
                        </div>

                        {/* Search Results Header */}
                        {(searchFilters.origin || searchFilters.destination || searchFilters.date) && (
                            <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl mb-6 flex items-center gap-4 border border-white/50 shadow-sm">
                                <Search className="w-5 h-5 text-emerald-700" />
                                <span className="text-slate-700 font-medium">Resultados para: </span>
                                {searchFilters.origin && <Badge variant="secondary" className="bg-white/60 text-emerald-800">{searchFilters.origin}</Badge>}
                                {searchFilters.destination && <Badge variant="secondary" className="bg-white/60 text-emerald-800">{searchFilters.destination}</Badge>}
                                {searchFilters.date && <Badge variant="secondary" className="bg-white/60 text-emerald-800">{format(searchFilters.date, "P", { locale: es })}</Badge>}
                                <Button variant="ghost" size="sm" onClick={() => {
                                    setSearchFilters({ origin: '', destination: '', date: undefined });
                                    setFilteredRoutes(allRoutes); // Reset
                                    setCurrentPage(1);
                                }} className="ml-auto text-slate-500 hover:text-red-500">Limpiar Filtros</Button>
                            </div>
                        )}

                        {/* Results */}
                        {routesLoading ? (
                            <div className="space-y-6 max-w-5xl mx-auto">
                                {[1, 2].map((i) => <div key={i} className="h-48 bg-white/40 rounded-[2.5rem] animate-pulse border border-white/20" />)}
                            </div>
                        ) : (
                            <div className="space-y-6 max-w-5xl mx-auto">
                                {currentRoutes.length > 0 ? (
                                    currentRoutes.map((route) => (
                                        <Card key={route.id} className="group hover:bg-white/50 transition-all duration-300 border-white/40 bg-white/30 backdrop-blur-xl overflow-visible relative rounded-[2.5rem] hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-900/10 hover:-translate-y-1">
                                            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                                                <div className="flex items-center gap-5 w-full md:w-auto min-w-[250px]">
                                                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white/80 shrink-0">
                                                        <img
                                                            src={getBoatImage(route.company)}
                                                            alt={route.company}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-cinzel font-bold text-xl text-slate-800">{route.company}</h3>
                                                        <Badge variant="outline" className="mt-1 text-xs border-amber-500/50 text-amber-700 bg-amber-500/10 font-bold">{route.type}</Badge>
                                                        {route.date && (
                                                            <div className="text-xs text-slate-500 mt-1 font-medium bg-white/40 px-2 py-0.5 rounded-full inline-block">
                                                                {format(route.date, "EEEE d 'de' MMMM", { locale: es })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 w-full border-t md:border-t-0 md:border-l border-slate-200/50 pt-4 md:pt-0">
                                                    <div className="text-center"><span className="text-3xl font-light text-slate-800">{route.departureTime}</span><br /><span className="text-xs text-slate-500 uppercase tracking-widest font-bold">{route.origin}</span></div>
                                                    <div className="flex flex-col items-center"><span className="text-xs text-slate-500 mb-1 font-medium bg-white/50 px-2 py-0.5 rounded-full">{route.duration}</span><div className="w-32 h-[2px] bg-slate-200 relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" /></div></div>
                                                    <div className="text-center"><span className="text-3xl font-light text-slate-800">{route.arrivalTime}</span><br /><span className="text-xs text-slate-500 uppercase tracking-widest font-bold">{route.destination}</span></div>
                                                </div>
                                                <div className="text-center md:text-right pl-0 md:pl-8 md:border-l border-slate-200/50 w-full md:w-auto">
                                                    <span className="text-4xl font-bold text-emerald-700 tracking-tight">S/. {route.price.toFixed(2)}</span>
                                                    <Link href={`/book/${route.id}`} className="block w-full mt-3">
                                                        <Button size="lg" className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl shadow-lg font-bold">
                                                            Seleccionar
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-white/20 rounded-[3rem] border border-dashed border-white/40 backdrop-blur-sm">
                                        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search className="w-8 h-8 text-white/70" />
                                        </div>
                                        <h3 className="text-white font-bold text-xl font-cinzel mb-2">No encontramos itinerarios</h3>
                                        <p className="text-white/80 font-medium">Intenta cambiar la fecha o los filtros de búsqueda.</p>
                                        <Button variant="link" className="text-white mt-4 font-bold underline" onClick={() => setFilteredRoutes(allRoutes)}>Ver todos los itinerarios</Button>
                                    </div>
                                )}
                                {/* Pagination Controls */}
                                {!routesLoading && filteredRoutes.length > ITEMS_PER_PAGE && (
                                    <div className="flex justify-center items-center gap-4 mt-12 pb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <Button
                                            variant="outline"
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="border-slate-300 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 rounded-xl"
                                        >
                                            <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Anterior
                                        </Button>

                                        <span className="text-slate-600 font-medium bg-white/50 px-4 py-2 rounded-lg border border-white/50 shadow-sm">
                                            Página <span className="text-emerald-700 font-bold">{currentPage}</span> de {totalPages}
                                        </span>

                                        <Button
                                            variant="outline"
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="border-slate-300 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 rounded-xl"
                                        >
                                            Siguiente <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
            <Footer />
        </div>
    );
}
