import { MapPin, Phone, Mail, Instagram } from 'lucide-react';

export default function Tentang() {
    return (
        <section id="tentang" className="bg-[#FAFAF9] py-16 sm:py-24">
            <div className="mx-auto max-w-6xl px-4">
                <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{ transform: 'rotate(-2deg)' }}>
                            <img
                                src="/images/it2.jpg"
                                alt="Gedung SMP IT Budi Mulia"
                                className="aspect-[4/5] w-full object-cover object-center sm:aspect-[3/4]"
                            />
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
                        </div>
                        <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-[#F9C301]/20 blur-2xl" />
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="mb-6 h-1 w-12 bg-[#F9C301]" />
                        <h2 className="mb-2 text-2xl font-bold text-[#2A166F] sm:text-3xl">Tentang Sekolah</h2>
                        <p className="mb-6 text-xs font-medium uppercase tracking-widest text-[#F9C301]">SMP IT Budi Mulia Padang</p>

                        <div className="space-y-4 text-sm leading-relaxed text-stone-600">
                            <p>
                                SMP Islam Terpadu Budi Mulia adalah sekolah swasta Islam yang berada di bawah
                                naungan Yayasan Budi Mulia Padang. Berlokasi strategis di Kecamatan Padang Timur,
                                sekolah ini berdampingan langsung dengan Masjid Nurul Amin.
                            </p>
                            <p>
                                Dengan fokus pada pembentukan generasi Islami yang Qur'ani, sekolah ini
                                mengintegrasikan kurikulum nasional dengan program keagamaan unggulan seperti
                                Praktik Manasik Haji, Sholat Berjamaah, dan Forum Annisa' Jumat.
                            </p>
                        </div>

                        <div className="mt-8 space-y-3 border-t border-stone-200 pt-6">
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-[#F9C301]" />
                                <p className="text-xs leading-relaxed text-stone-500">
                                    Jl. Baru Andalas, Tepi Banda Bakali, Kel. Simpang Haru,
                                    Kec. Padang Timur, Kota Padang, Sumatera Barat
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="size-4 shrink-0 text-[#F9C301]" />
                                <p className="text-xs text-stone-500">0751-38624</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="size-4 shrink-0 text-[#F9C301]" />
                                <p className="text-xs text-stone-500">smpitbudimulia@gmail.com</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Instagram className="size-4 shrink-0 text-[#F9C301]" />
                                <p className="text-xs text-stone-500">@smp_islamterpadu_budimulia</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
