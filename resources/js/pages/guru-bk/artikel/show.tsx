import { Head, router } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Pencil } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { guruBkRoutes } from '@/lib/routes';

interface AuthorData { id: number; name: string; }
interface ArtikelData {
    id: number;
    judul: string;
    slug: string;
    isi: string;
    gambar: string | null;
    status: string;
    published_at: string | null;
    created_at: string;
    author: AuthorData;
}

interface Props {
    artikel: ArtikelData;
}

export default function ArtikelShow({ artikel }: Props) {
    return (
        <>
            <Head title={artikel.judul} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get(guruBkRoutes.artikel.index)}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">Detail Artikel</h1>
                        <p className="text-muted-foreground">/{artikel.slug}</p>
                    </div>
                    <Badge variant={artikel.status === 'published' ? 'default' : 'secondary'}>
                        {artikel.status === 'published' ? 'Dipublikasi' : 'Draft'}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => router.get(guruBkRoutes.artikel.edit(artikel.id))}>
                        <Pencil className="size-4" />
                        Edit
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="size-5" />
                            {artikel.judul}
                        </CardTitle>
                        <CardDescription>
                            Oleh {artikel.author.name} — {artikel.published_at || artikel.created_at}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {artikel.gambar && (
                            <div>
                                <img src={`/storage/${artikel.gambar}`} alt={artikel.judul} className="max-w-full rounded-lg" />
                                <Separator className="my-4" />
                            </div>
                        )}
                        <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                            {artikel.isi}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-start">
                    <Button variant="outline" onClick={() => router.get(guruBkRoutes.artikel.index)}>Kembali</Button>
                </div>
            </div>
        </>
    );
}

ArtikelShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Artikel', href: '/guru-bk/artikel' },
        { title: 'Detail', href: '#' },
    ],
};
