import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SiswaData {
    id: number;
    nis: string;
    nama: string;
    jenkel: string;
    tempat_lahir: string | null;
    tgl_lahir: string | null;
    agama: string | null;
    alamat: string | null;
    nama_ayah: string | null;
    pekerjaan_ayah: string | null;
    alamat_ayah: string | null;
    no_hp_ayah: string | null;
    nama_ibu: string | null;
    pekerjaan_ibu: string | null;
    alamat_ibu: string | null;
    no_hp_ibu: string | null;
}

interface Props {
    siswa: SiswaData;
}

export default function SiswaEdit({ siswa }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nis: siswa.nis,
        nama: siswa.nama,
        jenkel: siswa.jenkel,
        tempat_lahir: siswa.tempat_lahir ?? '',
        tgl_lahir: siswa.tgl_lahir ?? '',
        agama: siswa.agama ?? '',
        alamat: siswa.alamat ?? '',
        nama_ayah: siswa.nama_ayah ?? '',
        pekerjaan_ayah: siswa.pekerjaan_ayah ?? '',
        alamat_ayah: siswa.alamat_ayah ?? '',
        no_hp_ayah: siswa.no_hp_ayah ?? '',
        nama_ibu: siswa.nama_ibu ?? '',
        pekerjaan_ibu: siswa.pekerjaan_ibu ?? '',
        alamat_ibu: siswa.alamat_ibu ?? '',
        no_hp_ibu: siswa.no_hp_ibu ?? '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/guru-bk/siswa/${siswa.id}`);
    };

    return (
        <>
            <Head title={`Edit ${siswa.nama}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => window.history.back()}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Siswa</h1>
                        <p className="text-muted-foreground">Perbarui data {siswa.nama}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Pribadi</CardTitle>
                            <CardDescription>Informasi dasar siswa</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nis">NIS *</Label>
                                    <Input id="nis" value={data.nis} onChange={(e) => setData('nis', e.target.value)} />
                                    {errors.nis && <p className="text-destructive text-sm">{errors.nis}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama Lengkap *</Label>
                                    <Input id="nama" value={data.nama} onChange={(e) => setData('nama', e.target.value)} />
                                    {errors.nama && <p className="text-destructive text-sm">{errors.nama}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Jenis Kelamin *</Label>
                                    <Select value={data.jenkel} onValueChange={(v) => setData('jenkel', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="L">Laki-laki</SelectItem>
                                            <SelectItem value="P">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="agama">Agama</Label>
                                    <Input id="agama" value={data.agama} onChange={(e) => setData('agama', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                    <Input id="tempat_lahir" value={data.tempat_lahir} onChange={(e) => setData('tempat_lahir', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tgl_lahir">Tanggal Lahir</Label>
                                    <Input id="tgl_lahir" type="date" value={data.tgl_lahir} onChange={(e) => setData('tgl_lahir', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="alamat">Alamat</Label>
                                <Textarea id="alamat" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} rows={2} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Data Orang Tua</CardTitle>
                            <CardDescription>Informasi orang tua / wali</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_ayah">Nama Ayah</Label>
                                    <Input id="nama_ayah" value={data.nama_ayah} onChange={(e) => setData('nama_ayah', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pekerjaan_ayah">Pekerjaan Ayah</Label>
                                    <Input id="pekerjaan_ayah" value={data.pekerjaan_ayah} onChange={(e) => setData('pekerjaan_ayah', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="no_hp_ayah">No HP Ayah</Label>
                                    <Input id="no_hp_ayah" value={data.no_hp_ayah} onChange={(e) => setData('no_hp_ayah', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="alamat_ayah">Alamat Ayah</Label>
                                    <Input id="alamat_ayah" value={data.alamat_ayah} onChange={(e) => setData('alamat_ayah', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_ibu">Nama Ibu</Label>
                                    <Input id="nama_ibu" value={data.nama_ibu} onChange={(e) => setData('nama_ibu', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pekerjaan_ibu">Pekerjaan Ibu</Label>
                                    <Input id="pekerjaan_ibu" value={data.pekerjaan_ibu} onChange={(e) => setData('pekerjaan_ibu', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="no_hp_ibu">No HP Ibu</Label>
                                    <Input id="no_hp_ibu" value={data.no_hp_ibu} onChange={(e) => setData('no_hp_ibu', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="alamat_ibu">Alamat Ibu</Label>
                                    <Input id="alamat_ibu" value={data.alamat_ibu} onChange={(e) => setData('alamat_ibu', e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Perbarui'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

SiswaEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Siswa', href: '/guru-bk/siswa' },
        { title: 'Edit', href: '#' },
    ],
};
