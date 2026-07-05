import { Head, router, Link } from '@inertiajs/react';
import { MessageSquare, Search, MoreHorizontal, Eye, FileText } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { guruBkRoutes } from '@/lib/routes';

interface SiswaData { id: number; nis: string; nama: string; }
interface KategoriData { id: number; nama: string; }
interface PengajuanData { id: number; siswa: SiswaData; kategori: KategoriData; }
interface HasilData { id: number; }
interface KonselingData {
    id: number;
    tgl_konseling: string | null;
    jam_konseling: string | null;
    status: string;
    keterangan: string | null;
    pengajuan: PengajuanData;
    hasil: HasilData | null;
}

interface PaginatedKonseling {
    data: KonselingData[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    konseling: PaginatedKonseling;
    filters: { status?: string; search?: string };
}

export default function KonselingIndex({ konseling, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get(guruBkRoutes.konseling.index, { search, status: filters.status || '' }, { preserveState: true });
    };

    const handleFilter = (status: string) => {
        router.get(guruBkRoutes.konseling.index, { search, status: status === 'all' ? '' : status }, { preserveState: true });
    };

    const formatTime = (t: string | null) => t?.substring(0, 5) || t;

    return (
        <>
            <Head title="Konseling" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Konseling</h1>
                    <p className="text-muted-foreground">Kelola sesi konseling dan input hasil</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="size-5" />
                            Daftar Konseling
                        </CardTitle>
                        <CardDescription>Total {konseling.total} sesi konseling</CardDescription>
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
                                    <SelectItem value="dijadwalkan">Dijadwalkan</SelectItem>
                                    <SelectItem value="selesai">Selesai</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {konseling.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <MessageSquare className="size-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-semibold">Belum ada konseling</h3>
                                <p className="text-muted-foreground text-sm">Sesi konseling akan muncul di sini setelah pengajuan disetujui</p>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Siswa</TableHead>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Hasil</TableHead>
                                            <TableHead className="w-[80px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {konseling.data.map((k) => (
                                            <TableRow key={k.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{k.pengajuan.siswa.nama}</p>
                                                        <p className="text-muted-foreground text-xs">{k.pengajuan.siswa.nis}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{k.pengajuan.kategori.nama}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="text-sm">{k.tgl_konseling || '-'}</p>
                                                        <p className="text-muted-foreground text-xs">{formatTime(k.jam_konseling) || '-'}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={k.status === 'selesai' ? 'default' : 'secondary'}>
                                                        {k.status === 'selesai' ? 'Selesai' : 'Dijadwalkan'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {k.hasil ? (
                                                        <Badge variant="default">Ada</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Belum</Badge>
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
                                                            <DropdownMenuItem asChild>
                                                                <Link href={guruBkRoutes.konseling.show(k.id)}>
                                                                    <Eye className="size-4" />
                                                                    Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {!k.hasil && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={guruBkRoutes.konseling.show(k.id)}>
                                                                        <FileText className="size-4" />
                                                                        Input Hasil
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {konseling.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-muted-foreground text-sm">
                                            Menampilkan {((konseling.current_page - 1) * konseling.per_page) + 1} - {Math.min(konseling.current_page * konseling.per_page, konseling.total)} dari {konseling.total} konseling
                                        </p>
                                        <div className="flex gap-1">
                                            {konseling.links.map((link, i) => (
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
        </>
    );
}

KonselingIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Konseling', href: '/guru-bk/konseling' },
    ],
};
