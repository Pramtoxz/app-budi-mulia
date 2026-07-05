import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { guruBkRoutes } from '@/lib/routes';

interface PengumumanData {
    id: number;
    judul: string;
    isi: string;
    prioritas: string;
    status: string;
    tgl_berlaku: string | null;
}

interface Props {
    pengumuman: PengumumanData;
}

export default function PengumumanEdit({ pengumuman }: Props) {
    const form = useForm({
        judul: pengumuman.judul,
        isi: pengumuman.isi,
        prioritas: pengumuman.prioritas,
        status: pengumuman.status,
        tgl_berlaku: pengumuman.tgl_berlaku || '',
    });

    const handleSubmit = () => {
        form.put(guruBkRoutes.pengumuman.update(pengumuman.id));
    };

    return (
        <>
            <Head title="Edit Pengumuman" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get(guruBkRoutes.pengumuman.index)}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Pengumuman</h1>
                        <p className="text-muted-foreground">Perbarui pengumuman</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Edit Pengumuman</CardTitle>
                        <CardDescription>Perbarui data pengumuman</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="judul">Judul *</Label>
                            <Input
                                id="judul"
                                value={form.data.judul}
                                onChange={(e) => form.setData('judul', e.target.value)}
                                placeholder="Judul pengumuman"
                            />
                            {form.errors.judul && <p className="text-destructive text-sm">{form.errors.judul}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="isi">Isi Pengumuman *</Label>
                            <Textarea
                                id="isi"
                                value={form.data.isi}
                                onChange={(e) => form.setData('isi', e.target.value)}
                                placeholder="Tulis isi pengumuman..."
                                rows={8}
                            />
                            {form.errors.isi && <p className="text-destructive text-sm">{form.errors.isi}</p>}
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label>Prioritas *</Label>
                                <Select value={form.data.prioritas} onValueChange={(v) => form.setData('prioritas', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="rendah">Rendah</SelectItem>
                                        <SelectItem value="sedang">Sedang</SelectItem>
                                        <SelectItem value="tinggi">Tinggi</SelectItem>
                                    </SelectContent>
                                </Select>
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
                            <div className="space-y-2">
                                <Label htmlFor="tgl_berlaku">Tanggal Berlaku</Label>
                                <Input
                                    id="tgl_berlaku"
                                    type="date"
                                    value={form.data.tgl_berlaku}
                                    onChange={(e) => form.setData('tgl_berlaku', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => router.get(guruBkRoutes.pengumuman.index)}>Batal</Button>
                            <Button onClick={handleSubmit} disabled={form.processing || !form.data.judul.trim() || !form.data.isi.trim()}>
                                {form.processing ? 'Menyimpan...' : 'Perbarui'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PengumumanEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengumuman', href: '/guru-bk/pengumuman' },
        { title: 'Edit', href: '#' },
    ],
};
