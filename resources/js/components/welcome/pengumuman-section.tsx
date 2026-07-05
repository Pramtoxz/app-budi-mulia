import { router } from '@inertiajs/react';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface PengumumanData {
    id: number;
    judul: string;
    slug: string;
    isi: string;
    prioritas: string;
    published_at: string | null;
    tgl_berlaku: string | null;
}

interface Props {
    data: PengumumanData[];
}

const PRIORITAS_STYLE: Record<string, { bg: string; text: string; border: string }> = {
    tinggi: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    sedang: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    rendah: { bg: 'bg-stone-50', text: 'text-stone-600', border: 'border-stone-200' },
};

export default function PengumumanSection({ data }: Props) {
    if (data.length === 0) {
return null;
}

    return (
        <section id="pengumuman" className="bg-[#FAFAF9] py-16 sm:py-24">
            <div className="mx-auto max-w-5xl px-4">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 h-1 w-12 bg-[#F9C301]" />
                    <h2 className="text-2xl font-bold text-[#2A166F] sm:text-3xl">Pengumuman</h2>
                    <p className="mt-2 text-sm text-stone-500">Informasi terbaru dari sekolah</p>
                </div>

                <div className="space-y-3">
                    {data.map((p) => {
                        const style = PRIORITAS_STYLE[p.prioritas] || PRIORITAS_STYLE.rendah;

                        return (
                            <div
                                key={p.id}
                                className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-shadow hover:shadow-md ${style.border} ${style.bg}`}
                                onClick={() => router.get(`/pengumuman/${p.slug}`)}
                            >
                                <div className={`mt-0.5 shrink-0 rounded-lg p-1.5 ${style.bg}`}>
                                    <AlertCircle className={`size-4 ${style.text}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-sm font-semibold text-stone-900">{p.judul}</h3>
                                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.text} ${style.bg}`}>
                                            {p.prioritas.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500">{p.isi}</p>
                                    <p className="mt-2 text-[10px] text-stone-400">
                                        {p.published_at}{p.tgl_berlaku && ` · Berlaku: ${p.tgl_berlaku}`}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.get('/pengumuman')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#2A166F] transition-colors hover:text-[#F9C301]"
                    >
                        Lihat Semua Pengumuman
                        <ArrowRight className="size-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}
