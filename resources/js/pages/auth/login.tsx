import { Form, Head } from '@inertiajs/react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useState } from 'react';

import logoSekolah from '@/assets/images/logo-sekolah.jpg';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';

function PolaIslamBg() {
    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.06 }}
        >
            <defs>
                <pattern id="loginPola" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="#F9C301" strokeWidth="0.8" />
                    <circle cx="30" cy="30" r="8" fill="none" stroke="#F9C301" strokeWidth="0.6" />
                    <circle cx="30" cy="30" r="3" fill="none" stroke="#F9C301" strokeWidth="0.5" />
                    <circle cx="0" cy="0" r="3" fill="none" stroke="#F9C301" strokeWidth="0.5" />
                    <circle cx="60" cy="0" r="3" fill="none" stroke="#F9C301" strokeWidth="0.5" />
                    <circle cx="0" cy="60" r="3" fill="none" stroke="#F9C301" strokeWidth="0.5" />
                    <circle cx="60" cy="60" r="3" fill="none" stroke="#F9C301" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#loginPola)" />
        </svg>
    );
}

function PasswordField({
    name,
    id,
    placeholder,
    tabIndex,
    error,
}: {
    name: string;
    id: string;
    placeholder: string;
    tabIndex: number;
    error?: string;
}) {
    const [show, setShow] = useState(false);

    return (
        <div className="flex flex-col gap-1.5">
            <div className="relative flex items-center">
                <span className="absolute left-4 text-white/40 pointer-events-none">
                    <Lock className="size-4" />
                </span>
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    name={name}
                    required
                    tabIndex={tabIndex}
                    autoComplete="current-password"
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-11 pr-12 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#F9C301]/60 focus:bg-white/10 focus:ring-0"
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-4 text-white/30 hover:text-white/70 transition"
                    aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
            </div>
            {error && <p className="text-xs text-red-400 pl-1">{error}</p>}
        </div>
    );
}

export default function Login({ status }: { status?: string }) {
    return (
        <>
            <Head title="Masuk" />

            {/* Full-screen background */}
            <div
                className="relative flex min-h-svh flex-col overflow-hidden"
                style={{
                    background: 'linear-gradient(160deg, #1a0d47 0%, #2A166F 45%, #3d1f8a 100%)',
                }}
            >
                {/* Islamic pattern overlay */}
                <PolaIslamBg />

                {/* Glow effect atas */}
                <div
                    className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgba(249,195,1,0.15) 0%, transparent 70%)' }}
                />

                {/* Konten utama */}
                <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">

                    {/* Logo & Identitas Sekolah */}
                    <div className="mb-10 flex flex-col items-center gap-4 text-center">
                        <div
                            className="relative flex h-20 w-20 items-center justify-center rounded-2xl shadow-2xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(249,195,1,0.2) 0%, rgba(255,255,255,0.05) 100%)',
                                border: '1.5px solid rgba(249,195,1,0.35)',
                                boxShadow: '0 0 40px rgba(249,195,1,0.15), 0 8px 32px rgba(0,0,0,0.4)',
                            }}
                        >
                            <img
                                src={logoSekolah}
                                alt="Logo SMP IT Budi Mulia"
                                className="h-14 w-14 rounded-xl object-cover"
                            />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-wide text-white">
                                SMP IT Budi Mulia
                            </h1>
                            <p className="mt-0.5 text-sm font-medium" style={{ color: '#F9C301' }}>
                                Bimbingan Konseling
                            </p>
                            <p className="mt-1 text-xs text-white/40">Padang, Sumatera Barat</p>
                        </div>
                    </div>

                    {/* Card Form */}
                    <div
                        className="w-full max-w-sm rounded-2xl p-6"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                        }}
                    >
                        <div className="mb-6">
                            <h2 className="text-base font-semibold text-white">Masuk ke Akun</h2>
                            <p className="mt-0.5 text-xs text-white/40">Masukkan username dan password Anda</p>
                        </div>

                        {status && (
                            <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-center text-sm text-green-400">
                                {status}
                            </div>
                        )}

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Username */}
                                    <div className="flex flex-col gap-1.5">
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-white/40 pointer-events-none">
                                                <User className="size-4" />
                                            </span>
                                            <input
                                                id="username"
                                                type="text"
                                                name="username"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="username"
                                                placeholder="Username"
                                                className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#F9C301]/60 focus:bg-white/10"
                                            />
                                        </div>
                                        {errors.username && (
                                            <p className="text-xs text-red-400 pl-1">{errors.username}</p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <PasswordField
                                        id="password"
                                        name="password"
                                        placeholder="Password"
                                        tabIndex={2}
                                        error={errors.password}
                                    />

                                    {/* Ingat saya */}
                                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            tabIndex={3}
                                            className="h-4 w-4 cursor-pointer rounded border-white/20 bg-white/5 accent-[#F9C301]"
                                        />
                                        <span className="text-xs text-white/50">Ingat saya</span>
                                    </label>

                                    {/* Tombol Masuk */}
                                    <button
                                        type="submit"
                                        id="login-button"
                                        tabIndex={4}
                                        disabled={processing}
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold text-[#2A166F] transition-all active:scale-[0.98] disabled:opacity-70"
                                        style={{
                                            background: processing
                                                ? 'rgba(249,195,1,0.7)'
                                                : 'linear-gradient(135deg, #F9C301 0%, #e6b000 100%)',
                                            boxShadow: '0 4px 20px rgba(249,195,1,0.35)',
                                        }}
                                    >
                                        {processing && <Spinner className="text-[#2A166F]" />}
                                        {processing ? 'Memproses...' : 'Masuk'}
                                    </button>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Footer */}
                    <p className="mt-8 text-center text-xs text-white/20">
                        © 2026 SMP IT Budi Mulia Padang
                    </p>
                </div>
            </div>
        </>
    );
}

// Bypass auth-simple-layout — halaman ini handle layoutnya sendiri
Login.layout = undefined;
