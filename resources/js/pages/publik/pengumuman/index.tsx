import { Head, router } from '@inertiajs/react';
import { Newspaper, ArrowLeft, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Footer from '@/components/welcome/footer';
import Header from '@/components/welcome/header';

interface PengumumanData {
    id: number; judul: string; slug: string; isi: string; prioritas: string; published_at: string | null; tgl_berlaku: string | null;
}
interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
interface Props { pengumuman: Paginated<PengumumanData>; }

const PRIORITAS_STYLE: Record<string, { bg: string; text: string; border: string }> = {
    tinggi: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    sedang: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    rendah: { bg: 'bg-stone-50', text: 'text-stone-600', border: 'border-stone-200' },
};

export default function PublikPengumumanIndex({ pengumuman }: Props) {
    return (
        <>
            <Head title="Pengumuman — SMP IT Budi Mulia" />
            <Header />
            <main className="pt-20">
                <section className="bg-[#FAFAF9] py-12 sm:py-16">
                    <div className="mx-auto max-w-3xl px-4">
                        <div className="mb-8 flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => router.get('/')}>
                                <ArrowLeft className="size-4" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-[#2A166F]">Pengumuman</h1>
                                <p className="text-sm text-stone-500">Informasi terbaru dari sekolah</p>
                            </div>
                        </div>

                        {pengumuman.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Newspaper className="size-12 text-stone-300" />
                                <h3 className="mt-4 text-lg font-semibold text-stone-700">Belum ada pengumuman</h3>
                                <p className="text-sm text-stone-400">Pengumuman akan segera tersedia</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pengumuman.data.map((p) => {
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
                        )}

                        {pengumuman.last_page > 1 && (
                            <div className="mt-8 flex items-center justify-between">
                                <p className="text-sm text-stone-400">
                                    Halaman {pengumuman.current_page} dari {pengumuman.last_page}
                                </p>
                                <div className="flex gap-1">
                                    {pengumuman.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
