import { BookOpen, Users, Globe, CreditCard, Trophy, Heart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface KegiatanItem {
    icon: LucideIcon;
    judul: string;
    deskripsi: string;
}

const kegiatan: KegiatanItem[] = [
    {
        icon: Heart,
        judul: 'Praktik Manasik Haji',
        deskripsi: 'Program unggulan untuk siswa kelas 7 dan 8 sebagai pembiasaan ibadah haji sejak dini.',
    },
    {
        icon: Users,
        judul: 'Sholat Berjamaah',
        deskripsi: 'Pembiasaan sholat berjamaah setiap hari untuk menumbuhkan kedisiplinan dan ketakwaan.',
    },
    {
        icon: Globe,
        judul: 'English Day',
        deskripsi: 'Pembiasaan berkomunikasi dalam bahasa Inggris setiap hari untuk meningkatkan kemampuan bahasa.',
    },
    {
        icon: CreditCard,
        judul: 'Absensi Digital',
        deskripsi: 'Penerapan absensi siswa berbasis tap kartu / kokarde digital untuk efisiensi dan akurasi.',
    },
    {
        icon: Trophy,
        judul: 'Forum Annisa\' Jumat',
        deskripsi: 'Forum kajian keislaman setiap hari Jumat untuk memperdalam pemahaman agama siswa.',
    },
    {
        icon: BookOpen,
        judul: 'Ekstrakurikuler',
        deskripsi: 'Pilihan pengembangan bakat: Futsal, Arabic Club, English Club, Seni Tari, Pencak Silat, Drumband, Pramuka.',
    },
];

export default function Kegiatan() {
    return (
        <section id="kegiatan" className="bg-white py-16 sm:py-24">
            <div className="mx-auto max-w-5xl px-4">
                <div className="mb-12 text-center">
                    <div className="mx-auto mb-4 h-1 w-12 bg-[#F9C301]" />
                    <h2 className="text-2xl font-bold text-[#2A166F] sm:text-3xl">Kegiatan Unggulan</h2>
                    <p className="mt-2 text-sm text-stone-500">Program dan kegiatan yang menjadi ciri khas sekolah</p>
                </div>

                <div className="space-y-8 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-12 sm:gap-y-10">
                    {kegiatan.map((item, i) => {
                        const Icon = item.icon;
                        const isEven = i % 2 === 0;

                        return (
                            <div
                                key={item.judul}
                                className={`group flex gap-4 ${
                                    !isEven ? 'sm:flex-row-reverse sm:text-right' : ''
                                }`}
                            >
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#2A166F]/5 transition-colors group-hover:bg-[#2A166F]/10">
                                    <Icon className="size-5 text-[#2A166F]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-stone-900">{item.judul}</h3>
                                    <p className="mt-1 text-xs leading-relaxed text-stone-500">{item.deskripsi}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
