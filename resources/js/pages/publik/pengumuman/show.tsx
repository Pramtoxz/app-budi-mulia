import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Footer from '@/components/welcome/footer';
import Header from '@/components/welcome/header';

interface PengumumanData {
    id: number; judul: string; slug: string; isi: string; prioritas: string; published_at: string | null; tgl_berlaku: string | null;
}
interface Props { pengumuman: PengumumanData; }

const PRIORITAS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
    tinggi: { bg: 'bg-red-50', text: 'text-red-700', label: 'Tinggi' },
    sedang: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Sedang' },
    rendah: { bg: 'bg-stone-100', text: 'text-stone-600', label: 'Rendah' },
};

export default function PublikPengumumanShow({ pengumuman }: Props) {
    const style = PRIORITAS_STYLE[pengumuman.prioritas] || PRIORITAS_STYLE.rendah;

    return (
        <>
            <Head title={`${pengumuman.judul} — SMP IT Budi Mulia`} />
            <Header />
            <main className="pt-20">
                <section className="bg-[#FAFAF9] py-12 sm:py-16">
                    <div className="mx-auto max-w-3xl px-4">
                        <div className="mb-6">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/pengumuman">
                                    <ArrowLeft className="size-3.5" />
                                    Kembali
                                </Link>
                            </Button>
                        </div>

                        <article>
                            <div className="mb-4 flex items-center gap-3">
                                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${style.text} ${style.bg}`}>
                                    {style.label}
                                </span>
                            </div>
                            <h1 className="mb-3 text-2xl font-bold text-[#2A166F] sm:text-3xl">{pengumuman.judul}</h1>
                            <p className="mb-8 text-sm text-stone-400">
                                {pengumuman.published_at}
                                {pengumuman.tgl_berlaku && ` · Berlaku: ${pengumuman.tgl_berlaku}`}
                            </p>

                            <div className="whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                                {pengumuman.isi}
                            </div>
                        </article>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
