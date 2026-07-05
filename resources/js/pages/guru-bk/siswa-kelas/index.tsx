import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Trash2, MoreHorizontal, Users, ArrowUpRight, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SiswaData { id: number; nis: string; nama: string; }
interface KelasData { id: number; nama: string; }
interface SiswaKelasData {
    id: number;
    siswa_id: number;
    kelas_id: number;
    tahun_ajaran: string;
    status: string;
    siswa: SiswaData;
    kelas: KelasData;
}

interface Props {
    siswaKelas: SiswaKelasData[];
    kelasList: KelasData[];
    tahunAjaranList: string[];
    filters: { tahun_ajaran: string; kelas_id: number | null };
}

const STATUS_OPTIONS = [
    { value: 'aktif', label: 'Aktif', variant: 'default' as const },
    { value: 'lulus', label: 'Lulus', variant: 'secondary' as const },
    { value: 'pindah_sekolah', label: 'Pindah Sekolah', variant: 'outline' as const },
    { value: 'keluar', label: 'Keluar', variant: 'destructive' as const },
];

export default function SiswaKelasIndex({ siswaKelas, kelasList, tahunAjaranList, filters }: Props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState<SiswaKelasData | null>(null);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [editingStatus, setEditingStatus] = useState<SiswaKelasData | null>(null);

    const { processing } = useForm();

    const handleFilter = (key: string, value: string) => {
        const params: Record<string, string> = {
            tahun_ajaran: filters.tahun_ajaran,
            kelas_id: filters.kelas_id ? String(filters.kelas_id) : '',
        };
        params[key] = value === 'all' ? '' : value;
        router.get('/guru-bk/siswa-kelas', params, { preserveState: true });
    };

    const handleUpdateStatus = (status: string) => {
        if (!editingStatus) return;
        router.put(`/guru-bk/siswa-kelas/${editingStatus.id}`, { status }, {
            onSuccess: () => { setStatusDialogOpen(false); setEditingStatus(null); },
        });
    };

    const handleDelete = () => {
        if (!deleting) return;
        router.delete(`/guru-bk/siswa-kelas/${deleting.id}`, {
            onSuccess: () => { setDeleteDialogOpen(false); setDeleting(null); },
        });
    };

    const grouped: Record<string, SiswaKelasData[]> = {};
    siswaKelas.forEach((sk) => {
        const key = sk.kelas.nama;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(sk);
    });

    return (
        <>
            <Head title="Kelola Siswa-Kelas" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Siswa-Kelas</h1>
                        <p className="text-muted-foreground">Atur kelas siswa dan kenaikan kelas</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.get('/guru-bk/siswa-kelas/naik-kelas')}>
                            <ArrowUpRight className="size-4" />
                            Naik Kelas
                        </Button>
                        <Button onClick={() => router.get('/guru-bk/siswa-kelas/assign')}>
                            <UserPlus className="size-4" />
                            Assign Siswa
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="size-5" />
                            Data Siswa per Kelas
                        </CardTitle>
                        <CardDescription>
                            Total {siswaKelas.length} siswa terdaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                            <Select value={filters.tahun_ajaran || 'all'} onValueChange={(v) => handleFilter('tahun_ajaran', v)}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Tahun Ajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tahun</SelectItem>
                                    {tahunAjaranList.map((ta) => (
                                        <SelectItem key={ta} value={ta}>{ta}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filters.kelas_id ? String(filters.kelas_id) : 'all'} onValueChange={(v) => handleFilter('kelas_id', v)}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kelas</SelectItem>
                                    {kelasList.map((k) => (
                                        <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {siswaKelas.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Users className="size-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-semibold">Belum ada data</h3>
                                <p className="text-muted-foreground text-sm">
                                    Mulai dengan menambahkan siswa ke kelas
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(grouped).map(([kelasNama, items]) => (
                                    <div key={kelasNama}>
                                        <h3 className="mb-2 font-semibold text-lg flex items-center gap-2">
                                            {kelasNama}
                                            <Badge variant="secondary">{items.length} siswa</Badge>
                                        </h3>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>NIS</TableHead>
                                                    <TableHead>Nama</TableHead>
                                                    <TableHead>Tahun Ajaran</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="w-[80px]">Aksi</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {items.map((sk) => (
                                                    <TableRow key={sk.id}>
                                                        <TableCell className="font-mono text-sm">{sk.siswa.nis}</TableCell>
                                                        <TableCell className="font-medium">{sk.siswa.nama}</TableCell>
                                                        <TableCell>{sk.tahun_ajaran}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={STATUS_OPTIONS.find((s) => s.value === sk.status)?.variant || 'default'}>
                                                                {STATUS_OPTIONS.find((s) => s.value === sk.status)?.label || sk.status}
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
                                                                    <DropdownMenuItem onClick={() => { setEditingStatus(sk); setStatusDialogOpen(true); }}>
                                                                        Ubah Status
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => { setDeleting(sk); setDeleteDialogOpen(true); }}
                                                                        className="text-destructive focus:text-destructive"
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                        Keluarkan
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ubah Status</DialogTitle>
                        <DialogDescription>
                            Ubah status <strong>{editingStatus?.siswa.nama}</strong> di kelas {editingStatus?.kelas.nama}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-2">
                        {STATUS_OPTIONS.map((opt) => (
                            <Button
                                key={opt.value}
                                variant={editingStatus?.status === opt.value ? 'default' : 'outline'}
                                onClick={() => handleUpdateStatus(opt.value)}
                                disabled={processing}
                            >
                                {opt.label}
                            </Button>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setStatusDialogOpen(false); setEditingStatus(null); }}>
                            Batal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Keluarkan dari Kelas</DialogTitle>
                        <DialogDescription>
                            Keluarkan <strong>{deleting?.siswa.nama}</strong> dari kelas {deleting?.kelas.nama}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setDeleting(null); }}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                            {processing ? 'Menghapus...' : 'Keluarkan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

SiswaKelasIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Siswa-Kelas', href: '/guru-bk/siswa-kelas' },
    ],
};
