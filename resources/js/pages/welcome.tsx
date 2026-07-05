import { Head } from '@inertiajs/react';

import ArtikelSection from '@/components/welcome/artikel-section';
import Footer from '@/components/welcome/footer';
import Header from '@/components/welcome/header';
import Hero from '@/components/welcome/hero';
import Kegiatan from '@/components/welcome/kegiatan';
import PengumumanSection from '@/components/welcome/pengumuman-section';
import Statistik from '@/components/welcome/statistik';
import Tentang from '@/components/welcome/tentang';

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

interface PengumumanData {
    id: number;
    judul: string;
    isi: string;
    prioritas: string;
    published_at: string | null;
    tgl_berlaku: string | null;
}

interface Props {
    artikel: ArtikelData[];
    pengumuman: PengumumanData[];
}

export default function Welcome({ artikel, pengumuman }: Props) {
    return (
        <>
            <Head title="SMP IT Budi Mulia — Padang" />
            <Header />
            <main>
                <Hero />
                <Statistik />
                <Tentang />
                <Kegiatan />
                <PengumumanSection data={pengumuman} />
                <ArtikelSection data={artikel} />
            </main>
            <Footer />
        </>
    );
}
