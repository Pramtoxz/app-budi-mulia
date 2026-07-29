import { Head, router } from '@inertiajs/react';
import { Download, FileText, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// ─── Tahun Ajaran Input ───────────────────────────────────────────────────────

function TahunAjaranInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [t1, setT1] = useState(value ? value.split('/')[0] ?? '' : '');
    const [t2, setT2] = useState(value ? value.split('/')[1] ?? '' : '');
    const ref2 = useRef<HTMLInputElement>(null);

    useEffect(() => { if (!value) { setT1(''); setT2(''); } }, [value]);

    const handleT1 = (v: string) => {
        const clean = v.replace(/\D/g, '').slice(0, 4);
        setT1(clean);
        if (clean.length === 4) {
            const next = String(parseInt(clean) + 1);
            setT2(next);
            onChange(`${clean}/${next}`);
            setTimeout(() => ref2.current?.focus(), 0);
        } else { onChange(''); }
    };

    const handleT2 = (v: string) => {
        const clean = v.replace(/\D/g, '').slice(0, 4);
        setT2(clean);
        if (clean.length === 4 && t1.length === 4) { onChange(`${t1}/${clean}`); }
        else { onChange(''); }
    };

    const baseClass = 'w-20 rounded-lg border border-input bg-background px-3 py-2 text-sm text-center font-mono tracking-widest outline-none transition focus:border-[#2A166F] focus:ring-1 focus:ring-[#2A166F]/20';

    return (
        <div className="flex items-center gap-1.5">
            <input type="text" inputMode="numeric" maxLength={4} value={t1} onChange={(e) => handleT1(e.target.value)} placeholder="2025" className={baseClass} id="tahun1" />
            <span className="text-muted-foreground font-bold">/</span>
            <input ref={ref2} type="text" inputMode="numeric" maxLength={4} value={t2} onChange={(e) => handleT2(e.target.value)} placeholder="2026" className={baseClass} id="tahun2" />
        </div>
    );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface KelasItem { id: number; nama: string; }

interface Props {
    jenisLabel: string;
    tahunAjaran: string | null;
    data: Record<string, unknown>[] | null;
    kelasList: KelasItem[];
    role: 'guru_bk' | 'kepala_sekolah';
    baseUrl: string;
    namaSekolah: string;
    filterKelasId: string | null;
    filterStatus: string | null;
}

const COLUMNS = ['NIS', 'Nama', 'Kelas Asal', 'Status', 'Keterangan'];
const FIELDS  = ['nis', 'nama', 'kelas_asal', 'status', 'keterangan'];
const NONE    = '__none__';

const STATUS_OPTIONS = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'lulus', label: 'Lulus' },
    { value: 'pindah_sekolah', label: 'Pindah Sekolah' },
    { value: 'keluar', label: 'Keluar' },
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function LaporanSiswaKelas({
    jenisLabel,
    tahunAjaran,
    data,
    kelasList,
    baseUrl,
    filterKelasId,
    filterStatus,
}: Props) {
    const [localTa, setLocalTa] = useState(tahunAjaran ?? '');
    const [localKelasId, setLocalKelasId] = useState(filterKelasId ?? NONE);
    const [localStatus, setLocalStatus] = useState(filterStatus ?? NONE);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!localTa || localTa.split('/').length !== 2) return;
        const params: Record<string, string> = { tahun_ajaran: localTa };
        if (localKelasId !== NONE) params.kelas_id = localKelasId;
        if (localStatus !== NONE) params.status = localStatus;
        router.get(`${baseUrl}/laporan/siswa-kelas`, params, { preserveScroll: true });
    };

    const pdfUrl = () => {
        if (!tahunAjaran) return '#';
        const p = new URLSearchParams({ tahun_ajaran: tahunAjaran });
        if (filterKelasId) p.set('kelas_id', filterKelasId);
        if (filterStatus) p.set('status', filterStatus);
        return `${baseUrl}/laporan/siswa-kelas/pdf?${p.toString()}`;
    };

    return (
        <>
            <Head title={jenisLabel} />
            <div className="flex h-full flex-1 flex-col gap-5 p-4 overflow-x-auto">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{jenisLabel}</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            {data !== null ? `${data.length} data ditemukan — Tahun Ajaran ${tahunAjaran}` : 'Atur filter lalu tampilkan data'}
                        </p>
                    </div>
                    {data !== null && data.length > 0 && (
                        <a href={pdfUrl()} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg bg-[#2A166F] px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#3d1f8a] transition-colors shrink-0">
                            <Download className="size-4" /> Export PDF
                        </a>
                    )}
                </div>

                <Card className="border-border/60">
                    <CardContent className="pt-5 pb-4">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-wrap gap-3 items-end">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Tahun Ajaran <span className="text-destructive">*</span></label>
                                    <TahunAjaranInput value={localTa} onChange={setLocalTa} />
                                </div>
                                <div className="flex flex-col gap-1.5 min-w-[160px]">
                                    <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Kelas</label>
                                    <Select value={localKelasId} onValueChange={setLocalKelasId}>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Semua Kelas" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Semua Kelas</SelectItem>
                                            {kelasList.map((k) => (<SelectItem key={k.id} value={String(k.id)}>{k.nama}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-1.5 min-w-[160px]">
                                    <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Status</label>
                                    <Select value={localStatus} onValueChange={setLocalStatus}>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Semua Status</SelectItem>
                                            {STATUS_OPTIONS.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" disabled={!localTa || localTa.split('/').length !== 2 || localTa.split('/').some(p => p.length !== 4)} className="gap-2 bg-[#2A166F] hover:bg-[#3d1f8a] text-white">
                                    <Search className="size-4" /> Tampilkan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {data === null ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
                            <FileText className="size-12 text-muted-foreground/30" />
                            <div>
                                <p className="font-semibold text-muted-foreground">Belum ada data ditampilkan</p>
                                <p className="text-sm text-muted-foreground/60 mt-1">Isi tahun ajaran dan klik Tampilkan</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : data.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
                            <FileText className="size-12 text-muted-foreground/30" />
                            <div>
                                <p className="font-semibold">Tidak ada data</p>
                                <p className="text-sm text-muted-foreground mt-1">Tidak ada data untuk tahun ajaran <Badge variant="outline">{tahunAjaran}</Badge></p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="rounded-xl border border-border/60 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-[#2A166F]">
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-white/90 uppercase tracking-wider w-12">No</th>
                                        {COLUMNS.map((col) => (<th key={col} className="text-left px-4 py-3 text-xs font-semibold text-white/90 uppercase tracking-wider whitespace-nowrap">{col}</th>))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row, i) => (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-background hover:bg-muted/40 transition-colors' : 'bg-muted/20 hover:bg-muted/50 transition-colors'}>
                                            <td className="px-4 py-3 font-bold text-[#2A166F] text-center">{i + 1}</td>
                                            {FIELDS.map((field) => (<td key={field} className="px-4 py-3 text-foreground/80 whitespace-nowrap max-w-[240px] truncate" title={String(row[field] ?? '-')}>{String(row[field] ?? '-')}</td>))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-4 py-2.5 border-t border-border/60 bg-muted/20 text-xs text-muted-foreground">Total: <span className="font-semibold text-foreground">{data.length}</span> data</div>
                    </div>
                )}
            </div>
        </>
    );
}
