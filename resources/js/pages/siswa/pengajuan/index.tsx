import { Head, router } from '@inertiajs/react';
import { Plus, ScrollText, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface JadwalData { id: number; hari: string; jam_mulai: string; jam_selesai: string; guru_bk: { name: string }; }
interface KategoriData { id: number; nama: string; }
interface KonselingData { id: number; status: string; }
interface PengajuanData {
    id: number;
    tgl_pengajuan: string;
    status: string;
    catatan: string | null;
    alasan_penolakan: string | null;
    diajukan_oleh: string;
    jadwal: JadwalData;
    kategori: KategoriData;
    konseling: KonselingData | null;
}

interface Props {
    pengajuan: PengajuanData[];
    siswaNotFound: boolean;
}

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    menunggu: { label: 'Menunggu', variant: 'secondary' },
    disetujui: { label: 'Disetujui', variant: 'default' },
    ditolak: { label: 'Ditolak', variant: 'destructive' },
    dibatalkan: { label: 'Dibatalkan', variant: 'outline' },
};

export default function SiswaPengajuanIndex({ pengajuan, siswaNotFound }: Props) {
    const formatTime = (t: string) => t?.substring(0, 5) || t;

    const hasActive = pengajuan.some((p) => ['menunggu', 'disetujui'].includes(p.status));

    return (
        <>
            <Head title="Pengajuan Konseling" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pengajuan Konseling</h1>
                        <p className="text-muted-foreground">Ajukan konseling dan lihat status pengajuan</p>
                    </div>
                    {!siswaNotFound && !hasActive && (
                        <Button onClick={() => router.get('/siswa/pengajuan/create')}>
                            <Plus className="size-4" />
                            Ajukan Konseling
                        </Button>
                    )}
                </div>

                {siswaNotFound ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <ScrollText className="size-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-semibold">Data siswa tidak ditemukan</h3>
                            <p className="text-muted-foreground text-sm">Hubungi Guru BK untuk mendaftarkan akun Anda</p>
                        </CardContent>
                    </Card>
                ) : pengajuan.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <ScrollText className="size-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-semibold">Belum ada pengajuan</h3>
                            <p className="text-muted-foreground text-sm">Ajukan konseling jika Anda membutuhkan bimbingan</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {pengajuan.map((p) => (
                            <Card key={p.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.get(`/siswa/pengajuan/${p.id}`)}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">{p.kategori.nama}</CardTitle>
                                        <Badge variant={STATUS_MAP[p.status]?.variant || 'default'}>
                                            {STATUS_MAP[p.status]?.label || p.status}
                                        </Badge>
                                    </div>
                                    <CardDescription>
                                        {p.jadwal.hari}, {formatTime(p.jadwal.jam_mulai)} - {formatTime(p.jadwal.jam_selesai)} • {p.jadwal.guru_bk.name}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {p.catatan && <p className="text-sm text-muted-foreground">{p.catatan}</p>}
                                    {p.alasan_penolakan && (
                                        <p className="text-sm text-destructive mt-1">Alasan: {p.alasan_penolakan}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                        <Eye className="size-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Klik untuk melihat detail</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

SiswaPengajuanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengajuan', href: '/siswa/pengajuan' },
    ],
};
