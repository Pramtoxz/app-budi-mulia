import { Head, useForm, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SiswaData { id: number; nis: string; nama: string; }
interface KelasData { id: number; nama: string; }

interface Props {
    siswaList: SiswaData[];
    kelasList: KelasData[];
    tahunAjaranAktif: string;
}

export default function SiswaKelasAssign({ siswaList, kelasList, tahunAjaranAktif }: Props) {
    const [search, setSearch] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        siswa_id: '',
        kelas_id: '',
        tahun_ajaran: tahunAjaranAktif,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/guru-bk/siswa-kelas', {
            onSuccess: () => reset('siswa_id'),
        });
    };

    const filteredSiswa = siswaList.filter(
        (s) => s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search)
    );

    return (
        <>
            <Head title="Assign Siswa ke Kelas" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Assign Siswa ke Kelas</h1>
                        <p className="text-muted-foreground">Tambahkan siswa ke kelas untuk tahun ajaran</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="size-5" />
                            Form Assign
                        </CardTitle>
                        <CardDescription>Pilih siswa dan kelas tujuan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Tahun Ajaran *</Label>
                                <Input
                                    value={data.tahun_ajaran}
                                    onChange={(e) => setData('tahun_ajaran', e.target.value)}
                                    placeholder="2025/2026"
                                />
                                {errors.tahun_ajaran && <p className="text-destructive text-sm">{errors.tahun_ajaran}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Kelas *</Label>
                                <Select value={data.kelas_id} onValueChange={(v) => setData('kelas_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Pilih kelas" /></SelectTrigger>
                                    <SelectContent>
                                        {kelasList.map((k) => (
                                            <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.kelas_id && <p className="text-destructive text-sm">{errors.kelas_id}</p>}
                            </div>

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

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Kembali
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Assign'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SiswaKelasAssign.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Siswa-Kelas', href: '/guru-bk/siswa-kelas' },
        { title: 'Assign', href: '/guru-bk/siswa-kelas/assign' },
    ],
};
