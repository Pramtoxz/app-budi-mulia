import { Head, router } from '@inertiajs/react';
import { ArrowLeft, ScrollText, CheckCircle, XCircle, Clock, XOctagon, Pencil } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface KategoriData { id: number; nama: string; }
interface KonselingData { id: number; status: string; tgl_konseling: string | null; keterangan: string | null; }
interface PengajuanData {
    id: number;
    tgl_pengajuan: string;
    status: string;
    catatan: string | null;
    alasan_penolakan: string | null;
    diajukan_oleh: string;
    kategori: KategoriData;
    konseling: KonselingData | null;
}

interface Props {
    pengajuan: PengajuanData;
}

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: typeof Clock }> = {
    menunggu: { label: 'Menunggu', variant: 'secondary', icon: Clock },
    disetujui: { label: 'Disetujui', variant: 'default', icon: CheckCircle },
    ditolak: { label: 'Ditolak', variant: 'destructive', icon: XCircle },
    dibatalkan: { label: 'Dibatalkan', variant: 'outline', icon: XOctagon },
};

export default function SiswaPengajuanShow({ pengajuan }: Props) {
    const statusInfo = STATUS_MAP[pengajuan.status];
    const StatusIcon = statusInfo?.icon || Clock;

    return (
        <>
            <Head title="Detail Pengajuan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get('/siswa/pengajuan')}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Detail Pengajuan</h1>
                        <p className="text-muted-foreground">Informasi lengkap pengajuan konseling</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <ScrollText className="size-5" />
                                {pengajuan.kategori.nama}
                            </CardTitle>
                            <Badge variant={statusInfo?.variant || 'default'} className="gap-1">
                                <StatusIcon className="size-3" />
                                {statusInfo?.label || pengajuan.status}
                            </Badge>
                        </div>
                        <CardDescription>
                            Diajukan pada {pengajuan.tgl_pengajuan}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-muted-foreground text-sm">Kategori</p>
                                <p className="font-medium">{pengajuan.kategori.nama}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">Diajukan Oleh</p>
                                <p className="font-medium">{pengajuan.diajukan_oleh === 'siswa' ? 'Anda (Siswa)' : 'Guru BK'}</p>
                            </div>
                        </div>

                        {pengajuan.catatan && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-muted-foreground text-sm mb-1">Catatan</p>
                                    <p>{pengajuan.catatan}</p>
                                </div>
                            </>
                        )}

                        {pengajuan.alasan_penolakan && (
                            <>
                                <Separator />
                                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-3">
                                    <p className="text-destructive font-medium text-sm mb-1">
                                        {pengajuan.status === 'ditolak' ? 'Alasan Penolakan' : 'Alasan Pembatalan'}
                                    </p>
                                    <p className="text-sm">{pengajuan.alasan_penolakan}</p>
                                </div>
                            </>
                        )}

                        {pengajuan.konseling && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-muted-foreground text-sm mb-2">Status Konseling</p>
                                    <Badge variant={pengajuan.konseling.status === 'selesai' ? 'default' : 'secondary'}>
                                        {pengajuan.konseling.status === 'selesai' ? 'Selesai' : 'Dijadwalkan'}
                                    </Badge>
                                    {pengajuan.konseling.tgl_konseling && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Tanggal: {pengajuan.konseling.tgl_konseling}
                                        </p>
                                    )}
                                    {pengajuan.konseling.keterangan && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Keterangan: {pengajuan.konseling.keterangan}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => router.get('/siswa/pengajuan')}>
                        Kembali
                    </Button>
                    {pengajuan.status === 'menunggu' && (
                        <Button onClick={() => router.get(`/siswa/pengajuan/${pengajuan.id}/edit`)}>
                            <Pencil className="size-4" />
                            Edit
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}

SiswaPengajuanShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/siswa/dashboard' },
        { title: 'Pengajuan', href: '/siswa/pengajuan' },
        { title: 'Detail', href: '#' },
    ],
};
