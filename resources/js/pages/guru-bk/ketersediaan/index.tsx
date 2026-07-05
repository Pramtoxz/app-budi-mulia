import { Head, router, useForm } from '@inertiajs/react';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { guruBkRoutes } from '@/lib/routes';

interface JadwalData {
    id: number;
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
}

interface BlokirData {
    id: number;
    tgl_blokir: string;
    alasan: string | null;
}

interface Props {
    jadwal: JadwalData[];
    blokir: BlokirData[];
}

const HARI_OPTIONS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function KetersediaanIndex({ jadwal, blokir }: Props) {
    const [blokirDialogOpen, setBlokirDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingBlokir, setDeletingBlokir] = useState<BlokirData | null>(null);

    const existingHari = jadwal.map((j) => j.hari);
    const existingJamMulai = jadwal[0]?.jam_mulai?.substring(0, 5) || '08:00';
    const existingJamSelesai = jadwal[0]?.jam_selesai?.substring(0, 5) || '11:00';

    const { data, setData, post, processing, errors, reset } = useForm({
        hari: existingHari,
        jam_mulai: existingJamMulai,
        jam_selesai: existingJamSelesai,
    });

    const blokirForm = useForm({
        tgl_blokir: '',
        alasan: '',
    });

    const toggleHari = (hari: string) => {
        setData('hari', data.hari.includes(hari) ? data.hari.filter((h) => h !== hari) : [...data.hari, hari]);
    };

    const handleSaveTemplate = (e: FormEvent) => {
        e.preventDefault();
        post(guruBkRoutes.ketersediaan.template, {
            onSuccess: () => reset(),
        });
    };

    const handleAddBlokir = (e: FormEvent) => {
        e.preventDefault();
        blokirForm.post(guruBkRoutes.ketersediaan.blokir, {
            onSuccess: () => {
 blokirForm.reset(); setBlokirDialogOpen(false); 
},
        });
    };

    const handleRemoveBlokir = () => {
        if (!deletingBlokir) {
return;
}

        router.delete(guruBkRoutes.ketersediaan.removeBlokir(deletingBlokir.id), {
            onSuccess: () => {
 setDeleteDialogOpen(false); setDeletingBlokir(null); 
},
        });
    };

    const formatTime = (t: string) => t?.substring(0, 5) || t;
    const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <>
            <Head title="Ketersediaan BK" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Ketersediaan BK</h1>
                    <p className="text-muted-foreground">Atur jadwal ketersediaan layanan bimbingan konseling</p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="size-5" />
                                Template Mingguan
                            </CardTitle>
                            <CardDescription>
                                Pilih hari dan jam ketersediaan. Template ini berlaku setiap minggu.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveTemplate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Hari Tersedia</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {HARI_OPTIONS.map((hari) => (
                                            <label
                                                key={hari}
                                                className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${data.hari.includes(hari) ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'}`}
                                            >
                                                <Checkbox checked={data.hari.includes(hari)} onCheckedChange={() => toggleHari(hari)} />
                                                {hari}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.hari && <p className="text-destructive text-sm">{errors.hari}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="jam_mulai">Jam Mulai</Label>
                                        <Input id="jam_mulai" type="time" value={data.jam_mulai} onChange={(e) => setData('jam_mulai', e.target.value)} />
                                        {errors.jam_mulai && <p className="text-destructive text-sm">{errors.jam_mulai}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="jam_selesai">Jam Selesai</Label>
                                        <Input id="jam_selesai" type="time" value={data.jam_selesai} onChange={(e) => setData('jam_selesai', e.target.value)} />
                                        {errors.jam_selesai && <p className="text-destructive text-sm">{errors.jam_selesai}</p>}
                                    </div>
                                </div>

                                <Button type="submit" disabled={processing || data.hari.length === 0} className="w-full">
                                    {processing ? 'Menyimpan...' : 'Simpan Template'}
                                </Button>
                            </form>

                            {jadwal.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Jadwal aktif:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {jadwal.map((j) => (
                                            <Badge key={j.id} variant="secondary">
                                                {j.hari} {formatTime(j.jam_mulai)}-{formatTime(j.jam_selesai)}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="size-5" />
                                        Tanggal Diblokir
                                    </CardTitle>
                                    <CardDescription>
                                        Tanggal ketika BK tidak tersedia (sakit, rapat, dll)
                                    </CardDescription>
                                </div>
                                <Button size="sm" onClick={() => setBlokirDialogOpen(true)}>
                                    <Plus className="size-4" />
                                    Blokir Tanggal
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {blokir.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Clock className="size-8 text-muted-foreground/50" />
                                    <p className="mt-2 text-muted-foreground text-sm">Tidak ada tanggal yang diblokir</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Alasan</TableHead>
                                            <TableHead className="w-[60px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {blokir.map((b) => (
                                            <TableRow key={b.id}>
                                                <TableCell className="font-medium">{formatDate(b.tgl_blokir)}</TableCell>
                                                <TableCell className="text-muted-foreground">{b.alasan || '-'}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" onClick={() => {
 setDeletingBlokir(b); setDeleteDialogOpen(true); 
}}>
                                                        <Trash2 className="size-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={blokirDialogOpen} onOpenChange={setBlokirDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Blokir Tanggal</DialogTitle>
                        <DialogDescription>Blokir tanggal tertentu ketika BK tidak tersedia</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddBlokir} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tanggal *</Label>
                            <Input type="date" value={blokirForm.data.tgl_blokir} onChange={(e) => blokirForm.setData('tgl_blokir', e.target.value)} min={new Date().toISOString().split('T')[0]} />
                            {blokirForm.errors.tgl_blokir && <p className="text-destructive text-sm">{blokirForm.errors.tgl_blokir}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Alasan</Label>
                            <Input value={blokirForm.data.alasan} onChange={(e) => blokirForm.setData('alasan', e.target.value)} placeholder="Contoh: Rapat dinas, sakit, dll" />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => {
 setBlokirDialogOpen(false); blokirForm.reset(); 
}}>Batal</Button>
                            <Button type="submit" disabled={blokirForm.processing}>
                                {blokirForm.processing ? 'Menyimpan...' : 'Blokir'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Blokir</DialogTitle>
                        <DialogDescription>
                            Hapus blokir tanggal <strong>{deletingBlokir ? formatDate(deletingBlokir.tgl_blokir) : ''}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
 setDeleteDialogOpen(false); setDeletingBlokir(null); 
}}>Batal</Button>
                        <Button variant="destructive" onClick={handleRemoveBlokir}>Hapus Blokir</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

KetersediaanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Ketersediaan', href: '/guru-bk/ketersediaan' },
    ],
};
