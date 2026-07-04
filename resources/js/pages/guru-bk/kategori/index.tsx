import { Head, useForm, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Plus, Pencil, Trash2, MoreHorizontal, Tags } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface KategoriData {
    id: number;
    nama: string;
    deskripsi: string | null;
    pengajuan_count: number;
}

interface Props {
    kategori: KategoriData[];
}

export default function KategoriIndex({ kategori }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingKategori, setEditingKategori] = useState<KategoriData | null>(null);
    const [deletingKategori, setDeletingKategori] = useState<KategoriData | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama: '',
        deskripsi: '',
    });

    const openCreateDialog = () => {
        reset();
        setEditingKategori(null);
        setDialogOpen(true);
    };

    const openEditDialog = (k: KategoriData) => {
        setEditingKategori(k);
        setData({ nama: k.nama, deskripsi: k.deskripsi ?? '' });
        setDialogOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingKategori) {
            put(`/guru-bk/kategori/${editingKategori.id}`, {
                onSuccess: () => { setDialogOpen(false); reset(); setEditingKategori(null); },
            });
        } else {
            post('/guru-bk/kategori', {
                onSuccess: () => { setDialogOpen(false); reset(); },
            });
        }
    };

    const handleDelete = () => {
        if (deletingKategori) {
            router.delete(`/guru-bk/kategori/${deletingKategori.id}`, {
                onSuccess: () => { setDeleteDialogOpen(false); setDeletingKategori(null); },
            });
        }
    };

    return (
        <>
            <Head title="Kelola Kategori" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kelola Kategori</h1>
                        <p className="text-muted-foreground">Kelola kategori konseling</p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="size-4" />
                        Tambah Kategori
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tags className="size-5" />
                            Daftar Kategori
                        </CardTitle>
                        <CardDescription>Total {kategori.length} kategori</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {kategori.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Tags className="size-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-semibold">Belum ada kategori</h3>
                                <p className="text-muted-foreground text-sm">Mulai dengan menambahkan kategori baru</p>
                                <Button onClick={openCreateDialog} className="mt-4">
                                    <Plus className="size-4" />
                                    Tambah Kategori
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Kategori</TableHead>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableHead className="text-center">Digunakan</TableHead>
                                        <TableHead className="w-[100px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kategori.map((k) => (
                                        <TableRow key={k.id}>
                                            <TableCell className="font-medium">{k.nama}</TableCell>
                                            <TableCell className="text-muted-foreground max-w-[300px] truncate">
                                                {k.deskripsi || '-'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">{k.pengajuan_count}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditDialog(k)}>
                                                            <Pencil className="size-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => { setDeletingKategori(k); setDeleteDialogOpen(true); }}
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
                        <DialogTitle>{editingKategori ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
                        <DialogDescription>{editingKategori ? 'Perbarui informasi kategori' : 'Tambahkan kategori konseling baru'}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Kategori *</Label>
                            <Input id="nama" value={data.nama} onChange={(e) => setData('nama', e.target.value)} placeholder="Contoh: Masalah Akademik" autoFocus />
                            {errors.nama && <p className="text-destructive text-sm">{errors.nama}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea id="deskripsi" value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} placeholder="Deskripsi kategori (opsional)" rows={3} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); reset(); setEditingKategori(null); }}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : editingKategori ? 'Perbarui' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Kategori</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus kategori <strong>{deletingKategori?.nama}</strong>?
                            {(deletingKategori?.pengajuan_count ?? 0) > 0 && (
                                <span className="text-destructive block mt-1">
                                    Kategori ini digunakan oleh {deletingKategori?.pengajuan_count} pengajuan.
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setDeletingKategori(null); }}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={processing || (deletingKategori?.pengajuan_count ?? 0) > 0}>
                            {processing ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

KategoriIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kategori', href: '/guru-bk/kategori' },
    ],
};
