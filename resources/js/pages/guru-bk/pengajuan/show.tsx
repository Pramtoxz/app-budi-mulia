import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, ScrollText, CheckCircle, XCircle, Clock, XOctagon, User } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { guruBkRoutes } from '@/lib/routes';

interface SiswaData { id: number; nis: string; nama: string; jenkel: string; }
interface KategoriData { id: number; nama: string; }
interface KonselingData { id: number; status: string; tgl_konseling: string | null; jam_konseling: string | null; keterangan: string | null; }
interface PengajuanData {
    id: number;
    tgl_pengajuan: string;
    status: string;
    catatan: string | null;
    alasan_penolakan: string | null;
    diajukan_oleh: string;
    siswa: SiswaData;
    kategori: KategoriData;
    konseling: KonselingData | null;
}

interface Slot {
    date: string;
    day: string;
    time: string;
    time_end: string;
    label: string;
    booked: boolean;
}

interface JadwalTemplate { hari: string; jam_mulai: string; jam_selesai: string; }

interface Props {
    pengajuan: PengajuanData;
    jadwalTemplate: JadwalTemplate[];
    blockedDates: string[];
}

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: typeof Clock }> = {
    menunggu: { label: 'Menunggu', variant: 'secondary', icon: Clock },
    disetujui: { label: 'Disetujui', variant: 'default', icon: CheckCircle },
    ditolak: { label: 'Ditolak', variant: 'destructive', icon: XCircle },
    dibatalkan: { label: 'Dibatalkan', variant: 'outline', icon: XOctagon },
};

export default function PengajuanShow({ pengajuan, jadwalTemplate, blockedDates }: Props) {
    const statusInfo = STATUS_MAP[pengajuan.status];
    const StatusIcon = statusInfo?.icon || Clock;
    const formatTime = (t: string | null) => t?.substring(0, 5) || t;

    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState('');

    const approveForm = useForm({ keterangan: '' });
    const rejectForm = useForm({ alasan_penolakan: '' });
    const cancelForm = useForm({ alasan_penolakan: '' });

    const generateSlots = (): Slot[] => {
        if (jadwalTemplate.length === 0) {
return [];
}

        const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const slots: Slot[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let d = 0; d < 14; d++) {
            const date = new Date(today);
            date.setDate(date.getDate() + d);
            const dayIndex = date.getDay();
            const dayName = dayNames[dayIndex];
            const template = jadwalTemplate.find((t) => t.hari === dayName);

            if (!template) {
continue;
}

            const dateStr = date.toISOString().split('T')[0];

            if (blockedDates.includes(dateStr)) {
continue;
}

            const jamMulai = parseInt(template.jam_mulai.substring(0, 2), 10);
            const jamSelesai = parseInt(template.jam_selesai.substring(0, 2), 10);

            for (let jam = jamMulai; jam < jamSelesai; jam++) {
                const time = String(jam).padStart(2, '0') + ':00';
                const timeEnd = String(jam + 1).padStart(2, '0') + ':00';
                const dd = String(date.getDate()).padStart(2, '0');
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const yyyy = date.getFullYear();
                slots.push({
                    date: dateStr,
                    day: dayName,
                    time,
                    time_end: timeEnd,
                    label: `${dayName}, ${dd}/${mm}/${yyyy} — ${time}-${timeEnd}`,
                });
            }
        }

        return slots;
    };

    const handleApprove = () => {
        if (!selectedSlot) {
return;
}

        const [date, time] = selectedSlot.split('|');
        router.post(guruBkRoutes.pengajuan.approve(pengajuan.id), {
            tgl_konseling: date,
            jam_konseling: time,
            keterangan: approveForm.data.keterangan || undefined,
        }, {
            onSuccess: () => {
 setApproveDialogOpen(false); approveForm.reset(); 
},
        });
    };

    const handleReject = () => {
        rejectForm.post(guruBkRoutes.pengajuan.reject(pengajuan.id), {
            onSuccess: () => {
                setRejectDialogOpen(false);
                rejectForm.reset();
            },
        });
    };

    const handleCancel = () => {
        cancelForm.post(guruBkRoutes.pengajuan.cancel(pengajuan.id), {
            onSuccess: () => {
                setCancelDialogOpen(false);
                cancelForm.reset();
            },
        });
    };

    return (
        <>
            <Head title="Detail Pengajuan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.get(guruBkRoutes.pengajuan.index)}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">Detail Pengajuan</h1>
                        <p className="text-muted-foreground">Informasi lengkap pengajuan konseling</p>
                    </div>
                    <Badge variant={statusInfo?.variant || 'default'} className="gap-1">
                        <StatusIcon className="size-3" />
                        {statusInfo?.label || pengajuan.status}
                    </Badge>
                </div>

                <div className="space-y-4">
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
                                    <p className="font-mono font-medium">{pengajuan.siswa.nis}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">Nama</p>
                                    <p className="font-medium">{pengajuan.siswa.nama}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">Jenis Kelamin</p>
                                    <p className="font-medium">{pengajuan.siswa.jenkel === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">Diajukan Oleh</p>
                                    <p className="font-medium">{pengajuan.diajukan_oleh === 'siswa' ? 'Siswa Sendiri' : 'Guru BK'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ScrollText className="size-5" />
                                Data Pengajuan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                <div>
                                    <p className="text-muted-foreground text-sm">Kategori</p>
                                    <p className="font-medium">{pengajuan.kategori.nama}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">Tanggal Pengajuan</p>
                                    <p className="font-medium">{pengajuan.tgl_pengajuan}</p>
                                </div>
                            </div>

                            {pengajuan.catatan && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-muted-foreground text-sm mb-1">Catatan Siswa</p>
                                        <p className="whitespace-pre-wrap">{pengajuan.catatan}</p>
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
                        </CardContent>
                    </Card>

                    {pengajuan.konseling && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="size-5" />
                                    Jadwal Konseling
                                </CardTitle>
                                <CardDescription>Informasi jadwal dan hasil konseling</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <p className="text-muted-foreground text-sm">Status</p>
                                        <Badge variant={pengajuan.konseling.status === 'selesai' ? 'default' : 'secondary'}>
                                            {pengajuan.konseling.status === 'selesai' ? 'Selesai' : 'Dijadwalkan'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-sm">Tanggal</p>
                                        <p className="font-medium">{pengajuan.konseling.tgl_konseling || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-sm">Jam</p>
                                        <p className="font-medium">{formatTime(pengajuan.konseling.jam_konseling) || '-'}</p>
                                    </div>
                                </div>
                                {pengajuan.konseling.keterangan && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-muted-foreground text-sm mb-1">Keterangan</p>
                                            <p>{pengajuan.konseling.keterangan}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {pengajuan.status === 'menunggu' && (
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button variant="destructive" onClick={() => {
 rejectForm.reset(); setRejectDialogOpen(true); 
}}>
                            <XCircle className="size-4" />
                            Tolak
                        </Button>
                        <Button onClick={() => {
 setSelectedSlot(''); approveForm.reset(); setApproveDialogOpen(true); 
}}>
                            <CheckCircle className="size-4" />
                            Setujui & Jadwalkan
                        </Button>
                    </div>
                )}
                {pengajuan.status === 'disetujui' && (
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button variant="destructive" onClick={() => {
 cancelForm.reset(); setCancelDialogOpen(true); 
}}>
                            <XOctagon className="size-4" />
                            Batalkan
                        </Button>
                    </div>
                )}
            </div>

            <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Setujui & Jadwalkan Konseling</DialogTitle>
                        <DialogDescription>
                            Setujui pengajuan dari <strong>{pengajuan.siswa.nama}</strong> dan pilih jadwal konseling.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Jadwal Tersedia *</Label>
                            {(() => {
                                const availableSlots = generateSlots();

                                return availableSlots.length === 0 ? (
                                    <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                                        Tidak ada jadwal tersedia. Atur ketersediaan di menu Ketersediaan terlebih dahulu.
                                    </div>
                                ) : (
                                    <div className="max-h-60 overflow-y-auto rounded-md border p-2 space-y-1">
                                        {availableSlots.map((s, i) => (
                                            <label
                                                key={i}
                                                className={`flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer transition-colors ${selectedSlot === `${s.date}|${s.time}` ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="slot"
                                                    value={`${s.date}|${s.time}`}
                                                    checked={selectedSlot === `${s.date}|${s.time}`}
                                                    onChange={(e) => setSelectedSlot(e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className={`size-4 rounded-full border-2 flex items-center justify-center ${selectedSlot === `${s.date}|${s.time}` ? 'border-primary-foreground' : 'border-muted-foreground'}`}>
                                                    {selectedSlot === `${s.date}|${s.time}` && <div className="size-2 rounded-full bg-primary-foreground" />}
                                                </div>
                                                <span className="text-sm">{s.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                        <div className="space-y-2">
                            <Label>Keterangan</Label>
                            <Textarea
                                value={approveForm.data.keterangan}
                                onChange={(e) => approveForm.setData('keterangan', e.target.value)}
                                placeholder="Keterangan tambahan (opsional)"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>Batal</Button>
                        <Button onClick={handleApprove} disabled={!selectedSlot}>
                            Setujui & Jadwalkan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Pengajuan</DialogTitle>
                        <DialogDescription>
                            Tolak pengajuan dari <strong>{pengajuan.siswa.nama}</strong>. Berikan alasan penolakan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label>Alasan Penolakan *</Label>
                        <Textarea
                            value={rejectForm.data.alasan_penolakan}
                            onChange={(e) => rejectForm.setData('alasan_penolakan', e.target.value)}
                            placeholder="Alasan penolakan..."
                            rows={3}
                        />
                        {rejectForm.errors.alasan_penolakan && <p className="text-destructive text-sm">{rejectForm.errors.alasan_penolakan}</p>}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Batal</Button>
                        <Button variant="destructive" onClick={handleReject} disabled={rejectForm.processing || !rejectForm.data.alasan_penolakan.trim()}>
                            {rejectForm.processing ? 'Menolak...' : 'Tolak'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Batalkan Pengajuan</DialogTitle>
                        <DialogDescription>
                            Batalkan pengajuan dari <strong>{pengajuan.siswa.nama}</strong>. Berikan alasan pembatalan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label>Alasan Pembatalan *</Label>
                        <Textarea
                            value={cancelForm.data.alasan_penolakan}
                            onChange={(e) => cancelForm.setData('alasan_penolakan', e.target.value)}
                            placeholder="Alasan pembatalan..."
                            rows={3}
                        />
                        {cancelForm.errors.alasan_penolakan && <p className="text-destructive text-sm">{cancelForm.errors.alasan_penolakan}</p>}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>Batal</Button>
                        <Button variant="destructive" onClick={handleCancel} disabled={cancelForm.processing || !cancelForm.data.alasan_penolakan.trim()}>
                            {cancelForm.processing ? 'Membatalkan...' : 'Batalkan Pengajuan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PengajuanShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengajuan', href: '/guru-bk/pengajuan' },
        { title: 'Detail', href: '#' },
    ],
};
