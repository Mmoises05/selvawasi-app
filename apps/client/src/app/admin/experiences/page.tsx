"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Plus, MapPin, Pencil, Trash2, Image as ImageIcon, Search, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { Textarea } from "@/components/ui/textarea";

interface Operator {
    id: string;
    companyName: string;
}

interface Experience {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    duration: string;
    images: string; // JSON string
    operatorId: string;
    operator?: Operator;
}

export default function ExperiencesPage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // Dialog States
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentExp, setCurrentExp] = useState<Experience | null>(null);

    const initialFormState = {
        title: "",
        description: "",
        location: "",
        operatorId: "",
        price: 0,
        duration: "",
        imageUrl: ""
    };

    const [formData, setFormData] = useState(initialFormState);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/experiences');
            setExperiences(response.data);
            setFilteredExperiences(response.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const results = experiences.filter(exp =>
            exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exp.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredExperiences(results);
    }, [searchTerm, experiences]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                images: formData.imageUrl ? JSON.stringify([formData.imageUrl]) : JSON.stringify([])
            };
            const { imageUrl, ...finalData } = payload;

            await api.post('/experiences', finalData);
            setIsCreateOpen(false);
            setFormData(initialFormState);
            fetchData();
        } catch (error) {
            console.error("Failed to create", error);
            alert("Error al crear. Verifica los datos.");
        }
    };

    const handleEdit = (exp: Experience) => {
        let imgUrl = "";
        try {
            const parsed = JSON.parse(exp.images);
            if (Array.isArray(parsed) && parsed.length > 0) imgUrl = parsed[0];
        } catch (e) { }

        setFormData({
            title: exp.title,
            description: exp.description,
            location: exp.location,
            operatorId: exp.operatorId,
            price: Number(exp.price),
            duration: exp.duration,
            imageUrl: imgUrl
        });
        setCurrentExp(exp);
        setIsEditOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentExp) return;
        try {
            const payload = {
                ...formData,
                images: formData.imageUrl ? JSON.stringify([formData.imageUrl]) : JSON.stringify([])
            };
            const { imageUrl, ...finalData } = payload;

            await api.patch(`/experiences/${currentExp.id}`, finalData);
            setIsEditOpen(false);
            setCurrentExp(null);
            setFormData(initialFormState);
            fetchData();
        } catch (error) {
            console.error("Failed to update", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar esta experiencia?")) return;
        try {
            await api.delete(`/experiences/${id}`);
            fetchData();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-4rem)] p-8">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <img src="/images/pattern-jungle.png" alt="" className="w-full h-full object-cover mix-blend-overlay" />
            </div>

            <div className="relative z-10 space-y-8 animate-in fade-in duration-700">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-cinzel text-white tracking-wide">
                            Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Experiencias</span>
                        </h1>
                        <p className="text-slate-400 font-light text-lg max-w-2xl">
                            Administra el catálogo de ecoturismo, precios y disponibilidad en tiempo real.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <Input
                                placeholder="Buscar experiencias..."
                                className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-10 focus-visible:ring-emerald-500/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 shadow-lg shadow-emerald-900/20 h-10 px-6 rounded-xl font-bold tracking-wide transition-all hover:-translate-y-1">
                                    <Plus className="mr-2 h-4 w-4" /> Nueva
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-950/95 backdrop-blur-xl border border-white/10 text-white sm:max-w-[500px] rounded-[2rem] shadow-2xl">
                                <DialogHeader>
                                    <DialogTitle className="font-cinzel text-2xl text-emerald-400 pb-4 border-b border-white/5">
                                        Crear Nueva Experiencia
                                    </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreate} className="space-y-5 mt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-400/80 text-[10px] uppercase tracking-wider font-bold">Título</Label>
                                            <Input className="bg-white/5 border-white/10 rounded-xl h-11 focus-visible:ring-emerald-500/50" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-400/80 text-[10px] uppercase tracking-wider font-bold">Ubicación</Label>
                                            <Input className="bg-white/5 border-white/10 rounded-xl h-11 focus-visible:ring-emerald-500/50" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-emerald-400/80 text-[10px] uppercase tracking-wider font-bold">Descripción</Label>
                                        <Textarea className="bg-white/5 border-white/10 rounded-xl min-h-[100px] focus-visible:ring-emerald-500/50 resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-400/80 text-[10px] uppercase tracking-wider font-bold">Precio (S/.)</Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">S/.</span>
                                                <Input type="number" step="0.01" className="pl-8 bg-white/5 border-white/10 rounded-xl h-11 focus-visible:ring-emerald-500/50 text-right font-mono text-amber-400" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} required />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-400/80 text-[10px] uppercase tracking-wider font-bold">Duración</Label>
                                            <Input placeholder="Ej: 3 Días / 2 Noches" className="bg-white/5 border-white/10 rounded-xl h-11 focus-visible:ring-emerald-500/50" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-emerald-400/80 text-[10px] uppercase tracking-wider font-bold">URL de Imagen Principal</Label>
                                        <Input placeholder="https://..." className="bg-white/5 border-white/10 rounded-xl h-11 focus-visible:ring-emerald-500/50 text-blue-400 underline decoration-blue-400/30" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-emerald-400/80 text-[10px] uppercase tracking-wider font-bold">ID Operador</Label>
                                        <Input className="bg-white/5 border-white/10 rounded-xl h-11 focus-visible:ring-emerald-500/50 font-mono text-xs" value={formData.operatorId} onChange={(e) => setFormData({ ...formData, operatorId: e.target.value })} placeholder="UUID del operador" required />
                                    </div>

                                    <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 mt-4 h-12 rounded-xl font-bold tracking-wide shadow-lg">
                                        Guardar Experiencia
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <Table>
                        <TableHeader className="bg-black/20 border-b border-white/5">
                            <TableRow className="hover:bg-transparent border-white/5">
                                <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-6 pl-8">Experiencia</TableHead>
                                <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-6">Detalles</TableHead>
                                <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-6">Operador</TableHead>
                                <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-6 text-right pr-8">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 text-slate-500">
                                            <div className="animate-spin h-8 w-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full" />
                                            <p className="font-medium">Cargando catálogo...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredExperiences.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-64 text-center text-slate-500 italic">
                                        No se encontraron resultados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredExperiences.map((exp) => {
                                    let imgUrl = null;
                                    try {
                                        const parsed = JSON.parse(exp.images);
                                        if (Array.isArray(parsed) && parsed.length > 0) imgUrl = parsed[0];
                                    } catch (e) { }

                                    return (
                                        <TableRow key={exp.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <TableCell className="py-6 pl-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="h-20 w-32 rounded-2xl bg-slate-950 border border-white/10 overflow-hidden relative shadow-lg group-hover:scale-105 transition-transform duration-500">
                                                        {imgUrl ? (
                                                            <img
                                                                src={imgUrl}
                                                                alt={exp.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1596395819057-d37eace86915?q=80&w=200&auto=format&fit=crop"}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-900">
                                                                <ImageIcon size={24} />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                    </div>
                                                    <div>
                                                        <span className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors font-cinzel tracking-wide">{exp.title}</span>
                                                        <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                                                            <MapPin size={14} className="text-emerald-500" />
                                                            {exp.location}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-2xl font-bold text-white tracking-tight">S/. {Number(exp.price).toFixed(2)}</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-white/5 px-2 py-1 rounded w-fit">{exp.duration}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-white/10 text-xs font-medium text-slate-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    {exp.operator?.companyName || "Operador Externo"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button onClick={() => handleEdit(exp)} variant="ghost" size="icon" className="h-10 w-10 p-0 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
                                                        <Pencil size={18} />
                                                    </Button>
                                                    <Button onClick={() => handleDelete(exp.id)} variant="ghost" size="icon" className="h-10 w-10 p-0 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* EDIT DIALOG */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="bg-slate-950/95 backdrop-blur-xl border border-white/10 text-white sm:max-w-[500px] rounded-[2rem] shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="font-cinzel text-2xl text-amber-400 pb-4 border-b border-white/5">Editar Experiencia</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-5 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-amber-400/80 text-[10px] uppercase tracking-wider font-bold">Título</Label>
                                    <Input className="bg-white/5 border-white/10 rounded-xl h-11 focus-visible:ring-amber-500/50" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-amber-400/80 text-[10px] uppercase tracking-wider font-bold">Ubicación</Label>
                                    <Input className="bg-white/5 border-white/10 rounded-xl h-11 focus-visible:ring-amber-500/50" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-amber-400/80 text-[10px] uppercase tracking-wider font-bold">Descripción</Label>
                                <Textarea className="bg-white/5 border-white/10 rounded-xl min-h-[100px] focus-visible:ring-amber-500/50 resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-amber-400/80 text-[10px] uppercase tracking-wider font-bold">Precio (S/.)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">S/.</span>
                                        <Input type="number" step="0.01" className="pl-8 bg-white/5 border-white/10 rounded-xl h-11 focus-visible:ring-amber-500/50 text-right font-mono text-white" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} required />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-amber-400/80 text-[10px] uppercase tracking-wider font-bold">Duración</Label>
                                    <Input className="bg-white/5 border-white/10 rounded-xl h-11 focus-visible:ring-amber-500/50" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-amber-400/80 text-[10px] uppercase tracking-wider font-bold">URL de Imagen</Label>
                                <Input className="bg-white/5 border-white/10 rounded-xl h-11 focus-visible:ring-amber-500/50" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
                            </div>

                            <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 mt-4 h-12 rounded-xl font-bold tracking-wide shadow-lg">
                                Guardar Cambios
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}
