import { Head, useForm, router } from '@inertiajs/react';
import { ArrowLeft, ScrollText, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { EntityPicker } from '@/components/entity-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { guruBkRoutes } from '@/lib/routes';

interface SiswaData { id: number; nis: string; nama: string; }
interface KategoriData { id: number; nama: string; }

interface Props {
    siswaList: SiswaData[];
    kategoriList: KategoriData[];
}

export default function PengajuanCreate({ siswaList, kategoriList }: Props) {
    const [siswaPickerOpen, setSiswaPickerOpen] = useState(false);
    const [kategoriPickerOpen, setKategoriPickerOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        siswa_id: '',
        kategori_id: '',
        catatan: '',
    });

    const selectedSiswa = siswaList.find((s) => String(s.id) === data.siswa_id);
    const selectedKategori = kategoriList.find((k) => String(k.id) === data.kategori_id);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(guruBkRoutes.pengajuan.store);
    };

    return (
        <>
            <Head title="Buat Pengajuan untuk Siswa" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get(guruBkRoutes.pengajuan.index)}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Buat Pengajuan untuk Siswa</h1>
                        <p className="text-muted-foreground">Guru BK mengajukan konseling untuk siswa yang tidak punya HP</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ScrollText className="size-5" />
                            Form Pengajuan
                        </CardTitle>
                        <CardDescription>Isi data pengajuan konseling</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Siswa *</Label>
                                {selectedSiswa ? (
                                    <div className="flex items-center gap-2 rounded-md border p-2">
                                        <Badge variant="secondary" className="gap-1">
                                            {selectedSiswa.nis} — {selectedSiswa.nama}
                                            <button type="button" onClick={() => setData('siswa_id', '')} className="ml-1 rounded-full hover:bg-muted-foreground/20">
                                                <X className="size-3" />
                                            </button>
                                        </Badge>
                                    </div>
                                ) : (
                                    <Button type="button" variant="outline" className="w-full justify-start" onClick={() => setSiswaPickerOpen(true)}>
                                        Pilih siswa...
                                    </Button>
                                )}
                                {errors.siswa_id && <p className="text-destructive text-sm">{errors.siswa_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Kategori *</Label>
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
                                <Textarea value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} placeholder="Catatan tambahan (opsional)" rows={3} />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => router.get(guruBkRoutes.pengajuan.index)}>Batal</Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Mengirim...' : 'Buat Pengajuan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <EntityPicker
                open={siswaPickerOpen}
                onOpenChange={setSiswaPickerOpen}
                title="Pilih Siswa"
                description="Cari siswa berdasarkan nama atau NIS"
                searchPlaceholder="Ketik nama atau NIS..."
                items={siswaList}
                renderItem={(s) => (
                    <span><span className="font-mono text-muted-foreground mr-2">{s.nis}</span>{s.nama}</span>
                )}
                isSelected={(s) => String(s.id) === data.siswa_id}
                onSelect={(s) => setData('siswa_id', String(s.id))}
                filterFn={(s, q) => s.nama.toLowerCase().includes(q.toLowerCase()) || s.nis.includes(q)}
            />

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

PengajuanCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengajuan', href: '/guru-bk/pengajuan' },
        { title: 'Buat', href: '/guru-bk/pengajuan/create' },
    ],
};
