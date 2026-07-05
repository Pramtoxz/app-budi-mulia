import { Head, router } from '@inertiajs/react';
import { BookOpen, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Footer from '@/components/welcome/footer';
import Header from '@/components/welcome/header';

interface AuthorData { id: number; name: string; }
interface ArtikelData {
    id: number; judul: string; slug: string; isi: string; gambar: string | null; published_at: string | null; author: AuthorData;
}
interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
interface Props { artikel: Paginated<ArtikelData>; }

export default function PublikArtikelIndex({ artikel }: Props) {
    return (
        <>
            <Head title="Artikel — SMP IT Budi Mulia" />
            <Header />
            <main className="pt-20">
                <section className="bg-[#FAFAF9] py-12 sm:py-16">
                    <div className="mx-auto max-w-5xl px-4">
                        <div className="mb-8 flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => router.get('/')}>
                                <ArrowLeft className="size-4" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-[#2A166F]">Artikel</h1>
                                <p className="text-sm text-stone-500">Bacaan bimbingan dan konseling</p>
                            </div>
                        </div>

                        {artikel.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <BookOpen className="size-12 text-stone-300" />
                                <h3 className="mt-4 text-lg font-semibold text-stone-700">Belum ada artikel</h3>
                                <p className="text-sm text-stone-400">Artikel akan segera tersedia</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {artikel.data.map((a) => (
                                    <article
                                        key={a.id}
                                        className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
                                        onClick={() => router.get(`/artikel/${a.slug}`)}
                                    >
                                        {a.gambar ? (
                                            <div className="h-40 overflow-hidden">
                                                <img src={`/storage/${a.gambar}`} alt={a.judul} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            </div>
                                        ) : (
                                            <div className="flex h-40 items-center justify-center bg-gradient-to-br from-[#2A166F]/10 to-purple-100">
                                                <BookOpen className="size-8 text-[#2A166F]/20" />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-stone-900">{a.judul}</h3>
                                            <p className="line-clamp-2 text-xs leading-relaxed text-stone-500">{a.isi}</p>
                                            <p className="mt-2 text-[10px] text-stone-400">{a.author.name} · {a.published_at}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {artikel.last_page > 1 && (
                            <div className="mt-8 flex items-center justify-between">
                                <p className="text-sm text-stone-400">
                                    Halaman {artikel.current_page} dari {artikel.last_page}
                                </p>
                                <div className="flex gap-1">
                                    {artikel.links.map((link, i) => (
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
