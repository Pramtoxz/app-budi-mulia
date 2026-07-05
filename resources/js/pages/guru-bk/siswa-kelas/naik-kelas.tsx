import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface KelasData { id: number; nama: string; }

interface Props {
    kelasList: KelasData[];
    siswaPerKelas: Record<number, number>;
    tahunAjaranAktif: string;
}

export default function NaikKelas({ kelasList, siswaPerKelas, tahunAjaranAktif }: Props) {
    const [tahunAsal, tahunTujuan] = tahunAjaranAktif.split('/');
    const nextTahunAjaran = tahunAsal && tahunTujuan
        ? `${Number(tahunAsal) + 1}/${Number(tahunTujuan) + 1}`
        : '';

    const { data, setData, post, processing, errors } = useForm({
        kelas_asal_id: '',
        kelas_tujuan_id: '',
        tahun_ajaran_asal: tahunAjaranAktif,
        tahun_ajaran_tujuan: nextTahunAjaran,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/guru-bk/siswa-kelas/naik-kelas');
    };

    const selectedAsalCount = data.kelas_asal_id ? (siswaPerKelas[Number(data.kelas_asal_id)] || 0) : 0;

    return (
        <>
            <Head title="Naik Kelas" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => window.history.back()}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Naik Kelas Massal</h1>
                        <p className="text-muted-foreground">Pindahkan semua siswa aktif dari kelas asal ke kelas tujuan</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ArrowUpRight className="size-5" />
                                Form Naik Kelas
                            </CardTitle>
                            <CardDescription>
                                Siswa aktif di kelas asal akan dipindahkan ke kelas tujuan. Status kelas asal berubah menjadi "lulus".
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Tahun Ajaran Asal *</Label>
                                        <Input
                                            value={data.tahun_ajaran_asal}
                                            onChange={(e) => setData('tahun_ajaran_asal', e.target.value)}
                                        />
                                        {errors.tahun_ajaran_asal && <p className="text-destructive text-sm">{errors.tahun_ajaran_asal}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tahun Ajaran Tujuan *</Label>
                                        <Input
                                            value={data.tahun_ajaran_tujuan}
                                            onChange={(e) => setData('tahun_ajaran_tujuan', e.target.value)}
                                        />
                                        {errors.tahun_ajaran_tujuan && <p className="text-destructive text-sm">{errors.tahun_ajaran_tujuan}</p>}
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label>Kelas Asal *</Label>
                                    <Select value={data.kelas_asal_id} onValueChange={(v) => setData('kelas_asal_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih kelas asal" /></SelectTrigger>
                                        <SelectContent>
                                            {kelasList.map((k) => (
                                                <SelectItem key={k.id} value={String(k.id)}>
                                                    {k.nama} ({siswaPerKelas[k.id] || 0} siswa aktif)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kelas_asal_id && <p className="text-destructive text-sm">{errors.kelas_asal_id}</p>}
                                    {selectedAsalCount > 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            <Badge variant="secondary">{selectedAsalCount} siswa</Badge> akan dipindahkan
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Kelas Tujuan *</Label>
                                    <Select value={data.kelas_tujuan_id} onValueChange={(v) => setData('kelas_tujuan_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih kelas tujuan" /></SelectTrigger>
                                        <SelectContent>
                                            {kelasList.filter((k) => String(k.id) !== data.kelas_asal_id).map((k) => (
                                                <SelectItem key={k.id} value={String(k.id)}>
                                                    {k.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kelas_tujuan_id && <p className="text-destructive text-sm">{errors.kelas_tujuan_id}</p>}
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={processing || selectedAsalCount === 0}>
                                        {processing ? 'Memproses...' : `Naikkan ${selectedAsalCount} Siswa`}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ringkasan Kelas</CardTitle>
                            <CardDescription>Jumlah siswa aktif per kelas ({tahunAjaranAktif})</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {kelasList.map((k) => (
                                    <div key={k.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <span className="font-medium">{k.nama}</span>
                                        <Badge variant={siswaPerKelas[k.id] > 0 ? 'default' : 'secondary'}>
                                            {siswaPerKelas[k.id] || 0} siswa
                                        </Badge>
                                    </div>
                                ))}
                                {kelasList.length === 0 && (
                                    <p className="text-muted-foreground text-sm text-center py-4">
                                        Belum ada kelas. Buat kelas terlebih dahulu.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

NaikKelas.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Siswa-Kelas', href: '/guru-bk/siswa-kelas' },
        { title: 'Naik Kelas', href: '/guru-bk/siswa-kelas/naik-kelas' },
    ],
};
