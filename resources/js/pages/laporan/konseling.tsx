import { Head, router } from '@inertiajs/react';
import { Download, FileText, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateFilter, type FilterMode } from './components/DateFilter';

const BULAN_NAMES: Record<string, string> = {
    '1': 'Januari', '2': 'Februari', '3': 'Maret', '4': 'April',
    '5': 'Mei', '6': 'Juni', '7': 'Juli', '8': 'Agustus',
    '9': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember',
};

const COLUMNS = ['Tanggal', 'Jam', 'NIS', 'Nama Siswa', 'Kelas', 'Kategori', 'Status', 'Keterangan'];
const FIELDS = ['tanggal', 'jam', 'nis', 'nama_siswa', 'kelas', 'kategori', 'status', 'keterangan'];
const NONE = '__none__';

interface Props {
    jenisLabel: string;
    data: Record<string, unknown>[] | null;
    kelasList: { id: number; nama: string }[];
    kategoriList: { id: number; nama: string }[];
    role: 'guru_bk' | 'kepala_sekolah';
    baseUrl: string;
    namaSekolah: string;
    filterMode: FilterMode | null;
    filterTanggalDari: string | null;
    filterTanggalSampai: string | null;
    filterBulan: string | null;
    filterTahun: string | null;
    filterKelasId: string | null;
    filterKategoriId: string | null;
}

export default function LaporanKonseling({
    jenisLabel,
    data,
    kelasList,
    kategoriList,
    role,
    baseUrl,
    namaSekolah,
    filterMode,
    filterTanggalDari,
    filterTanggalSampai,
    filterBulan,
    filterTahun,
    filterKelasId,
    filterKategoriId,
}: Props) {
    const [localMode, setLocalMode] = useState<FilterMode>(filterMode ?? 'tanggal');
    const [localTanggalDari, setLocalTanggalDari] = useState(filterTanggalDari ?? '');
    const [localTanggalSampai, setLocalTanggalSampai] = useState(filterTanggalSampai ?? '');
    const [localBulan, setLocalBulan] = useState(filterBulan ?? '');
    const [localTahun, setLocalTahun] = useState(filterTahun ?? '');
    const [localKelas, setLocalKelas] = useState(filterKelasId ?? NONE);
    const [localKategori, setLocalKategori] = useState(filterKategoriId ?? NONE);

    const isFilterValid = () => {
        switch (localMode) {
            case 'tanggal': return !!localTanggalDari && !!localTanggalSampai;
            case 'bulan': return !!localBulan && localTahun.length === 4;
            case 'tahun': return localTahun.length === 4;
            default: return false;
        }
    };

    const periodeLabel = () => {
        if (!filterMode) return '';
        switch (filterMode) {
            case 'tanggal': return `Dari ${filterTanggalDari} s/d ${filterTanggalSampai}`;
            case 'bulan': return `Bulan ${BULAN_NAMES[filterBulan ?? ''] ?? ''} ${filterTahun}`;
            case 'tahun': return `Tahun ${filterTahun}`;
            default: return '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFilterValid()) return;
        const params: Record<string, string> = {
            filter_mode: localMode,
            tanggal_dari: localTanggalDari,
            tanggal_sampai: localTanggalSampai,
            bulan: localBulan,
            tahun: localTahun,
        };
        if (localKelas !== NONE) params.kelas_id = localKelas;
        if (localKategori !== NONE) params.kategori_id = localKategori;
        
        router.get(`${baseUrl}/laporan/konseling`, params, { preserveScroll: true });
    };

    const pdfUrl = () => {
        if (!filterMode) return '#';
        const p = new URLSearchParams({
            filter_mode: filterMode,
            tanggal_dari: filterTanggalDari ?? '',
            tanggal_sampai: filterTanggalSampai ?? '',
            bulan: filterBulan ?? '',
            tahun: filterTahun ?? '',
        });
        if (filterKelasId) p.set('kelas_id', filterKelasId);
        if (filterKategoriId) p.set('kategori_id', filterKategoriId);
        
        return `${baseUrl}/laporan/konseling/pdf?${p.toString()}`;
    };

    return (
        <>
            <Head title={`Laporan ${jenisLabel}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{jenisLabel}</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            Laporan {jenisLabel} {namaSekolah}
                            {filterMode ? ` — ${periodeLabel()}` : ''}
                        </p>
                    </div>
                    {data && data.length > 0 && (
                        <a href={pdfUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-[#2A166F] px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#3d1f8a] transition-colors shrink-0">
                            <Download className="size-4" /> Export PDF
                        </a>
                    )}
                </div>

                <Card className="border-border/60">
                    <CardContent className="pt-5 pb-4">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-wrap gap-3 items-end">
                                <DateFilter
                                    mode={localMode}
                                    onModeChange={setLocalMode}
                                    tanggalDari={localTanggalDari}
                                    onTanggalDariChange={setLocalTanggalDari}
                                    tanggalSampai={localTanggalSampai}
                                    onTanggalSampaiChange={setLocalTanggalSampai}
                                    bulan={localBulan}
                                    onBulanChange={setLocalBulan}
                                    tahun={localTahun}
                                    onTahunChange={setLocalTahun}
                                />

                                <div className="flex flex-col gap-1.5 min-w-[160px]">
                                    <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Kelas</label>
                                    <Select value={localKelas} onValueChange={setLocalKelas}>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Semua Kelas" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Semua Kelas</SelectItem>
                                            {kelasList.map(k => (<SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-1.5 min-w-[160px]">
                                    <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Kategori</label>
                                    <Select value={localKategori} onValueChange={setLocalKategori}>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Semua Kategori" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Semua Kategori</SelectItem>
                                            {kategoriList.map(k => (<SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button type="submit" disabled={!isFilterValid()} className="gap-2 bg-[#2A166F] hover:bg-[#3d1f8a] text-white">
                                    <Search className="size-4" /> Tampilkan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {data && data.length > 0 ? (
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
                ) : (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
                            <FileText className="size-12 text-muted-foreground/30" />
                            <div>
                                <p className="font-semibold text-muted-foreground">{data === null ? 'Atur filter lalu tampilkan data' : 'Tidak ada data'}</p>
                                <p className="text-sm text-muted-foreground/60 mt-1">{data === null ? 'Pilih filter untuk melihat laporan' : 'Tidak ada data untuk filter saat ini.'}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
