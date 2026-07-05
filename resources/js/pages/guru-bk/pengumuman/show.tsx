import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Newspaper, Pencil } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { guruBkRoutes } from '@/lib/routes';

interface AuthorData { id: number; name: string; }
interface PengumumanData {
    id: number;
    judul: string;
    slug: string;
    isi: string;
    prioritas: string;
    status: string;
    published_at: string | null;
    tgl_berlaku: string | null;
    created_at: string;
    author: AuthorData;
}

interface Props {
    pengumuman: PengumumanData;
}

const PRIORITAS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    rendah: { label: 'Rendah', variant: 'secondary' },
    sedang: { label: 'Sedang', variant: 'default' },
    tinggi: { label: 'Tinggi', variant: 'destructive' },
};

export default function PengumumanShow({ pengumuman }: Props) {
    return (
        <>
            <Head title={pengumuman.judul} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get(guruBkRoutes.pengumuman.index)}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">Detail Pengumuman</h1>
                        <p className="text-muted-foreground">/{pengumuman.slug}</p>
                    </div>
                    <Badge variant={PRIORITAS_MAP[pengumuman.prioritas]?.variant || 'default'}>
                        {PRIORITAS_MAP[pengumuman.prioritas]?.label || pengumuman.prioritas}
                    </Badge>
                    <Badge variant={pengumuman.status === 'published' ? 'default' : 'secondary'}>
                        {pengumuman.status === 'published' ? 'Dipublikasi' : 'Draft'}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => router.get(guruBkRoutes.pengumuman.edit(pengumuman.id))}>
                        <Pencil className="size-4" />
                        Edit
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Newspaper className="size-5" />
                            {pengumuman.judul}
                        </CardTitle>
                        <CardDescription>
                            Oleh {pengumuman.author.name} — {pengumuman.published_at || pengumuman.created_at}
                            {pengumuman.tgl_berlaku && <> | Berlaku: {pengumuman.tgl_berlaku}</>}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="whitespace-pre-wrap">{pengumuman.isi}</div>
                    </CardContent>
                </Card>

                <div className="flex justify-start">
                    <Button variant="outline" onClick={() => router.get(guruBkRoutes.pengumuman.index)}>Kembali</Button>
                </div>
            </div>
        </>
    );
}

PengumumanShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengumuman', href: '/guru-bk/pengumuman' },
        { title: 'Detail', href: '#' },
    ],
};
