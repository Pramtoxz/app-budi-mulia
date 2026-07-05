import { Head, router } from '@inertiajs/react';
import { FileText, Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface KategoriData { id: number; nama: string; }
interface PengajuanData { id: number; kategori: KategoriData; }
interface KonselingData { id: number; tgl_konseling: string | null; pengajuan: PengajuanData; }
interface HasilData {
    id: number;
    tgl_hasil: string;
    solusi: string | null;
    tindak_lanjut: string | null;
    konseling: KonselingData;
}

interface Props {
    hasilList: HasilData[];
    siswaNotFound: boolean;
}

export default function SiswaHasilIndex({ hasilList, siswaNotFound }: Props) {
    return (
        <>
            <Head title="Hasil Konseling" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Hasil Konseling</h1>
                    <p className="text-muted-foreground">Lihat hasil dari sesi konseling Anda</p>
                </div>

                {siswaNotFound ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="size-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-semibold">Data siswa tidak ditemukan</h3>
                            <p className="text-muted-foreground text-sm">Hubungi Guru BK untuk mendaftarkan akun Anda</p>
                        </CardContent>
                    </Card>
                ) : hasilList.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="size-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-semibold">Belum ada hasil konseling</h3>
                            <p className="text-muted-foreground text-sm">Hasil konseling akan muncul di sini setelah sesi selesai</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {hasilList.map((h) => (
                            <Card key={h.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.get(`/siswa/hasil/${h.id}`)}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">{h.konseling.pengajuan.kategori.nama}</CardTitle>
                                        <Badge variant="default">Selesai</Badge>
                                    </div>
                                    <CardDescription>
                                        Tanggal hasil: {h.tgl_hasil}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {h.solusi && <p className="text-sm text-muted-foreground line-clamp-2">{h.solusi}</p>}
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

SiswaHasilIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Hasil', href: '/siswa/hasil' },
    ],
};
