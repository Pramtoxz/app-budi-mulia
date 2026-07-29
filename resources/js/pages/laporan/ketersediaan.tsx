import { Head, router } from '@inertiajs/react';
import { Download, Search, FileText } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
    jenisLabel: string;
    data: Record<string, unknown>[];
    guruBkList: { id: number; name: string }[];
    role: 'guru_bk' | 'kepala_sekolah';
    baseUrl: string;
    namaSekolah: string;
    filterGuruBkId: string | null;
}

const COLUMNS = ['Nama Guru BK', 'Hari', 'Jam Mulai', 'Jam Selesai'];
const FIELDS  = ['nama_guru_bk', 'hari', 'jam_mulai', 'jam_selesai'];
const NONE    = '__none__';

// ─── Page Component ───────────────────────────────────────────────────────────

export default function LaporanKetersediaan({
    jenisLabel,
    data,
    guruBkList,
    baseUrl,
    filterGuruBkId,
}: Props) {
    const [localGuruBkId, setLocalGuruBkId] = useState(filterGuruBkId ?? NONE);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};
        if (localGuruBkId !== NONE) params.guru_bk_id = localGuruBkId;
        router.get(`${baseUrl}/laporan/ketersediaan`, params, { preserveScroll: true });
    };

    const pdfUrl = () => {
        const p = new URLSearchParams();
        if (filterGuruBkId) p.set('guru_bk_id', filterGuruBkId);
        return `${baseUrl}/laporan/ketersediaan/pdf${p.toString() ? `?${p.toString()}` : ''}`;
    };

    return (
        <>
            <Head title={jenisLabel} />
            <div className="flex h-full flex-1 flex-col gap-5 p-4 overflow-x-auto">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{jenisLabel}</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            {data.length} data ditemukan
                        </p>
                    </div>
                    {data.length > 0 && (
                        <a href={pdfUrl()} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg bg-[#2A166F] px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#3d1f8a] transition-colors shrink-0">
                            <Download className="size-4" /> Export PDF
                        </a>
                    )}
                </div>

                <Card className="border-border/60">
                    <CardContent className="pt-5 pb-4">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-wrap gap-3 items-end">
                                <div className="flex flex-col gap-1.5 min-w-[200px]">
                                    <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Guru BK</label>
                                    <Select value={localGuruBkId} onValueChange={setLocalGuruBkId}>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Semua Guru BK" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Semua Guru BK</SelectItem>
                                            {guruBkList.map((g) => (<SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" className="gap-2 bg-[#2A166F] hover:bg-[#3d1f8a] text-white">
                                    <Search className="size-4" /> Tampilkan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {data.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
                            <FileText className="size-12 text-muted-foreground/30" />
                            <div>
                                <p className="font-semibold">Tidak ada data</p>
                                <p className="text-sm text-muted-foreground mt-1">Tidak ada data yang tersedia untuk filter saat ini.</p>
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
