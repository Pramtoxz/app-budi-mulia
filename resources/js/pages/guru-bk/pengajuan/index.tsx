import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, ScrollText, Search, CheckCircle, XCircle, XOctagon, MoreHorizontal, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SiswaData { id: number; nis: string; nama: string; }
interface JadwalData { id: number; hari: string; jam_mulai: string; jam_selesai: string; guru_bk: { id: number; name: string }; }
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
    jadwal: JadwalData;
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
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedPengajuan, setSelectedPengajuan] = useState<PengajuanData | null>(null);
    const [alasan, setAlasan] = useState('');

    const handleSearch = () => {
        router.get('/guru-bk/pengajuan', { search, status: filters.status || '' }, { preserveState: true });
    };

    const handleFilter = (status: string) => {
        router.get('/guru-bk/pengajuan', { search, status: status === 'all' ? '' : status }, { preserveState: true });
    };

    const handleApprove = (p: PengajuanData) => {
        router.post(`/guru-bk/pengajuan/${p.id}/approve`);
    };

    const handleReject = () => {
        if (!selectedPengajuan || !alasan.trim()) return;
        router.post(`/guru-bk/pengajuan/${selectedPengajuan.id}/reject`, { alasan_penolakan: alasan }, {
            onSuccess: () => { setRejectDialogOpen(false); setSelectedPengajuan(null); setAlasan(''); },
        });
    };

    const handleCancel = () => {
        if (!selectedPengajuan || !alasan.trim()) return;
        router.post(`/guru-bk/pengajuan/${selectedPengajuan.id}/cancel`, { alasan_penolakan: alasan }, {
            onSuccess: () => { setCancelDialogOpen(false); setSelectedPengajuan(null); setAlasan(''); },
        });
    };

    const formatTime = (t: string) => t?.substring(0, 5) || t;

    return (
        <>
            <Head title="Kelola Pengajuan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pengajuan Konseling</h1>
                        <p className="text-muted-foreground">Kelola pengajuan konseling siswa</p>
                    </div>
                    <Button onClick={() => router.get('/guru-bk/pengajuan/create')}>
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
                                            <TableHead>Jadwal</TableHead>
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
                                                    <div className="text-sm">
                                                        <p>{p.jadwal.hari}</p>
                                                        <p className="text-muted-foreground">{formatTime(p.jadwal.jam_mulai)} - {formatTime(p.jadwal.jam_selesai)}</p>
                                                    </div>
                                                </TableCell>
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
                                                            {p.status === 'menunggu' && (
                                                                <>
                                                                    <DropdownMenuItem onClick={() => handleApprove(p)}>
                                                                        <CheckCircle className="size-4" />
                                                                        Setujui
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => { setSelectedPengajuan(p); setAlasan(''); setRejectDialogOpen(true); }} className="text-destructive focus:text-destructive">
                                                                        <XCircle className="size-4" />
                                                                        Tolak
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                            {p.status === 'disetujui' && (
                                                                <DropdownMenuItem onClick={() => { setSelectedPengajuan(p); setAlasan(''); setCancelDialogOpen(true); }} className="text-destructive focus:text-destructive">
                                                                    <XOctagon className="size-4" />
                                                                    Batalkan
                                                                </DropdownMenuItem>
                                                            )}
                                                            {p.alasan_penolakan && (
                                                                <DropdownMenuItem disabled>
                                                                    Alasan: {p.alasan_penolakan}
                                                                </DropdownMenuItem>
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
                                            Halaman {pengajuan.current_page} dari {pengajuan.last_page}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Pengajuan</DialogTitle>
                        <DialogDescription>
                            Tolak pengajuan dari <strong>{selectedPengajuan?.siswa.nama}</strong>. Berikan alasan penolakan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label>Alasan Penolakan *</Label>
                        <Textarea value={alasan} onChange={(e) => setAlasan(e.target.value)} placeholder="Alasan penolakan..." rows={3} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setRejectDialogOpen(false); setSelectedPengajuan(null); }}>Batal</Button>
                        <Button variant="destructive" onClick={handleReject} disabled={!alasan.trim()}>Tolak</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Batalkan Pengajuan</DialogTitle>
                        <DialogDescription>
                            Batalkan pengajuan dari <strong>{selectedPengajuan?.siswa.nama}</strong>. Berikan alasan pembatalan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label>Alasan Pembatalan *</Label>
                        <Textarea value={alasan} onChange={(e) => setAlasan(e.target.value)} placeholder="Alasan pembatalan..." rows={3} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setCancelDialogOpen(false); setSelectedPengajuan(null); }}>Batal</Button>
                        <Button variant="destructive" onClick={handleCancel} disabled={!alasan.trim()}>Batalkan Pengajuan</Button>
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
