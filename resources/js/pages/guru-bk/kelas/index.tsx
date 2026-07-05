import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, MoreHorizontal, GraduationCap, Users } from 'lucide-react';
import type { FormEvent} from 'react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { guruBkRoutes } from '@/lib/routes';

interface KelasData {
    id: number;
    nama: string;
    wali_kelas: string | null;
    siswa_kelas_count: number;
}

interface PaginatedKelas {
    data: KelasData[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    kelas: PaginatedKelas;
}

export default function KelasIndex({ kelas }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingKelas, setEditingKelas] = useState<KelasData | null>(null);
    const [deletingKelas, setDeletingKelas] = useState<KelasData | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama: '',
        wali_kelas: '',
    });

    const openCreateDialog = () => {
        reset();
        setEditingKelas(null);
        setDialogOpen(true);
    };

    const openEditDialog = (k: KelasData) => {
        setEditingKelas(k);
        setData({ nama: k.nama, wali_kelas: k.wali_kelas ?? '' });
        setDialogOpen(true);
    };

    const openDeleteDialog = (k: KelasData) => {
        setDeletingKelas(k);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (editingKelas) {
            put(guruBkRoutes.kelas.update(editingKelas.id), {
                onSuccess: () => {
                    setDialogOpen(false);
                    reset();
                    setEditingKelas(null);
                },
            });
        } else {
            post(guruBkRoutes.kelas.store, {
                onSuccess: () => {
                    setDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (deletingKelas) {
            router.delete(guruBkRoutes.kelas.destroy(deletingKelas.id), {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setDeletingKelas(null);
                },
            });
        }
    };

    return (
        <>
            <Head title="Kelola Kelas" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kelola Kelas</h1>
                        <p className="text-muted-foreground">Kelola data kelas sekolah</p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="size-4" />
                        Tambah Kelas
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="size-5" />
                            Daftar Kelas
                        </CardTitle>
                        <CardDescription>
                            Total {kelas.total} kelas terdaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {kelas.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <GraduationCap className="size-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-semibold">Belum ada kelas</h3>
                                <p className="text-muted-foreground text-sm">
                                    Mulai dengan menambahkan kelas baru
                                </p>
                                <Button onClick={openCreateDialog} className="mt-4">
                                    <Plus className="size-4" />
                                    Tambah Kelas
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Kelas</TableHead>
                                        <TableHead>Wali Kelas</TableHead>
                                        <TableHead className="text-center">Jumlah Siswa</TableHead>
                                        <TableHead className="w-[100px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kelas.data.map((k) => (
                                        <TableRow key={k.id}>
                                            <TableCell className="font-medium">{k.nama}</TableCell>
                                            <TableCell>
                                                {k.wali_kelas || (
                                                    <span className="text-muted-foreground italic">Belum ditentukan</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary" className="gap-1">
                                                    <Users className="size-3" />
                                                    {k.siswa_kelas_count}
                                                </Badge>
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
                                                            onClick={() => openDeleteDialog(k)}
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

                        {kelas.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-muted-foreground text-sm">
                                    Menampilkan {((kelas.current_page - 1) * kelas.per_page) + 1} - {Math.min(kelas.current_page * kelas.per_page, kelas.total)} dari {kelas.total} kelas
                                </p>
                                <div className="flex gap-1">
                                    {kelas.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingKelas ? 'Edit Kelas' : 'Tambah Kelas'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingKelas
                                ? 'Perbarui informasi kelas'
                                : 'Tambahkan kelas baru ke sistem'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Kelas *</Label>
                            <Input
                                id="nama"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                placeholder="Contoh: VII A"
                                autoFocus
                            />
                            {errors.nama && (
                                <p className="text-destructive text-sm">{errors.nama}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="wali_kelas">Wali Kelas</Label>
                            <Input
                                id="wali_kelas"
                                value={data.wali_kelas}
                                onChange={(e) => setData('wali_kelas', e.target.value)}
                                placeholder="Nama wali kelas (opsional)"
                            />
                            {errors.wali_kelas && (
                                <p className="text-destructive text-sm">{errors.wali_kelas}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setDialogOpen(false);
                                    reset();
                                    setEditingKelas(null);
                                }}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : editingKelas ? 'Perbarui' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Kelas</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus kelas <strong>{deletingKelas?.nama}</strong>?
                            {deletingKelas?.siswa_kelas_count ? (
                                <span className="text-destructive block mt-1">
                                    Kelas ini memiliki {deletingKelas.siswa_kelas_count} siswa. Hapus siswa dari kelas terlebih dahulu.
                                </span>
                            ) : null}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDeleteDialogOpen(false);
                                setDeletingKelas(null);
                            }}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={processing || (deletingKelas?.siswa_kelas_count ?? 0) > 0}
                        >
                            {processing ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

KelasIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kelas', href: '/guru-bk/kelas' },
    ],
};
