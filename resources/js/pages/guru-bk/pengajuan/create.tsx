import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { ArrowLeft, ScrollText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SiswaData { id: number; nis: string; nama: string; }
interface KategoriData { id: number; nama: string; }
interface JadwalData { id: number; hari: string; jam_mulai: string; jam_selesai: string; guru_bk: { id: number; name: string }; }

interface Props {
    siswaList: SiswaData[];
    kategoriList: KategoriData[];
    jadwalList: JadwalData[];
}

export default function PengajuanCreate({ siswaList, kategoriList, jadwalList }: Props) {
    const [search, setSearch] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        siswa_id: '',
        jadwal_id: '',
        kategori_id: '',
        catatan: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/guru-bk/pengajuan');
    };

    const filteredSiswa = siswaList.filter(
        (s) => s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search)
    );

    const formatTime = (t: string) => t?.substring(0, 5) || t;

    return (
        <>
            <Head title="Buat Pengajuan untuk Siswa" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => window.history.back()}>
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
                                <Input
                                    placeholder="Cari siswa berdasarkan nama atau NIS..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="mb-2"
                                />
                                <Select value={data.siswa_id} onValueChange={(v) => setData('siswa_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Pilih siswa" /></SelectTrigger>
                                    <SelectContent>
                                        {filteredSiswa.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                {s.nis} - {s.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.siswa_id && <p className="text-destructive text-sm">{errors.siswa_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Kategori *</Label>
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
                                <Label>Jadwal *</Label>
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
                                <Textarea value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} placeholder="Catatan tambahan (opsional)" rows={3} />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>Batal</Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Mengirim...' : 'Buat Pengajuan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
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
