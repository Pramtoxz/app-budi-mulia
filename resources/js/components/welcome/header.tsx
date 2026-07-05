import { Link, usePage } from '@inertiajs/react';
import { LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';

import { dashboard, login } from '@/routes';

interface AuthUser {
    id: number;
    name: string;
    role: string;
}

export default function Header() {
    const { auth } = usePage().props as { auth: { user: AuthUser | null } };
    const user = auth.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { href: '#tentang', label: 'Tentang' },
        { href: '#kegiatan', label: 'Kegiatan' },
        { href: '#pengumuman', label: 'Pengumuman' },
        { href: '#artikel', label: 'Artikel' },
        { href: '#kontak', label: 'Kontak' },
    ];

    return (
        <header className="fixed inset-x-0 top-0 z-50">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2.5">
                    <img src="/images/logo-sekolah.jpg" alt="Logo SMP IT Budi Mulia" className="size-9 rounded-full object-cover ring-2 ring-white/30" />
                    <span className="text-sm font-semibold tracking-tight text-white drop-shadow-md">
                        SMP IT Budi Mulia
                    </span>
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="rounded-md px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            {link.label}
                        </a>
                    ))}
                    {user ? (
                        <Link
                            href={dashboard()}
                            className="ml-2 rounded-md bg-[#F9C301] px-4 py-2 text-xs font-semibold text-[#2A166F] transition-colors hover:bg-yellow-400"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href={login()}
                            className="ml-2 flex items-center gap-1.5 rounded-md bg-[#F9C301] px-4 py-2 text-xs font-semibold text-[#2A166F] transition-colors hover:bg-yellow-400"
                        >
                            <LogIn className="size-3.5" />
                            Masuk
                        </Link>
                    )}
                </nav>

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="rounded-md p-2 text-white/80 hover:bg-white/10 md:hidden"
                    aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                >
                    {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </div>

            {mobileOpen && (
                <div className="border-t border-white/10 bg-[#2A166F]/95 backdrop-blur-md md:hidden">
                    <nav className="flex flex-col px-4 py-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="rounded-md px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                {link.label}
                            </a>
                        ))}
                        {user ? (
                            <Link
                                href={dashboard()}
                                className="mt-2 rounded-md bg-[#F9C301] px-4 py-2.5 text-center text-sm font-semibold text-[#2A166F]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="mt-2 flex items-center justify-center gap-1.5 rounded-md bg-[#F9C301] px-4 py-2.5 text-sm font-semibold text-[#2A166F]"
                            >
                                <LogIn className="size-4" />
                                Masuk
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
