import { Head, useForm, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Plus, Pencil, Trash2, MoreHorizontal, Calendar, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface GuruBk {
    id: number;
    name: string;
}

interface JadwalData {
    id: number;
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
    guru_bk: GuruBk;
}

interface Props {
    jadwal: JadwalData[];
    guruBkList: GuruBk[];
}

const HARI_OPTIONS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function JadwalIndex({ jadwal, guruBkList }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingJadwal, setEditingJadwal] = useState<JadwalData | null>(null);
    const [deletingJadwal, setDeletingJadwal] = useState<JadwalData | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        hari: '',
        jam_mulai: '',
        jam_selesai: '',
        guru_bk_id: '',
    });

    const openCreateDialog = () => {
        reset();
        setEditingJadwal(null);
        setDialogOpen(true);
    };

    const openEditDialog = (j: JadwalData) => {
        setEditingJadwal(j);
        setData({
            hari: j.hari,
            jam_mulai: j.jam_mulai,
            jam_selesai: j.jam_selesai,
            guru_bk_id: String(j.guru_bk.id),
        });
        setDialogOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingJadwal) {
            put(`/guru-bk/jadwal/${editingJadwal.id}`, {
                onSuccess: () => { setDialogOpen(false); reset(); setEditingJadwal(null); },
            });
        } else {
            post('/guru-bk/jadwal', {
                onSuccess: () => { setDialogOpen(false); reset(); },
            });
        }
    };

    const handleDelete = () => {
        if (deletingJadwal) {
            router.delete(`/guru-bk/jadwal/${deletingJadwal.id}`, {
                onSuccess: () => { setDeleteDialogOpen(false); setDeletingJadwal(null); },
            });
        }
    };

    const formatTime = (time: string) => time?.substring(0, 5) || time;

    return (
        <>
            <Head title="Kelola Jadwal" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kelola Jadwal</h1>
                        <p className="text-muted-foreground">Kelola jadwal layanan BK</p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="size-4" />
                        Tambah Jadwal
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="size-5" />
                            Daftar Jadwal
                        </CardTitle>
                        <CardDescription>Total {jadwal.length} jadwal aktif</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {jadwal.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Calendar className="size-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-semibold">Belum ada jadwal</h3>
                                <p className="text-muted-foreground text-sm">Mulai dengan menambahkan jadwal baru</p>
                                <Button onClick={openCreateDialog} className="mt-4">
                                    <Plus className="size-4" />
                                    Tambah Jadwal
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Hari</TableHead>
                                        <TableHead>Waktu</TableHead>
                                        <TableHead>Guru BK</TableHead>
                                        <TableHead className="w-[100px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {jadwal.map((j) => (
                                        <TableRow key={j.id}>
                                            <TableCell>
                                                <Badge variant="outline">{j.hari}</Badge>
                                            </TableCell>
                                            <TableCell className="flex items-center gap-1">
                                                <Clock className="size-3 text-muted-foreground" />
                                                {formatTime(j.jam_mulai)} - {formatTime(j.jam_selesai)}
                                            </TableCell>
                                            <TableCell className="font-medium">{j.guru_bk.name}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditDialog(j)}>
                                                            <Pencil className="size-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => { setDeletingJadwal(j); setDeleteDialogOpen(true); }}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="size-4" />
                                                            Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingJadwal ? 'Edit Jadwal' : 'Tambah Jadwal'}</DialogTitle>
                        <DialogDescription>{editingJadwal ? 'Perbarui jadwal layanan BK' : 'Tambahkan jadwal layanan BK baru'}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Hari *</Label>
                            <Select value={data.hari} onValueChange={(v) => setData('hari', v)}>
                                <SelectTrigger><SelectValue placeholder="Pilih hari" /></SelectTrigger>
                                <SelectContent>
                                    {HARI_OPTIONS.map((hari) => (
                                        <SelectItem key={hari} value={hari}>{hari}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.hari && <p className="text-destructive text-sm">{errors.hari}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="jam_mulai">Jam Mulai *</Label>
                                <Input id="jam_mulai" type="time" value={data.jam_mulai} onChange={(e) => setData('jam_mulai', e.target.value)} />
                                {errors.jam_mulai && <p className="text-destructive text-sm">{errors.jam_mulai}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jam_selesai">Jam Selesai *</Label>
                                <Input id="jam_selesai" type="time" value={data.jam_selesai} onChange={(e) => setData('jam_selesai', e.target.value)} />
                                {errors.jam_selesai && <p className="text-destructive text-sm">{errors.jam_selesai}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Guru BK *</Label>
                            <Select value={data.guru_bk_id} onValueChange={(v) => setData('guru_bk_id', v)}>
                                <SelectTrigger><SelectValue placeholder="Pilih Guru BK" /></SelectTrigger>
                                <SelectContent>
                                    {guruBkList.map((g) => (
                                        <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.guru_bk_id && <p className="text-destructive text-sm">{errors.guru_bk_id}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); reset(); setEditingJadwal(null); }}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : editingJadwal ? 'Perbarui' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Jadwal</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus jadwal <strong>{deletingJadwal?.hari} {formatTime(deletingJadwal?.jam_mulai || '')} - {formatTime(deletingJadwal?.jam_selesai || '')}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setDeletingJadwal(null); }}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                            {processing ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

JadwalIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Jadwal', href: '/guru-bk/jadwal' },
    ],
};
