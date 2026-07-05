import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Footer from '@/components/welcome/footer';
import Header from '@/components/welcome/header';

interface AuthorData { id: number; name: string; }
interface ArtikelData {
    id: number; judul: string; slug: string; isi: string; gambar: string | null; published_at: string | null; created_at: string; author: AuthorData;
}
interface Props { artikel: ArtikelData; }

export default function PublikArtikelShow({ artikel }: Props) {
    return (
        <>
            <Head title={`${artikel.judul} — SMP IT Budi Mulia`} />
            <Header />
            <main className="pt-20">
                <section className="bg-[#FAFAF9] py-12 sm:py-16">
                    <div className="mx-auto max-w-3xl px-4">
                        <div className="mb-6">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/artikel">
                                    <ArrowLeft className="size-3.5" />
                                    Kembali
                                </Link>
                            </Button>
                        </div>

                        <article>
                            <h1 className="mb-3 text-2xl font-bold text-[#2A166F] sm:text-3xl">{artikel.judul}</h1>
                            <p className="mb-6 text-sm text-stone-400">
                                {artikel.author.name} · {artikel.published_at || artikel.created_at}
                            </p>

                            {artikel.gambar && (
                                <div className="mb-8 overflow-hidden rounded-2xl">
                                    <img src={`/storage/${artikel.gambar}`} alt={artikel.judul} className="w-full object-cover" />
                                </div>
                            )}

                            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-stone-600">
                                {artikel.isi}
                            </div>
                        </article>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
