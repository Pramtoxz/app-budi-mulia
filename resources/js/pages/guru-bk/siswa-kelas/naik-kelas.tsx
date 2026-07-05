import { Head, router } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, Users, CheckCircle } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { guruBkRoutes } from '@/lib/routes';

interface KelasData { id: number; nama: string; }
interface SiswaEntry { id: number; siswa: { id: number; nis: string; nama: string }; }

interface Props {
    kelasList: KelasData[];
    siswaList: SiswaEntry[];
    tahunAjaranAktif: string;
    nextTahunAjaran: string;
    selectedKelasId: number | null;
}

type SiswaStatus = 'naik' | 'tidak_naik' | 'pindah_sekolah' | 'lulus';

export default function NaikKelas({ kelasList, siswaList, tahunAjaranAktif, nextTahunAjaran, selectedKelasId }: Props) {
    const [selectedKelas, setSelectedKelas] = useState<string>(selectedKelasId ? String(selectedKelasId) : '');
    const [kelasTujuan, setKelasTujuan] = useState<string>('');
    const [exceptions, setExceptions] = useState<Record<number, SiswaStatus>>({});
    const [processing, setProcessing] = useState(false);

    const handleKelasChange = (kelasId: string) => {
        setSelectedKelas(kelasId);
        setExceptions({});
        setKelasTujuan('');
        router.get(guruBkRoutes.siswaKelas.naikKelas, { kelas_id: kelasId }, { preserveState: true });
    };

    const toggleException = (siswaId: number, status: SiswaStatus) => {
        setExceptions((prev) => {
            if (prev[siswaId] === status) {
                const next = { ...prev };
                delete next[siswaId];

                return next;
            }

            return { ...prev, [siswaId]: status };
        });
    };

    const handleSubmit = () => {
        if (!selectedKelas || siswaList.length === 0 || !kelasTujuan) {
return;
}

        const siswaPayload = siswaList.map((entry) => {
            const exception = exceptions[entry.siswa.id];

            if (exception) {
                return {
                    siswa_id: entry.siswa.id,
                    status: exception,
                    kelas_tujuan_id: null,
                };
            }

            return {
                siswa_id: entry.siswa.id,
                status: 'naik' as SiswaStatus,
                kelas_tujuan_id: Number(kelasTujuan),
            };
        });

        setProcessing(true);
        router.post(guruBkRoutes.siswaKelas.naikKelas, {
            tahun_ajaran_tujuan: nextTahunAjaran,
            siswa: siswaPayload,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const exceptionCount = Object.keys(exceptions).length;
    const naikCount = siswaList.length - exceptionCount;
    const canSubmit = selectedKelas && siswaList.length > 0 && kelasTujuan;

    const kelasTujuanOptions = kelasList.filter((k) => String(k.id) !== selectedKelas);

    return (
        <>
            <Head title="Naik Kelas" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get(guruBkRoutes.siswaKelas.index)}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Naik Kelas</h1>
                        <p className="text-muted-foreground">
                            {tahunAjaranAktif} → {nextTahunAjaran}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ArrowUpRight className="size-5" />
                            Pilih Kelas & Tujuan
                        </CardTitle>
                        <CardDescription>
                            Semua siswa otomatis "Naik". Klik nama siswa yang TIDAK naik (pindah/tidak naik/lulus).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Kelas Asal *</Label>
                                <Select value={selectedKelas} onValueChange={handleKelasChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kelasList.map((k) => (
                                            <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Kelas Tujuan *</Label>
                                <Select value={kelasTujuan} onValueChange={setKelasTujuan} disabled={!selectedKelas}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kelas tujuan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kelasTujuanOptions.map((k) => (
                                            <SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {selectedKelas && siswaList.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="size-5" />
                                Daftar Siswa
                            </CardTitle>
                            <CardDescription>
                                <span className="text-green-600 font-medium">{naikCount} naik</span>
                                {exceptionCount > 0 && (
                                    <span className="text-destructive ml-2">• {exceptionCount} tidak naik</span>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40px]">No</TableHead>
                                        <TableHead>NIS</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-center">Aksi Cepat</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {siswaList.map((entry, index) => {
                                        const exception = exceptions[entry.siswa.id];
                                        const isException = !!exception;

                                        return (
                                            <TableRow key={entry.id} className={isException ? 'bg-destructive/5' : ''}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className="font-mono text-sm">{entry.siswa.nis}</TableCell>
                                                <TableCell className="font-medium">{entry.siswa.nama}</TableCell>
                                                <TableCell className="text-center">
                                                    {isException ? (
                                                        <Badge variant="destructive">
                                                            {exception === 'tidak_naik' ? 'Tidak Naik' : exception === 'pindah_sekolah' ? 'Pindah' : 'Lulus'}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="default" className="bg-green-600">
                                                            <CheckCircle className="size-3 mr-1" />
                                                            Naik
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {!isException ? (
                                                        <div className="flex gap-1 justify-center">
                                                            <Button size="sm" variant="outline" onClick={() => toggleException(entry.siswa.id, 'tidak_naik')}>
                                                                Tidak Naik
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={() => toggleException(entry.siswa.id, 'pindah_sekolah')}>
                                                                Pindah
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={() => toggleException(entry.siswa.id, 'lulus')}>
                                                                Lulus
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button size="sm" variant="ghost" onClick={() => toggleException(entry.siswa.id, exception)}>
                                                            Batalkan
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {selectedKelas && siswaList.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Users className="size-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-semibold">Tidak ada siswa</h3>
                            <p className="text-muted-foreground text-sm">Tidak ditemukan siswa aktif di kelas ini</p>
                        </CardContent>
                    </Card>
                )}

                {selectedKelas && siswaList.length > 0 && (
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => router.get(guruBkRoutes.siswaKelas.index)}>
                            Batal
                        </Button>
                        <Button onClick={handleSubmit} disabled={!canSubmit || processing}>
                            {processing ? 'Memproses...' : `Proses ${siswaList.length} Siswa`}
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

NaikKelas.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Siswa-Kelas', href: '/guru-bk/siswa-kelas' },
        { title: 'Naik Kelas', href: '/guru-bk/siswa-kelas/naik-kelas' },
    ],
};
