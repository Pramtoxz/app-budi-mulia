import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, MessageSquare, CheckCircle, Clock, FileText, Pencil, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { guruBkRoutes } from '@/lib/routes';

interface SiswaData { id: number; nis: string; nama: string; jenkel: string; }
interface KategoriData { id: number; nama: string; }
interface PengajuanData { id: number; siswa: SiswaData; kategori: KategoriData; catatan: string | null; }
interface HasilData { id: number; tgl_hasil: string; solusi: string | null; tindak_lanjut: string | null; }
interface KonselingData {
    id: number;
    tgl_konseling: string | null;
    jam_konseling: string | null;
    status: string;
    keterangan: string | null;
    pengajuan: PengajuanData;
    hasil: HasilData | null;
}

interface Props {
    konseling: KonselingData;
}

export default function KonselingShow({ konseling }: Props) {
    const formatTime = (t: string | null) => t?.substring(0, 5) || t;

    const hasilForm = useForm({
        solusi: '',
        tindak_lanjut: '',
    });

    const handleSubmitHasil = () => {
        hasilForm.post(guruBkRoutes.konseling.inputHasil(konseling.id), {
            onSuccess: () => hasilForm.reset(),
        });
    };

    return (
        <>
            <Head title="Detail Konseling" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get(guruBkRoutes.konseling.index)}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">Detail Konseling</h1>
                        <p className="text-muted-foreground">Informasi sesi konseling dan input hasil</p>
                    </div>
                    <Badge variant={konseling.status === 'selesai' ? 'default' : 'secondary'} className="gap-1">
                        {konseling.status === 'selesai' ? <CheckCircle className="size-3" /> : <Clock className="size-3" />}
                        {konseling.status === 'selesai' ? 'Selesai' : 'Dijadwalkan'}
                    </Badge>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="size-5" />
                            Data Siswa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div>
                                <p className="text-muted-foreground text-sm">NIS</p>
                                <p className="font-mono font-medium">{konseling.pengajuan.siswa.nis}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">Nama</p>
                                <p className="font-medium">{konseling.pengajuan.siswa.nama}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">Jenis Kelamin</p>
                                <p className="font-medium">{konseling.pengajuan.siswa.jenkel === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">Kategori</p>
                                <p className="font-medium">{konseling.pengajuan.kategori.nama}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="size-5" />
                            Jadwal Konseling
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div>
                                <p className="text-muted-foreground text-sm">Tanggal</p>
                                <p className="font-medium">{konseling.tgl_konseling || '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">Jam</p>
                                <p className="font-medium">{formatTime(konseling.jam_konseling) || '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">Status</p>
                                <Badge variant={konseling.status === 'selesai' ? 'default' : 'secondary'}>
                                    {konseling.status === 'selesai' ? 'Selesai' : 'Dijadwalkan'}
                                </Badge>
                            </div>
                        </div>

                        {konseling.keterangan && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-muted-foreground text-sm mb-1">Keterangan</p>
                                    <p className="whitespace-pre-wrap">{konseling.keterangan}</p>
                                </div>
                            </>
                        )}

                        {konseling.pengajuan.catatan && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-muted-foreground text-sm mb-1">Catatan Pengajuan</p>
                                    <p className="whitespace-pre-wrap">{konseling.pengajuan.catatan}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {konseling.hasil ? (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="size-5" />
                                    Hasil Konseling
                                </CardTitle>
                                <Button variant="outline" size="sm" onClick={() => router.get(guruBkRoutes.konseling.editHasil(konseling.id))}>
                                    <Pencil className="size-4" />
                                    Edit Hasil
                                </Button>
                            </div>
                            <CardDescription>Tanggal: {konseling.hasil.tgl_hasil}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Solusi</p>
                                <p className="whitespace-pre-wrap">{konseling.hasil.solusi}</p>
                            </div>
                            {konseling.hasil.tindak_lanjut && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-muted-foreground text-sm mb-1">Tindak Lanjut</p>
                                        <p className="whitespace-pre-wrap">{konseling.hasil.tindak_lanjut}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="size-5" />
                                Input Hasil Konseling
                            </CardTitle>
                            <CardDescription>Isi hasil konseling setelah sesi selesai</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="solusi">Solusi *</Label>
                                <Textarea
                                    id="solusi"
                                    value={hasilForm.data.solusi}
                                    onChange={(e) => hasilForm.setData('solusi', e.target.value)}
                                    placeholder="Jelaskan solusi yang diberikan..."
                                    rows={4}
                                />
                                {hasilForm.errors.solusi && <p className="text-destructive text-sm">{hasilForm.errors.solusi}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tindak_lanjut">Tindak Lanjut</Label>
                                <Textarea
                                    id="tindak_lanjut"
                                    value={hasilForm.data.tindak_lanjut}
                                    onChange={(e) => hasilForm.setData('tindak_lanjut', e.target.value)}
                                    placeholder="Rencana tindak lanjut (opsional)..."
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => router.get(guruBkRoutes.konseling.index)}>Kembali</Button>
                                <Button onClick={handleSubmitHasil} disabled={hasilForm.processing || !hasilForm.data.solusi.trim()}>
                                    {hasilForm.processing ? 'Menyimpan...' : 'Simpan Hasil'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

KonselingShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Konseling', href: '/guru-bk/konseling' },
        { title: 'Detail', href: '#' },
    ],
};
