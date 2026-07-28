import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    GraduationCap,
    Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PengajuanItem {
    id: number;
    nama_siswa: string;
    nis: string;
    kategori: string;
    tgl_pengajuan: string;
    status: string;
}

interface KonselingItem {
    id: number;
    nama_siswa: string;
    kategori: string;
    tgl_konseling: string;
    jam_konseling: string;
    status: string;
}

interface Props {
    role: 'guru_bk' | 'kepala_sekolah' | 'siswa';
    userName: string;
    tahunAjaran: string;
    stats: {
        totalSiswa: number;
        pengajuanMenunggu: number;
        pengajuanDisetujui: number;
        konselingSelesai: number;
    };
    pengajuanTerbaru: PengajuanItem[];
    konselingTerbaru: KonselingItem[];
}

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    menunggu:   { label: 'Menunggu', variant: 'secondary' },
    disetujui:  { label: 'Disetujui', variant: 'default' },
    ditolak:    { label: 'Ditolak', variant: 'destructive' },
    dibatalkan: { label: 'Dibatalkan', variant: 'outline' },
    selesai:    { label: 'Selesai', variant: 'default' },
};

export default function Dashboard({
    role,
    userName,
    tahunAjaran,
    stats,
    pengajuanTerbaru,
    konselingTerbaru,
}: Props) {
    const isKepsek = role === 'kepala_sekolah';
    const baseUrl = isKepsek ? '/kepsek' : '/guru-bk';

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header / Salam */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Selamat Datang, {userName}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isKepsek
                                ? 'Ringkasan aktivitas Bimbingan Konseling SMP IT Budi Mulia'
                                : 'Panel kerja Bimbingan & Konseling SMP IT Budi Mulia'}
                        </p>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs px-3 py-1">
                        Tahun Ajaran {tahunAjaran}
                    </Badge>
                </div>

                {/* Grid Statistik Ringkas */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardDescription className="text-xs font-medium">Total Siswa</CardDescription>
                            <Users className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-2xl">{stats.totalSiswa}</CardTitle>
                            <p className="text-[11px] text-muted-foreground mt-1">Siswa terdaftar</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardDescription className="text-xs font-medium">Menunggu BK</CardDescription>
                            <Clock className="size-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-2xl">{stats.pengajuanMenunggu}</CardTitle>
                            <p className="text-[11px] text-muted-foreground mt-1">Perlu tindakan</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardDescription className="text-xs font-medium">Pengajuan Disetujui</CardDescription>
                            <GraduationCap className="size-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-2xl">{stats.pengajuanDisetujui}</CardTitle>
                            <p className="text-[11px] text-muted-foreground mt-1">Siap konseling</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardDescription className="text-xs font-medium">Konseling Selesai</CardDescription>
                            <CheckCircle2 className="size-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-2xl">{stats.konselingSelesai}</CardTitle>
                            <p className="text-[11px] text-muted-foreground mt-1">Total sesi selesai</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Section Tabel Ringkasan (2 Kolom) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left: 5 Pengajuan Terbaru */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base font-semibold">Pengajuan Terbaru</CardTitle>
                                <CardDescription className="text-xs">Permohonan bimbingan dari siswa</CardDescription>
                            </div>
                            {!isKepsek ? (
                                <Button size="sm" variant="ghost" asChild className="text-xs">
                                    <Link href="/guru-bk/pengajuan">Lihat Semua</Link>
                                </Button>
                            ) : (
                                <Button size="sm" variant="ghost" asChild className="text-xs">
                                    <Link href="/kepsek/laporan/pengajuan">Laporan</Link>
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                            {pengajuanTerbaru.length === 0 ? (
                                <p className="text-xs text-muted-foreground text-center py-6">Belum ada pengajuan</p>
                            ) : (
                                <div className="divide-y divide-border">
                                    {pengajuanTerbaru.map((p) => (
                                        <div key={p.id} className="flex items-center justify-between p-3 px-6 hover:bg-muted/30 transition-colors">
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium leading-none">{p.nama_siswa}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {p.kategori} &bull; {p.tgl_pengajuan}
                                                </p>
                                            </div>
                                            <Badge variant={STATUS_MAP[p.status]?.variant ?? 'outline'} className="text-[11px]">
                                                {STATUS_MAP[p.status]?.label ?? p.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right: 5 Konseling Terbaru */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base font-semibold">Sesi Konseling Terbaru</CardTitle>
                                <CardDescription className="text-xs">Jadwal & histori konseling</CardDescription>
                            </div>
                            {!isKepsek ? (
                                <Button size="sm" variant="ghost" asChild className="text-xs">
                                    <Link href="/guru-bk/konseling">Lihat Semua</Link>
                                </Button>
                            ) : (
                                <Button size="sm" variant="ghost" asChild className="text-xs">
                                    <Link href="/kepsek/laporan/konseling">Laporan</Link>
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                            {konselingTerbaru.length === 0 ? (
                                <p className="text-xs text-muted-foreground text-center py-6">Belum ada sesi konseling</p>
                            ) : (
                                <div className="divide-y divide-border">
                                    {konselingTerbaru.map((k) => (
                                        <div key={k.id} className="flex items-center justify-between p-3 px-6 hover:bg-muted/30 transition-colors">
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium leading-none">{k.nama_siswa}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {k.tgl_konseling} ({k.jam_konseling})
                                                </p>
                                            </div>
                                            <Badge variant={STATUS_MAP[k.status]?.variant ?? 'outline'} className="text-[11px]">
                                                {STATUS_MAP[k.status]?.label ?? k.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
