import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export type FilterMode = 'tanggal' | 'bulan' | 'tahun';

interface DateFilterProps {
    mode: FilterMode;
    onModeChange: (mode: FilterMode) => void;
    tanggalDari: string;
    tanggalSampai: string;
    bulan: string;
    tahun: string;
    onTanggalDariChange: (v: string) => void;
    onTanggalSampaiChange: (v: string) => void;
    onBulanChange: (v: string) => void;
    onTahunChange: (v: string) => void;
}

const BULAN_OPTIONS = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
];

const MODE_OPTIONS = [
    { value: 'tanggal', label: 'Tanggal' },
    { value: 'bulan', label: 'Bulan & Tahun' },
    { value: 'tahun', label: 'Tahun' },
];

const labelClass = 'text-xs font-semibold text-foreground/70 uppercase tracking-wide';

export function DateFilter({
    mode,
    onModeChange,
    tanggalDari,
    tanggalSampai,
    bulan,
    tahun,
    onTanggalDariChange,
    onTanggalSampaiChange,
    onBulanChange,
    onTahunChange,
}: DateFilterProps) {
    return (
        <>
            <div className="flex flex-col gap-1.5 min-w-[160px]">
                <label className={labelClass}>Filter Berdasarkan</label>
                <Select value={mode} onValueChange={(v) => onModeChange(v as FilterMode)}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {MODE_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {mode === 'tanggal' && (
                <>
                    <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>Dari</label>
                        <Input
                            type="date"
                            value={tanggalDari}
                            onChange={(e) => onTanggalDariChange(e.target.value)}
                            className="w-[160px]"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>Sampai</label>
                        <Input
                            type="date"
                            value={tanggalSampai}
                            onChange={(e) => onTanggalSampaiChange(e.target.value)}
                            className="w-[160px]"
                        />
                    </div>
                </>
            )}

            {mode === 'bulan' && (
                <>
                    <div className="flex flex-col gap-1.5 min-w-[160px]">
                        <label className={labelClass}>Bulan</label>
                        <Select value={bulan} onValueChange={onBulanChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Bulan" />
                            </SelectTrigger>
                            <SelectContent>
                                {BULAN_OPTIONS.map((b) => (
                                    <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>Tahun</label>
                        <Input
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            value={tahun}
                            onChange={(e) => onTahunChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="2026"
                            className="w-24 font-mono text-center"
                        />
                    </div>
                </>
            )}

            {mode === 'tahun' && (
                <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Tahun</label>
                    <Input
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        value={tahun}
                        onChange={(e) => onTahunChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="2026"
                        className="w-24 font-mono text-center"
                    />
                </div>
            )}
        </>
    );
}
