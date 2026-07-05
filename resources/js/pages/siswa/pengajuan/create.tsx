import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { ArrowLeft, ScrollText, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface KategoriData { id: number; nama: string; }
interface JadwalData { id: number; hari: string; jam_mulai: string; jam_selesai: string; guru_bk: { id: number; name: string }; }

interface Props {
    kategoriList: KategoriData[];
    jadwalList: JadwalData[];
    hasActivePengajuan: boolean;
}

export default function SiswaPengajuanCreate({ kategoriList, jadwalList, hasActivePengajuan }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        jadwal_id: '',
        kategori_id: '',
        catatan: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/siswa/pengajuan');
    };

    const formatTime = (t: string) => t?.substring(0, 5) || t;

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
                    <Button variant="outline" onClick={() => window.history.back()}>Kembali</Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Ajukan Konseling" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => window.history.back()}>
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
                        <CardDescription>Pilih kategori dan jadwal yang tersedia</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Kategori Konseling *</Label>
                                <Select value={data.kategori_id} onValueChange={(v) => setData('kategori_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                                    <SelectContent>
                                        {kategoriList.map((k) => (
                                            <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.kategori_id && <p className="text-destructive text-sm">{errors.kategori_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Jadwal Konseling *</Label>
                                <Select value={data.jadwal_id} onValueChange={(v) => setData('jadwal_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Pilih jadwal" /></SelectTrigger>
                                    <SelectContent>
                                        {jadwalList.map((j) => (
                                            <SelectItem key={j.id} value={String(j.id)}>
                                                {j.hari}, {formatTime(j.jam_mulai)} - {formatTime(j.jam_selesai)} ({j.guru_bk.name})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.jadwal_id && <p className="text-destructive text-sm">{errors.jadwal_id}</p>}
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
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>Batal</Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SiswaPengajuanCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengajuan', href: '/siswa/pengajuan' },
        { title: 'Ajukan', href: '/siswa/pengajuan/create' },
    ],
};
