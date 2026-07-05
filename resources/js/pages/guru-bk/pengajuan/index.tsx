import { Head, router, Link } from '@inertiajs/react';
import { Plus, ScrollText, Search, MoreHorizontal, Eye, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { guruBkRoutes } from '@/lib/routes';

interface SiswaData { id: number; nis: string; nama: string; }
interface KategoriData { id: number; nama: string; }
interface KonselingData { id: number; status: string; }
interface PengajuanData {
    id: number;
    tgl_pengajuan: string;
    status: string;
    catatan: string | null;
    alasan_penolakan: string | null;
    diajukan_oleh: string;
    siswa: SiswaData;
    kategori: KategoriData;
    konseling: KonselingData | null;
}

interface PaginatedPengajuan {
    data: PengajuanData[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    pengajuan: PaginatedPengajuan;
    filters: { status?: string; search?: string };
}

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    menunggu: { label: 'Menunggu', variant: 'secondary' },
    disetujui: { label: 'Disetujui', variant: 'default' },
    ditolak: { label: 'Ditolak', variant: 'destructive' },
    dibatalkan: { label: 'Dibatalkan', variant: 'outline' },
};

export default function PengajuanIndex({ pengajuan, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState<PengajuanData | null>(null);

    const handleSearch = () => {
        router.get(guruBkRoutes.pengajuan.index, { search, status: filters.status || '' }, { preserveState: true });
    };

    const handleFilter = (status: string) => {
        router.get(guruBkRoutes.pengajuan.index, { search, status: status === 'all' ? '' : status }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!deleting) {
return;
}

        router.delete(guruBkRoutes.pengajuan.destroy(deleting.id), {
            onSuccess: () => {
 setDeleteDialogOpen(false); setDeleting(null); 
},
        });
    };

    return (
        <>
            <Head title="Kelola Pengajuan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pengajuan Konseling</h1>
                        <p className="text-muted-foreground">Kelola pengajuan konseling siswa</p>
                    </div>
                    <Button onClick={() => router.get(guruBkRoutes.pengajuan.create)}>
                        <Plus className="size-4" />
                        Buat untuk Siswa
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ScrollText className="size-5" />
                            Daftar Pengajuan
                        </CardTitle>
                        <CardDescription>Total {pengajuan.total} pengajuan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                            <Input
                                placeholder="Cari nama atau NIS siswa..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="max-w-sm"
                            />
                            <Button variant="outline" onClick={handleSearch}>
                                <Search className="size-4" />
                            </Button>
                            <Select value={filters.status || 'all'} onValueChange={handleFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="menunggu">Menunggu</SelectItem>
                                    <SelectItem value="disetujui">Disetujui</SelectItem>
                                    <SelectItem value="ditolak">Ditolak</SelectItem>
                                    <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {pengajuan.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <ScrollText className="size-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-semibold">Belum ada pengajuan</h3>
                                <p className="text-muted-foreground text-sm">Pengajuan konseling akan muncul di sini</p>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Siswa</TableHead>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead>Diajukan Oleh</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-[80px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pengajuan.data.map((p) => (
                                            <TableRow key={p.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{p.siswa.nama}</p>
                                                        <p className="text-muted-foreground text-xs">{p.siswa.nis}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{p.kategori.nama}</TableCell>
                                                <TableCell>
                                                    <Badge variant={p.diajukan_oleh === 'siswa' ? 'default' : 'secondary'}>
                                                        {p.diajukan_oleh === 'siswa' ? 'Siswa' : 'Guru BK'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={STATUS_MAP[p.status]?.variant || 'default'}>
                                                        {STATUS_MAP[p.status]?.label || p.status}
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
                                                            <DropdownMenuItem asChild>
                                                                <Link href={guruBkRoutes.pengajuan.show(p.id)}>
                                                                    <Eye className="size-4" />
                                                                    Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {p.status === 'menunggu' && (
                                                                <>
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={guruBkRoutes.pengajuan.edit(p.id)}>
                                                                            <Pencil className="size-4" />
                                                                            Edit
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
 setDeleting(p); setDeleteDialogOpen(true); 
}}
                                                                        className="text-destructive focus:text-destructive"
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                        Hapus
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {pengajuan.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-muted-foreground text-sm">
                                            Menampilkan {((pengajuan.current_page - 1) * pengajuan.per_page) + 1} - {Math.min(pengajuan.current_page * pengajuan.per_page, pengajuan.total)} dari {pengajuan.total} pengajuan
                                        </p>
                                        <div className="flex gap-1">
                                            {pengajuan.links.map((link, i) => (
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
                        <DialogTitle>Hapus Pengajuan</DialogTitle>
                        <DialogDescription>
                            Hapus pengajuan dari <strong>{deleting?.siswa.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
 setDeleteDialogOpen(false); setDeleting(null); 
}}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PengajuanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengajuan', href: '/guru-bk/pengajuan' },
    ],
};
