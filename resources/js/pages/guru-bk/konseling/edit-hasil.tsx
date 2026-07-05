import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { guruBkRoutes } from '@/lib/routes';

interface SiswaData { id: number; nis: string; nama: string; }
interface KategoriData { id: number; nama: string; }
interface PengajuanData { id: number; siswa: SiswaData; kategori: KategoriData; }
interface HasilData { id: number; tgl_hasil: string; solusi: string | null; tindak_lanjut: string | null; }
interface KonselingData {
    id: number;
    tgl_konseling: string | null;
    jam_konseling: string | null;
    status: string;
    pengajuan: PengajuanData;
    hasil: HasilData | null;
}

interface Props {
    konseling: KonselingData;
}

export default function EditHasil({ konseling }: Props) {
    const form = useForm({
        solusi: konseling.hasil?.solusi || '',
        tindak_lanjut: konseling.hasil?.tindak_lanjut || '',
    });

    const handleSubmit = () => {
        form.put(guruBkRoutes.konseling.updateHasil(konseling.id));
    };

    return (
        <>
            <Head title="Edit Hasil Konseling" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get(guruBkRoutes.konseling.show(konseling.id))}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Hasil Konseling</h1>
                        <p className="text-muted-foreground">
                            {konseling.pengajuan.siswa.nama} — {konseling.pengajuan.kategori.nama}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="size-5" />
                            Form Edit Hasil
                        </CardTitle>
                        <CardDescription>Perbarui hasil konseling</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="solusi">Solusi *</Label>
                            <Textarea
                                id="solusi"
                                value={form.data.solusi}
                                onChange={(e) => form.setData('solusi', e.target.value)}
                                placeholder="Jelaskan solusi yang diberikan..."
                                rows={4}
                            />
                            {form.errors.solusi && <p className="text-destructive text-sm">{form.errors.solusi}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tindak_lanjut">Tindak Lanjut</Label>
                            <Textarea
                                id="tindak_lanjut"
                                value={form.data.tindak_lanjut}
                                onChange={(e) => form.setData('tindak_lanjut', e.target.value)}
                                placeholder="Rencana tindak lanjut (opsional)..."
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => router.get(guruBkRoutes.konseling.show(konseling.id))}>Batal</Button>
                            <Button onClick={handleSubmit} disabled={form.processing || !form.data.solusi.trim()}>
                                {form.processing ? 'Menyimpan...' : 'Perbarui Hasil'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EditHasil.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Konseling', href: '/guru-bk/konseling' },
        { title: 'Edit Hasil', href: '#' },
    ],
};
