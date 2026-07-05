import { router } from '@inertiajs/react';
import { BookOpen, ArrowRight } from 'lucide-react';

interface AuthorData {
    id: number;
    name: string;
}

interface ArtikelData {
    id: number;
    judul: string;
    slug: string;
    isi: string;
    gambar: string | null;
    published_at: string | null;
    author: AuthorData;
}

interface Props {
    data: ArtikelData[];
}

export default function ArtikelSection({ data }: Props) {
    if (data.length === 0) {
return null;
}

    const [featured, ...rest] = data;

    return (
        <section id="artikel" className="bg-white py-16 sm:py-24">
            <div className="mx-auto max-w-5xl px-4">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 h-1 w-12 bg-[#F9C301]" />
                    <h2 className="text-2xl font-bold text-[#2A166F] sm:text-3xl">Artikel</h2>
                    <p className="mt-2 text-sm text-stone-500">Bacaan bimbingan dan konseling</p>
                </div>

                <div
                    className="group mb-6 cursor-pointer overflow-hidden rounded-2xl bg-stone-50 shadow-sm transition-shadow hover:shadow-lg sm:grid sm:grid-cols-2"
                    onClick={() => router.get(`/artikel/${featured.slug}`)}
                >
                    {featured.gambar ? (
                        <div className="h-48 overflow-hidden sm:h-auto">
                            <img
                                src={`/storage/${featured.gambar}`}
                                alt={featured.judul}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    ) : (
                        <div className="flex h-48 items-center justify-center bg-gradient-to-br from-[#2A166F] to-purple-700 sm:h-auto">
                            <BookOpen className="size-12 text-white/20" />
                        </div>
                    )}
                    <div className="flex flex-col justify-center p-6">
                        <h3 className="mb-2 text-lg font-bold text-stone-900 sm:text-xl">{featured.judul}</h3>
                        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-stone-500">{featured.isi}</p>
                        <p className="text-xs text-stone-400">{featured.author.name} · {featured.published_at}</p>
                    </div>
                </div>

                {rest.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {rest.map((a) => (
                            <article
                                key={a.id}
                                className="group cursor-pointer overflow-hidden rounded-xl bg-stone-50 shadow-sm transition-shadow hover:shadow-md"
                                onClick={() => router.get(`/artikel/${a.slug}`)}
                            >
                                {a.gambar ? (
                                    <div className="h-36 overflow-hidden">
                                        <img
                                            src={`/storage/${a.gambar}`}
                                            alt={a.judul}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#2A166F]/10 to-purple-100">
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

                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.get('/artikel')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#2A166F] transition-colors hover:text-[#F9C301]"
                    >
                        Lihat Semua Artikel
                        <ArrowRight className="size-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}
