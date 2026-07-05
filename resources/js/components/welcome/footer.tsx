import { MapPin, Phone, Mail, Instagram } from 'lucide-react';
import PolaIslam from './pola-islam';

export default function Footer() {
    return (
        <footer id="kontak" className="relative overflow-hidden bg-[#2A166F] py-12 text-white">
            <PolaIslam color="#F9C301" opacity={0.06} />

            <div className="relative z-10 mx-auto max-w-5xl px-4">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <div className="mb-4 flex items-center gap-2.5">
                            <img src="/images/logo-sekolah.jpg" alt="Logo" className="size-10 rounded-full object-cover ring-2 ring-[#F9C301]/30" />
                            <div>
                                <p className="text-sm font-semibold">SMP IT Budi Mulia</p>
                                <p className="text-xs text-white/50">Padang</p>
                            </div>
                        </div>
                        <p className="text-xs leading-relaxed text-white/60">
                            Menyiapkan generasi Islami yang Qur'ani, disiplin,
                            taat beribadah, serta unggul dalam penguasaan ilmu
                            pengetahuan dan karakter kuat.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#F9C301]">Kontak</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-[#F9C301]" />
                                <p className="text-xs leading-relaxed text-white/60">
                                    Jl. Baru Andalas, Tepi Banda Bakali, Kel. Simpang Haru,
                                    Kec. Padang Timur, Kota Padang, Sumatera Barat
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="size-4 shrink-0 text-[#F9C301]" />
                                <p className="text-xs text-white/60">0751-38624</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="size-4 shrink-0 text-[#F9C301]" />
                                <p className="text-xs text-white/60">smpitbudimulia@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#F9C301]">Media Sosial</h3>
                        <a
                            href="https://instagram.com/smp_islamterpadu_budimulia"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-white/60 transition-colors hover:text-white"
                        >
                            <Instagram className="size-4 text-[#F9C301]" />
                            <span className="text-xs">@smp_islamterpadu_budimulia</span>
                        </a>
                    </div>
                </div>

                <div className="mt-10 border-t border-white/10 pt-6 text-center">
                    <p className="text-[10px] text-white/30">
                        &copy; {new Date().getFullYear()} SMP IT Budi Mulia Padang. Hak cipta dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    );
}
