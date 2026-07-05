import { ChevronDown } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="/images/it1.jpg"
                    alt="Gedung SMP IT Budi Mulia"
                    className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2A166F]/70 via-[#2A166F]/60 to-[#2A166F]/90" />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
                <img
                    src="/images/logo-sekolah.jpg"
                    alt="Logo SMP IT Budi Mulia"
                    className="mx-auto mb-6 size-24 rounded-full object-cover ring-4 ring-[#F9C301]/40 shadow-2xl sm:size-28"
                />

                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#F9C301] sm:text-sm">
                    Sekolah Menengah Pertama Islam Terpadu
                </p>

                <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Budi Mulia
                </h1>

                <div className="mx-auto mb-6 flex items-center justify-center gap-3">
                    <span className="h-px w-12 bg-[#F9C301]" />
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#F9C301]">Padang</span>
                    <span className="h-px w-12 bg-[#F9C301]" />
                </div>

                <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                    Menyiapkan generasi Islami yang Qur'ani, disiplin, taat beribadah,
                    serta unggul dalam penguasaan ilmu pengetahuan dan karakter kuat
                    demi masa depan madani.
                </p>
            </div>

            <a
                href="#statistik"
                className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/50 transition-colors hover:text-white"
                aria-label="Scroll ke bawah"
            >
                <ChevronDown className="size-6" />
            </a>
        </section>
    );
}
