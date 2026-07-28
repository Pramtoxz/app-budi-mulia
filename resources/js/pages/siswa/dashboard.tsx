import { Head, Link } from '@inertiajs/react';
import { AlertCircle, BookOpen, Calendar, CheckCircle2, Clock, ScrollText } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface KategoriData { id: number; nama: string; }
interface KonselingData { id: number; status: string; }
interface PengajuanAktif {
    id: number;
    status: string;
    tgl_pengajuan: string;
    catatan: string | null;
    kategori: KategoriData;
    konseling: KonselingData | null;
}

interface JadwalItem {
    id: number;
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
    guru_bk: { id: number; name: string } | null;
}

interface SiswaData {
    id: number;
    nama: string;
    nis: string;
}

interface Props {
    siswa: SiswaData | null;
    pengajuanAktif: PengajuanAktif | null;
    totalPengajuan: number;
    totalSelesai: number;
    jadwalBk: JadwalItem[];
}

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: React.ReactNode }> = {
    menunggu:   { label: 'Menunggu', variant: 'secondary', icon: <Clock className="size-4" /> },
    disetujui:  { label: 'Disetujui', variant: 'default', icon: <CheckCircle2 className="size-4" /> },
    ditolak:    { label: 'Ditolak', variant: 'destructive', icon: <AlertCircle className="size-4" /> },
    dibatalkan: { label: 'Dibatalkan', variant: 'outline', icon: <AlertCircle className="size-4" /> },
};

export default function SiswaDashboard({ siswa, pengajuanAktif, totalPengajuan, totalSelesai, jadwalBk }: Props) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Salam */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Halo, {siswa?.nama ?? 'Siswa'}
                    </h1>
                    <p className="text-muted-foreground">
                        Selamat datang di portal Bimbingan Konseling SMP IT Budi Mulia
                    </p>
                </div>

                {/* Kartu Statistik */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Pengajuan</CardDescription>
                            <CardTitle className="text-3xl">{totalPengajuan}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">Semua pengajuan konseling</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Konseling Selesai</CardDescription>
                            <CardTitle className="text-3xl">{totalSelesai}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">Sesi yang telah selesai</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Pengajuan Aktif */}
                <div>
                    <h2 className="text-lg font-semibold mb-3">Pengajuan Aktif</h2>
                    {!siswa ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                <AlertCircle className="size-10 text-muted-foreground/50" />
                                <p className="mt-3 text-sm font-medium">Data siswa tidak ditemukan</p>
                                <p className="text-xs text-muted-foreground">Hubungi Guru BK untuk menghubungkan akun Anda</p>
                            </CardContent>
                        </Card>
                    ) : pengajuanAktif ? (
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">{pengajuanAktif.kategori.nama}</CardTitle>
                                    <Badge variant={STATUS_MAP[pengajuanAktif.status]?.variant}>
                                        <span className="flex items-center gap-1">
                                            {STATUS_MAP[pengajuanAktif.status]?.icon}
                                            {STATUS_MAP[pengajuanAktif.status]?.label}
                                        </span>
                                    </Badge>
                                </div>
                                <CardDescription>{pengajuanAktif.tgl_pengajuan}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {pengajuanAktif.catatan && (
                                    <p className="text-sm text-muted-foreground">{pengajuanAktif.catatan}</p>
                                )}
                                {pengajuanAktif.konseling && (
                                    <Badge variant="outline" className="w-fit">
                                        Konseling: {pengajuanAktif.konseling.status}
                                    </Badge>
                                )}
                                <Button variant="outline" size="sm" asChild className="w-fit">
                                    <Link href={`/siswa/pengajuan/${pengajuanAktif.id}`}>
                                        Lihat Detail
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10 text-center gap-3">
                                <ScrollText className="size-10 text-muted-foreground/50" />
                                <div>
                                    <p className="text-sm font-medium">Tidak ada pengajuan aktif</p>
                                    <p className="text-xs text-muted-foreground">Ajukan konseling jika Anda membutuhkan bimbingan</p>
                                </div>
                                <Button size="sm" asChild>
                                    <Link href="/siswa/pengajuan/create">Ajukan Konseling</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Jadwal Ketersediaan BK */}
                <div>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="size-5" />
                        Jadwal Ketersediaan Guru BK
                    </h2>
                    {jadwalBk.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                <BookOpen className="size-10 text-muted-foreground/50" />
                                <p className="mt-3 text-sm text-muted-foreground">Belum ada jadwal ketersediaan</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-2">
                            {jadwalBk.map((j) => (
                                <Card key={j.id}>
                                    <CardContent className="flex items-center justify-between py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="size-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">{j.hari}</p>
                                                {j.guru_bk && (
                                                    <p className="text-xs text-muted-foreground">{j.guru_bk.name}</p>
                                                )}
                                            </div>
                                        </div>
                                        <Badge variant="outline">
                                            {j.jam_mulai} – {j.jam_selesai}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

SiswaDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/siswa/dashboard' },
    ],
};
