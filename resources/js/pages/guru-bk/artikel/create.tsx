import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { guruBkRoutes } from '@/lib/routes';

export default function ArtikelCreate() {
    const form = useForm({
        judul: '',
        isi: '',
        gambar: null as File | null,
        status: 'draft',
    });
    const fileRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        form.post(guruBkRoutes.artikel.store);
    };

    return (
        <>
            <Head title="Buat Artikel" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get(guruBkRoutes.artikel.index)}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Buat Artikel</h1>
                        <p className="text-muted-foreground">Tulis artikel baru untuk siswa</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Artikel</CardTitle>
                        <CardDescription>Isi data artikel</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="judul">Judul *</Label>
                            <Input
                                id="judul"
                                value={form.data.judul}
                                onChange={(e) => form.setData('judul', e.target.value)}
                                placeholder="Judul artikel"
                            />
                            {form.errors.judul && <p className="text-destructive text-sm">{form.errors.judul}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="isi">Isi Artikel *</Label>
                            <Textarea
                                id="isi"
                                value={form.data.isi}
                                onChange={(e) => form.setData('isi', e.target.value)}
                                placeholder="Tulis isi artikel..."
                                rows={10}
                            />
                            {form.errors.isi && <p className="text-destructive text-sm">{form.errors.isi}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Gambar (opsional)</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => form.setData('gambar', e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                                <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                                    <Upload className="size-4" />
                                    Pilih Gambar
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {form.data.gambar ? form.data.gambar.name : 'Belum ada file'}
                                </span>
                            </div>
                            {form.errors.gambar && <p className="text-destructive text-sm">{form.errors.gambar}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Status *</Label>
                            <Select value={form.data.status} onValueChange={(v) => form.setData('status', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Publikasikan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => router.get(guruBkRoutes.artikel.index)}>Batal</Button>
                            <Button onClick={handleSubmit} disabled={form.processing || !form.data.judul.trim() || !form.data.isi.trim()}>
                                {form.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ArtikelCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Artikel', href: '/guru-bk/artikel' },
        { title: 'Buat', href: '#' },
    ],
};
