import { Head, useForm, router } from '@inertiajs/react';
import { ArrowLeft, ScrollText, AlertCircle, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { EntityPicker } from '@/components/entity-picker';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface KategoriData { id: number; nama: string; }

interface Props {
    kategoriList: KategoriData[];
    hasActivePengajuan: boolean;
}

export default function SiswaPengajuanCreate({ kategoriList, hasActivePengajuan }: Props) {
    const [kategoriPickerOpen, setKategoriPickerOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        kategori_id: '',
        catatan: '',
    });

    const selectedKategori = kategoriList.find((k) => String(k.id) === data.kategori_id);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/siswa/pengajuan');
    };

    if (hasActivePengajuan) {
        return (
            <>
                <Head title="Ajukan Konseling" />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <Alert>
                        <AlertCircle className="size-4" />
                        <AlertDescription>
                            Anda masih memiliki pengajuan aktif. Tunggu sampai pengajuan selesai sebelum membuat yang baru.
                        </AlertDescription>
                    </Alert>
                    <Button variant="outline" onClick={() => router.get('/siswa/pengajuan')}>Kembali</Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Ajukan Konseling" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get('/siswa/pengajuan')}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Ajukan Konseling</h1>
                        <p className="text-muted-foreground">Isi form untuk mengajukan konseling</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ScrollText className="size-5" />
                            Form Pengajuan
                        </CardTitle>
                        <CardDescription>Pilih kategori konseling yang sesuai</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Kategori Konseling *</Label>
                                {selectedKategori ? (
                                    <div className="flex items-center gap-2 rounded-md border p-2">
                                        <Badge variant="secondary" className="gap-1">
                                            {selectedKategori.nama}
                                            <button type="button" onClick={() => setData('kategori_id', '')} className="ml-1 rounded-full hover:bg-muted-foreground/20">
                                                <X className="size-3" />
                                            </button>
                                        </Badge>
                                    </div>
                                ) : (
                                    <Button type="button" variant="outline" className="w-full justify-start" onClick={() => setKategoriPickerOpen(true)}>
                                        Pilih kategori...
                                    </Button>
                                )}
                                {errors.kategori_id && <p className="text-destructive text-sm">{errors.kategori_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Catatan</Label>
                                <Textarea
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    placeholder="Ceritakan masalah Anda secara singkat (opsional)"
                                    rows={4}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => router.get('/siswa/pengajuan')}>Batal</Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <EntityPicker
                open={kategoriPickerOpen}
                onOpenChange={setKategoriPickerOpen}
                title="Pilih Kategori"
                description="Cari kategori konseling"
                searchPlaceholder="Ketik nama kategori..."
                items={kategoriList}
                renderItem={(k) => <span>{k.nama}</span>}
                isSelected={(k) => String(k.id) === data.kategori_id}
                onSelect={(k) => setData('kategori_id', String(k.id))}
                filterFn={(k, q) => k.nama.toLowerCase().includes(q.toLowerCase())}
            />
        </>
    );
}

SiswaPengajuanCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/siswa/dashboard' },
        { title: 'Pengajuan', href: '/siswa/pengajuan' },
        { title: 'Ajukan', href: '/siswa/pengajuan/create' },
    ],
};
