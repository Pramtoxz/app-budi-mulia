import { Head, router, Link } from '@inertiajs/react';
import { Plus, Newspaper, Search, MoreHorizontal, Eye, Trash2, Pencil } from 'lucide-react';
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

interface AuthorData { id: number; name: string; }
interface PengumumanData {
    id: number;
    judul: string;
    slug: string;
    prioritas: string;
    status: string;
    published_at: string | null;
    tgl_berlaku: string | null;
    created_at: string;
    author: AuthorData;
}

interface PaginatedPengumuman {
    data: PengumumanData[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    pengumuman: PaginatedPengumuman;
    filters: { search?: string; status?: string };
}

const PRIORITAS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    rendah: { label: 'Rendah', variant: 'secondary' },
    sedang: { label: 'Sedang', variant: 'default' },
    tinggi: { label: 'Tinggi', variant: 'destructive' },
};

export default function PengumumanIndex({ pengumuman, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState<PengumumanData | null>(null);

    const handleSearch = () => {
        router.get(guruBkRoutes.pengumuman.index, { search, status: filters.status || '' }, { preserveState: true });
    };

    const handleFilter = (status: string) => {
        router.get(guruBkRoutes.pengumuman.index, { search, status: status === 'all' ? '' : status }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!deleting) {
return;
}

        router.delete(guruBkRoutes.pengumuman.destroy(deleting.id), {
            onSuccess: () => {
 setDeleteDialogOpen(false); setDeleting(null); 
},
        });
    };

    return (
        <>
            <Head title="Kelola Pengumuman" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pengumuman</h1>
                        <p className="text-muted-foreground">Kelola pengumuman untuk siswa</p>
                    </div>
                    <Button onClick={() => router.get(guruBkRoutes.pengumuman.create)}>
                        <Plus className="size-4" />
                        Buat Pengumuman
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Newspaper className="size-5" />
                            Daftar Pengumuman
                        </CardTitle>
                        <CardDescription>Total {pengumuman.total} pengumuman</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                            <Input
                                placeholder="Cari judul pengumuman..."
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
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Dipublikasi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {pengumuman.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Newspaper className="size-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-semibold">Belum ada pengumuman</h3>
                                <p className="text-muted-foreground text-sm">Buat pengumuman pertama untuk siswa</p>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Judul</TableHead>
                                            <TableHead>Prioritas</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead className="w-[80px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pengumuman.data.map((p) => (
                                            <TableRow key={p.id}>
                                                <TableCell>
                                                    <p className="font-medium">{p.judul}</p>
                                                    <p className="text-muted-foreground text-xs">/{p.slug}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={PRIORITAS_MAP[p.prioritas]?.variant || 'default'}>
                                                        {PRIORITAS_MAP[p.prioritas]?.label || p.prioritas}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={p.status === 'published' ? 'default' : 'secondary'}>
                                                        {p.status === 'published' ? 'Dipublikasi' : 'Draft'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {p.published_at || p.created_at}
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
                                                                <Link href={guruBkRoutes.pengumuman.show(p.id)}>
                                                                    <Eye className="size-4" />
                                                                    Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={guruBkRoutes.pengumuman.edit(p.id)}>
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
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {pengumuman.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-muted-foreground text-sm">
                                            Menampilkan {((pengumuman.current_page - 1) * pengumuman.per_page) + 1} - {Math.min(pengumuman.current_page * pengumuman.per_page, pengumuman.total)} dari {pengumuman.total} pengumuman
                                        </p>
                                        <div className="flex gap-1">
                                            {pengumuman.links.map((link, i) => (
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
                        <DialogTitle>Hapus Pengumuman</DialogTitle>
                        <DialogDescription>
                            Hapus pengumuman <strong>{deleting?.judul}</strong>? Tindakan ini tidak dapat dibatalkan.
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

PengumumanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengumuman', href: '/guru-bk/pengumuman' },
    ],
};
