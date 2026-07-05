interface StatItem {
    value: string;
    label: string;
}

const stats: StatItem[] = [
    { value: '250+', label: 'Siswa Aktif' },
    { value: '4', label: 'Rombongan Belajar' },
    { value: '10+', label: 'Ekstrakurikuler' },
    { value: '2005', label: 'Tahun Berdiri' },
];

export default function Statistik() {
    return (
        <section id="statistik" className="relative bg-[#2A166F] py-8">
            <div className="absolute inset-0 bg-[#F9C301]/5" />
            <div className="relative mx-auto max-w-5xl px-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            className={`flex flex-col items-center py-4 ${
                                i < stats.length - 1 ? 'sm:border-r sm:border-[#F9C301]/20' : ''
                            }`}
                        >
                            <span className="text-3xl font-bold text-[#F9C301] sm:text-4xl">{stat.value}</span>
                            <span className="mt-1 text-xs font-medium uppercase tracking-wider text-white/50">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
