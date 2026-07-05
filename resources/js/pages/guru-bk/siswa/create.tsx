import { Head, useForm, router } from '@inertiajs/react';
import { ArrowLeft, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { EntityPicker } from '@/components/entity-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { guruBkRoutes } from '@/lib/routes';

interface KelasData { id: number; nama: string; }

interface Props {
    kelasList: KelasData[];
    tahunAjaranAktif: string;
}

export default function SiswaCreate({ kelasList, tahunAjaranAktif }: Props) {
    const [kelasPickerOpen, setKelasPickerOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        nis: '',
        nama: '',
        jenkel: 'L',
        tempat_lahir: '',
        tgl_lahir: '',
        agama: '',
        alamat: '',
        nama_ayah: '',
        pekerjaan_ayah: '',
        alamat_ayah: '',
        no_hp_ayah: '',
        nama_ibu: '',
        pekerjaan_ibu: '',
        alamat_ibu: '',
        no_hp_ibu: '',
        kelas_id: '',
        tahun_ajaran: tahunAjaranAktif,
    });

    const selectedKelas = kelasList.find((k) => String(k.id) === data.kelas_id);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(guruBkRoutes.siswa.store);
    };

    return (
        <>
            <Head title="Tambah Siswa" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get(guruBkRoutes.siswa.index)}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tambah Siswa</h1>
                        <p className="text-muted-foreground">Tambahkan data siswa baru</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kelas</CardTitle>
                            <CardDescription>Tentukan kelas siswa</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Kelas *</Label>
                                    {selectedKelas ? (
                                        <div className="flex h-9 items-center gap-2 rounded-md border px-3">
                                            <Badge variant="secondary" className="gap-1">
                                                {selectedKelas.nama}
                                                <button type="button" onClick={() => setData('kelas_id', '')} className="ml-1 rounded-full hover:bg-muted-foreground/20">
                                                    <X className="size-3" />
                                                </button>
                                            </Badge>
                                        </div>
                                    ) : (
                                        <Button type="button" variant="outline" className="w-full justify-start h-9 font-normal" onClick={() => setKelasPickerOpen(true)}>
                                            Pilih kelas...
                                        </Button>
                                    )}
                                    {errors.kelas_id && <p className="text-destructive text-sm">{errors.kelas_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tahun_ajaran">Tahun Ajaran *</Label>
                                    <Input id="tahun_ajaran" value={data.tahun_ajaran} onChange={(e) => setData('tahun_ajaran', e.target.value)} placeholder="2025/2026" />
                                    {errors.tahun_ajaran && <p className="text-destructive text-sm">{errors.tahun_ajaran}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

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
                        <Button type="button" variant="outline" onClick={() => router.get(guruBkRoutes.siswa.index)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </div>

            <EntityPicker
                open={kelasPickerOpen}
                onOpenChange={setKelasPickerOpen}
                title="Pilih Kelas"
                description="Cari kelas untuk siswa ini"
                searchPlaceholder="Ketik nama kelas..."
                items={kelasList}
                renderItem={(k) => <span>{k.nama}</span>}
                isSelected={(k) => String(k.id) === data.kelas_id}
                onSelect={(k) => setData('kelas_id', String(k.id))}
                filterFn={(k, q) => k.nama.toLowerCase().includes(q.toLowerCase())}
            />
        </>
    );
}

SiswaCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Siswa', href: '/guru-bk/siswa' },
        { title: 'Tambah', href: '/guru-bk/siswa/create' },
    ],
};
