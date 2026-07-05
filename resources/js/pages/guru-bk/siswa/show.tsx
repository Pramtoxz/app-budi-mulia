import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, User, Phone, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { guruBkRoutes } from '@/lib/routes';

interface PengajuanData {
    id: number;
    tgl_pengajuan: string;
    status: string;
    kategori: { nama: string };
}

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
    siswa_kelas: {
        id: number;
        kelas: { id: number; nama: string };
        tahun_ajaran: string;
        status: string;
    }[];
    pengajuan: PengajuanData[];
}

interface Props {
    siswa: SiswaData;
}

export default function SiswaShow({ siswa }: Props) {
    const statusColor: Record<string, string> = {
        aktif: 'default',
        lulus: 'secondary',
        pindah_sekolah: 'outline',
        keluar: 'destructive',
    };

    return (
        <>
            <Head title={siswa.nama} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => router.get(guruBkRoutes.siswa.index)}>
                            <ArrowLeft className="size-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{siswa.nama}</h1>
                            <p className="text-muted-foreground">NIS: {siswa.nis}</p>
                        </div>
                    </div>
                    <Button onClick={() => router.get(guruBkRoutes.siswa.edit(siswa.id))}>
                        <Pencil className="size-4" />
                        Edit
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="size-5" />
                                Data Pribadi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Jenis Kelamin</span>
                                <span className="font-medium">{siswa.jenkel === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tempat, Tanggal Lahir</span>
                                <span className="font-medium">
                                    {siswa.tempat_lahir && siswa.tgl_lahir
                                        ? `${siswa.tempat_lahir}, ${siswa.tgl_lahir}`
                                        : '-'}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Agama</span>
                                <span className="font-medium">{siswa.agama || '-'}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Alamat</span>
                                <span className="font-medium max-w-[200px] text-right">{siswa.alamat || '-'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="size-5" />
                                Data Orang Tua
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-muted-foreground text-sm">Ayah</p>
                                <p className="font-medium">{siswa.nama_ayah || '-'}</p>
                                {siswa.pekerjaan_ayah && <p className="text-muted-foreground text-sm">{siswa.pekerjaan_ayah}</p>}
                                {siswa.no_hp_ayah && <p className="text-sm flex items-center gap-1"><Phone className="size-3" />{siswa.no_hp_ayah}</p>}
                            </div>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground text-sm">Ibu</p>
                                <p className="font-medium">{siswa.nama_ibu || '-'}</p>
                                {siswa.pekerjaan_ibu && <p className="text-muted-foreground text-sm">{siswa.pekerjaan_ibu}</p>}
                                {siswa.no_hp_ibu && <p className="text-sm flex items-center gap-1"><Phone className="size-3" />{siswa.no_hp_ibu}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Kelas</CardTitle>
                        <CardDescription>Data kelas siswa per tahun ajaran</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {siswa.siswa_kelas.length === 0 ? (
                            <p className="text-muted-foreground text-sm">Belum terdaftar di kelas manapun</p>
                        ) : (
                            <div className="space-y-2">
                                {siswa.siswa_kelas.map((sk) => (
                                    <div key={sk.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <div>
                                            <p className="font-medium">{sk.kelas.nama}</p>
                                            <p className="text-muted-foreground text-sm">{sk.tahun_ajaran}</p>
                                        </div>
                                        <Badge variant={statusColor[sk.status] as 'default' | 'secondary' | 'outline' | 'destructive'}>
                                            {sk.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SiswaShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Siswa', href: '/guru-bk/siswa' },
        { title: 'Detail', href: '#' },
    ],
};
