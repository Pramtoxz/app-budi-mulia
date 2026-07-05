import { Head, router, Link } from '@inertiajs/react';
import { Plus, BookOpen, Search, MoreHorizontal, Eye, Trash2, Pencil } from 'lucide-react';
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
interface ArtikelData {
    id: number;
    judul: string;
    slug: string;
    status: string;
    published_at: string | null;
    created_at: string;
    author: AuthorData;
}

interface PaginatedArtikel {
    data: ArtikelData[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    artikel: PaginatedArtikel;
    filters: { search?: string; status?: string };
}

export default function ArtikelIndex({ artikel, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState<ArtikelData | null>(null);

    const handleSearch = () => {
        router.get(guruBkRoutes.artikel.index, { search, status: filters.status || '' }, { preserveState: true });
    };

    const handleFilter = (status: string) => {
        router.get(guruBkRoutes.artikel.index, { search, status: status === 'all' ? '' : status }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!deleting) {
return;
}

        router.delete(guruBkRoutes.artikel.destroy(deleting.id), {
            onSuccess: () => {
 setDeleteDialogOpen(false); setDeleting(null); 
},
        });
    };

    return (
        <>
            <Head title="Kelola Artikel" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Artikel</h1>
                        <p className="text-muted-foreground">Kelola artikel untuk siswa</p>
                    </div>
                    <Button onClick={() => router.get(guruBkRoutes.artikel.create)}>
                        <Plus className="size-4" />
                        Buat Artikel
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="size-5" />
                            Daftar Artikel
                        </CardTitle>
                        <CardDescription>Total {artikel.total} artikel</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                            <Input
                                placeholder="Cari judul artikel..."
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

                        {artikel.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <BookOpen className="size-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-semibold">Belum ada artikel</h3>
                                <p className="text-muted-foreground text-sm">Buat artikel pertama untuk siswa</p>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Judul</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead className="w-[80px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {artikel.data.map((a) => (
                                            <TableRow key={a.id}>
                                                <TableCell>
                                                    <p className="font-medium">{a.judul}</p>
                                                    <p className="text-muted-foreground text-xs">/{a.slug}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={a.status === 'published' ? 'default' : 'secondary'}>
                                                        {a.status === 'published' ? 'Dipublikasi' : 'Draft'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {a.published_at || a.created_at}
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
                                                                <Link href={guruBkRoutes.artikel.show(a.id)}>
                                                                    <Eye className="size-4" />
                                                                    Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={guruBkRoutes.artikel.edit(a.id)}>
                                                                    <Pencil className="size-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => {
 setDeleting(a); setDeleteDialogOpen(true); 
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

                                {artikel.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-muted-foreground text-sm">
                                            Menampilkan {((artikel.current_page - 1) * artikel.per_page) + 1} - {Math.min(artikel.current_page * artikel.per_page, artikel.total)} dari {artikel.total} artikel
                                        </p>
                                        <div className="flex gap-1">
                                            {artikel.links.map((link, i) => (
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
                        <DialogTitle>Hapus Artikel</DialogTitle>
                        <DialogDescription>
                            Hapus artikel <strong>{deleting?.judul}</strong>? Tindakan ini tidak dapat dibatalkan.
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

ArtikelIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Artikel', href: '/guru-bk/artikel' },
    ],
};
