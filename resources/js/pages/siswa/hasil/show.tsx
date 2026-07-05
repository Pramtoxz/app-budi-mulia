import { Head, router } from '@inertiajs/react';
import { ArrowLeft, FileText, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface SiswaData { id: number; nis: string; nama: string; }
interface KategoriData { id: number; nama: string; }
interface PengajuanData { id: number; siswa: SiswaData; kategori: KategoriData; catatan: string | null; }
interface HasilData {
    id: number;
    tgl_hasil: string;
    solusi: string | null;
    tindak_lanjut: string | null;
    konseling: {
        id: number;
        tgl_konseling: string | null;
        jam_konseling: string | null;
        status: string;
        pengajuan: PengajuanData;
    };
}

interface Props {
    hasil: HasilData;
}

export default function SiswaHasilShow({ hasil }: Props) {
    const formatTime = (t: string | null) => t?.substring(0, 5) || t;

    return (
        <>
            <Head title="Detail Hasil Konseling" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get('/siswa/hasil')}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Detail Hasil Konseling</h1>
                        <p className="text-muted-foreground">{hasil.konseling.pengajuan.kategori.nama}</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="size-5" />
                            Informasi Konseling
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div>
                                <p className="text-muted-foreground text-sm">Kategori</p>
                                <p className="font-medium">{hasil.konseling.pengajuan.kategori.nama}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">Tanggal Konseling</p>
                                <p className="font-medium">{hasil.konseling.tgl_konseling || '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">Jam</p>
                                <p className="font-medium">{formatTime(hasil.konseling.jam_konseling) || '-'}</p>
                            </div>
                        </div>
                        {hasil.konseling.pengajuan.catatan && (
                            <>
                                <Separator className="my-3" />
                                <div>
                                    <p className="text-muted-foreground text-sm mb-1">Catatan Pengajuan</p>
                                    <p className="whitespace-pre-wrap text-sm">{hasil.konseling.pengajuan.catatan}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="size-5" />
                            Hasil Konseling
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-muted-foreground text-sm">Tanggal Hasil</p>
                            <p className="font-medium">{hasil.tgl_hasil}</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-muted-foreground text-sm mb-1">Solusi</p>
                            <p className="whitespace-pre-wrap">{hasil.solusi || '-'}</p>
                        </div>
                        {hasil.tindak_lanjut && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-muted-foreground text-sm mb-1">Tindak Lanjut</p>
                                    <p className="whitespace-pre-wrap">{hasil.tindak_lanjut}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-start">
                    <Button variant="outline" onClick={() => router.get('/siswa/hasil')}>
                        Kembali
                    </Button>
                </div>
            </div>
        </>
    );
}

SiswaHasilShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Hasil', href: '/siswa/hasil' },
        { title: 'Detail', href: '#' },
    ],
};
