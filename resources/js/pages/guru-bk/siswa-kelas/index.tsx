import { Head, router, useForm } from '@inertiajs/react';
import { Trash2, MoreHorizontal, Users, ArrowUpRight, GraduationCap } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { guruBkRoutes } from '@/lib/routes';

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

interface PaginatedSiswaKelas {
    data: SiswaKelasData[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    siswaKelas: PaginatedSiswaKelas | null;
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
        params[key] = value;
        router.get(guruBkRoutes.siswaKelas.index, params, { preserveState: true });
    };

    const handleUpdateStatus = (status: string) => {
        if (!editingStatus) {
return;
}

        router.put(guruBkRoutes.siswaKelas.update(editingStatus.id), { status }, {
            onSuccess: () => {
 setStatusDialogOpen(false); setEditingStatus(null); 
},
        });
    };

    const handleDelete = () => {
        if (!deleting) {
return;
}

        router.delete(guruBkRoutes.siswaKelas.destroy(deleting.id), {
            onSuccess: () => {
 setDeleteDialogOpen(false); setDeleting(null); 
},
        });
    };

    const hasData = siswaKelas && filters.kelas_id;

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
                        <Button variant="outline" onClick={() => router.get(guruBkRoutes.siswaKelas.naikKelas)}>
                            <ArrowUpRight className="size-4" />
                            Naik Kelas
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
                            Pilih kelas untuk melihat data siswa
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                            <Select value={filters.kelas_id ? String(filters.kelas_id) : ''} onValueChange={(v) => handleFilter('kelas_id', v)}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Pilih Kelas *" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kelasList.map((k) => (
                                        <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                        </div>

                        {!hasData ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <GraduationCap className="size-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-semibold">Pilih Kelas</h3>
                                <p className="text-muted-foreground text-sm">
                                    Pilih kelas di atas untuk melihat data siswa
                                </p>
                            </div>
                        ) : siswaKelas!.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Users className="size-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-semibold">Belum ada siswa</h3>
                                <p className="text-muted-foreground text-sm">
                                    Kelas ini belum memiliki siswa. Tambahkan siswa melalui menu Siswa.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-2 flex items-center gap-2">
                                    <Badge variant="secondary">{siswaKelas!.total} siswa</Badge>
                                </div>
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
                                        {siswaKelas!.data.map((sk) => (
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
                                                            <DropdownMenuItem onClick={() => {
 setEditingStatus(sk); setStatusDialogOpen(true); 
}}>
                                                                Ubah Status
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => {
 setDeleting(sk); setDeleteDialogOpen(true); 
}}
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

                                {siswaKelas!.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-muted-foreground text-sm">
                                            Menampilkan {((siswaKelas!.current_page - 1) * siswaKelas!.per_page) + 1} - {Math.min(siswaKelas!.current_page * siswaKelas!.per_page, siswaKelas!.total)} dari {siswaKelas!.total} data
                                        </p>
                                        <div className="flex gap-1">
                                            {siswaKelas!.links.map((link, i) => (
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
                        <Button variant="outline" onClick={() => {
 setStatusDialogOpen(false); setEditingStatus(null); 
}}>
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
                        <Button variant="outline" onClick={() => {
 setDeleteDialogOpen(false); setDeleting(null); 
}}>Batal</Button>
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
