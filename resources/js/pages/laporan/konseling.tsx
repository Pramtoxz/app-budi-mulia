import { Head, router } from '@inertiajs/react';
import { Download, FileText, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
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

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Laporan {jenisLabel}</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Laporan {jenisLabel} {namaSekolah}
                            {filterMode ? ` - ${periodeLabel()}` : ''}
                        </p>
                    </div>
                    {data && (
                        <Button asChild className="bg-[#2A166F] hover:bg-[#3d1f8a]">
                            <a href={pdfUrl()} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                            </a>
                        </Button>
                    )}
                </div>

                <Card className="border-0 shadow-sm ring-1 ring-gray-200">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Kelas</label>
                                    <Select value={localKelas} onValueChange={setLocalKelas}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Semua Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Semua Kelas</SelectItem>
                                            {kelasList.map(k => (
                                                <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Kategori</label>
                                    <Select value={localKategori} onValueChange={setLocalKategori}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Semua Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Semua Kategori</SelectItem>
                                            {kategoriList.map(k => (
                                                <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <Button type="submit" disabled={!isFilterValid()} className="bg-[#2A166F] hover:bg-[#3d1f8a]">
                                    <Search className="w-4 h-4 mr-2" />
                                    Tampilkan Data
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {data ? (
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-900 w-16 text-center">No</th>
                                        {COLUMNS.map((col, i) => (
                                            <th key={i} className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.length > 0 ? (
                                        data.map((row, index) => (
                                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-center text-gray-500">{index + 1}</td>
                                                {FIELDS.map((field, i) => (
                                                    <td key={i} className="px-6 py-4">
                                                        {field === 'status' ? (
                                                            <Badge variant="outline" className="font-normal capitalize bg-white">
                                                                {String(row[field] || '-')}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-gray-600">{String(row[field] || '-')}</span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={COLUMNS.length + 1} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <FileText className="w-8 h-8 text-gray-300 mb-3" />
                                                    <p>Tidak ada data untuk periode ini</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                ) : (
                    <Card className="border-0 shadow-sm ring-1 ring-gray-200 border-dashed bg-gray-50/50">
                        <CardContent className="p-12 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center">
                                <Search className="w-10 h-10 text-gray-300 mb-4" />
                                <p className="text-base font-medium text-gray-900">Atur filter lalu tampilkan data</p>
                                <p className="mt-1">Pilih mode tanggal, bulan, atau tahun untuk melihat laporan</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
