import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Pencil, Trash2, MoreHorizontal, Users, Search, Eye, KeyRound, UserPlus, UserX } from 'lucide-react';
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

interface KelasInfo {
    id: number;
    nama: string;
}

interface SiswaKelas {
    id: number;
    kelas: KelasInfo;
    tahun_ajaran: string;
    status: string;
}

interface AkunInfo {
    id: number;
    username: string;
}

interface SiswaData {
    id: number;
    nis: string;
    nama: string;
    jenkel: string;
    agama: string | null;
    siswa_kelas: SiswaKelas[];
    user: AkunInfo | null;
}

interface PaginatedSiswa {
    data: SiswaData[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    siswa: PaginatedSiswa;
    filters: { search?: string };
}

export default function SiswaIndex({ siswa, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingSiswa, setDeletingSiswa] = useState<SiswaData | null>(null);
    const [akunDialogOpen, setAkunDialogOpen] = useState(false);
    const [akunMode, setAkunMode] = useState<'buat' | 'reset'>('buat');
    const [akunSiswa, setAkunSiswa] = useState<SiswaData | null>(null);
    const [hapusAkunDialogOpen, setHapusAkunDialogOpen] = useState(false);
    const [hapusAkunSiswa, setHapusAkunSiswa] = useState<SiswaData | null>(null);

    const { processing } = useForm();

    const handleSearch = () => {
        router.get(guruBkRoutes.siswa.index, { search }, { preserveState: true });
    };

    const openDeleteDialog = (s: SiswaData) => {
        setDeletingSiswa(s);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (deletingSiswa) {
            router.delete(guruBkRoutes.siswa.destroy(deletingSiswa.id), {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setDeletingSiswa(null);
                },
            });
        }
    };

    const getKelasInfo = (s: SiswaData) => {
        const aktif = s.siswa_kelas.find((sk) => sk.status === 'aktif');

        return aktif ? aktif.kelas.nama : '-';
    };

    const akunForm = useForm({ username: '', password: '' });

    const openAkunDialog = (s: SiswaData, mode: 'buat' | 'reset') => {
        setAkunSiswa(s);
        setAkunMode(mode);
        akunForm.setData({ username: s.nis, password: s.nis.length >= 6 ? s.nis : '' });
        akunForm.clearErrors();
        setAkunDialogOpen(true);
    };

    const closeAkunDialog = () => {
        setAkunDialogOpen(false);
        setAkunSiswa(null);
        akunForm.clearErrors();
    };

    const handleAkunSubmit = () => {
        if (!akunSiswa) {
return;
}

        const options = { preserveScroll: true, onSuccess: () => closeAkunDialog() };

        if (akunMode === 'buat') {
            akunForm.post(guruBkRoutes.siswa.akun.store(akunSiswa.id), options);
        } else {
            akunForm.put(guruBkRoutes.siswa.akun.resetPassword(akunSiswa.id), options);
        }
    };

    const handleHapusAkun = () => {
        if (!hapusAkunSiswa) {
return;
}

        router.delete(guruBkRoutes.siswa.akun.destroy(hapusAkunSiswa.id), {
            preserveScroll: true,
            onSuccess: () => {
                setHapusAkunDialogOpen(false);
                setHapusAkunSiswa(null);
            },
        });
    };

    return (
        <>
            <Head title="Kelola Siswa" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kelola Siswa</h1>
                        <p className="text-muted-foreground">Kelola data siswa sekolah</p>
                    </div>
                    <Button onClick={() => router.get(guruBkRoutes.siswa.create)}>
                        <Plus className="size-4" />
                        Tambah Siswa
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="size-5" />
                            Daftar Siswa
                        </CardTitle>
                        <CardDescription>
                            Total {siswa.total} siswa terdaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex gap-2">
                            <Input
                                placeholder="Cari nama atau NIS..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="max-w-sm"
                            />
                            <Button variant="outline" onClick={handleSearch}>
                                <Search className="size-4" />
                            </Button>
                        </div>

                        {siswa.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Users className="size-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-semibold">Belum ada siswa</h3>
                                <p className="text-muted-foreground text-sm">
                                    Mulai dengan menambahkan siswa baru
                                </p>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>NIS</TableHead>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>JK</TableHead>
                                            <TableHead>Kelas</TableHead>
                                            <TableHead>Akun</TableHead>
                                            <TableHead className="w-[100px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {siswa.data.map((s) => (
                                            <TableRow key={s.id}>
                                                <TableCell className="font-mono text-sm">{s.nis}</TableCell>
                                                <TableCell className="font-medium">{s.nama}</TableCell>
                                                <TableCell>
                                                    <Badge variant={s.jenkel === 'L' ? 'default' : 'secondary'}>
                                                        {s.jenkel === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{getKelasInfo(s)}</TableCell>
                                                <TableCell>
                                                    {s.user ? (
                                                        <Badge variant="outline" className="font-mono text-xs">
                                                            {s.user.username}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">Belum ada</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => router.get(guruBkRoutes.siswa.show(s.id))}>
                                                                <Eye className="size-4" />
                                                                Detail
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => router.get(guruBkRoutes.siswa.edit(s.id))}>
                                                                <Pencil className="size-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            {s.user ? (
                                                                <>
                                                                    <DropdownMenuItem onClick={() => openAkunDialog(s, 'reset')}>
                                                                        <KeyRound className="size-4" />
                                                                        Reset Password
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setHapusAkunSiswa(s);
                                                                            setHapusAkunDialogOpen(true);
                                                                        }}
                                                                        className="text-destructive focus:text-destructive"
                                                                    >
                                                                        <UserX className="size-4" />
                                                                        Hapus Akun
                                                                    </DropdownMenuItem>
                                                                </>
                                                            ) : (
                                                                <DropdownMenuItem onClick={() => openAkunDialog(s, 'buat')}>
                                                                    <UserPlus className="size-4" />
                                                                    Buat Akun
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem
                                                                onClick={() => openDeleteDialog(s)}
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

                                {siswa.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-muted-foreground text-sm">
                                            Menampilkan {((siswa.current_page - 1) * siswa.per_page) + 1} - {Math.min(siswa.current_page * siswa.per_page, siswa.total)} dari {siswa.total} siswa
                                        </p>
                                        <div className="flex gap-1">
                                            {siswa.links.map((link, i) => (
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
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Siswa</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus siswa <strong>{deletingSiswa?.nama}</strong> ({deletingSiswa?.nis})?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
 setDeleteDialogOpen(false); setDeletingSiswa(null); 
}}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                            {processing ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={akunDialogOpen} onOpenChange={(open) => !open && closeAkunDialog()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {akunMode === 'buat' ? 'Buat Akun Login' : 'Reset Password'}
                        </DialogTitle>
                        <DialogDescription>
                            {akunMode === 'buat'
                                ? <>Buat akun agar <strong>{akunSiswa?.nama}</strong> bisa login sendiri untuk mengajukan konseling.</>
                                : <>Atur ulang password akun <strong>{akunSiswa?.user?.username}</strong> milik {akunSiswa?.nama}.</>}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        {akunMode === 'buat' && (
                            <div className="grid gap-2">
                                <Label htmlFor="akun-username">Username</Label>
                                <Input
                                    id="akun-username"
                                    value={akunForm.data.username}
                                    onChange={(e) => akunForm.setData('username', e.target.value)}
                                    placeholder="Contoh: NIS siswa"
                                    autoComplete="off"
                                />
                                <p className="text-muted-foreground text-xs">
                                    Default memakai NIS. Username otomatis disimpan huruf kecil.
                                </p>
                                {akunForm.errors.username && (
                                    <p className="text-destructive text-sm">{akunForm.errors.username}</p>
                                )}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="akun-password">Password</Label>
                            <Input
                                id="akun-password"
                                value={akunForm.data.password}
                                onChange={(e) => akunForm.setData('password', e.target.value)}
                                placeholder="Minimal 6 karakter"
                                autoComplete="off"
                            />
                            <p className="text-muted-foreground text-xs">
                                Catat dan berikan ke siswa. Siswa bisa menggantinya di menu Keamanan.
                            </p>
                            {akunForm.errors.password && (
                                <p className="text-destructive text-sm">{akunForm.errors.password}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={closeAkunDialog}>
                            Batal
                        </Button>
                        <Button onClick={handleAkunSubmit} disabled={akunForm.processing}>
                            {akunForm.processing
                                ? 'Menyimpan...'
                                : akunMode === 'buat' ? 'Buat Akun' : 'Simpan Password'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={hapusAkunDialogOpen} onOpenChange={setHapusAkunDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Akun Login</DialogTitle>
                        <DialogDescription>
                            Hapus akun <strong>{hapusAkunSiswa?.user?.username}</strong> milik {hapusAkunSiswa?.nama}?
                            Siswa tidak bisa login lagi, tetapi data siswa dan riwayat konselingnya tetap tersimpan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
 setHapusAkunDialogOpen(false); setHapusAkunSiswa(null);
}}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleHapusAkun}>
                            Hapus Akun
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

SiswaIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Siswa', href: '/guru-bk/siswa' },
    ],
};
