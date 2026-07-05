## Aturan

- Komentar `//` DILARANG kecuali hal yang benar-benar tidak obvious
- WAJIB gunakan Context7 untuk referensi Laravel/packages — DILARANG asumsi
- WAJIB update AGENT.md setiap selesai mengerjakan sesuatu
- Jangan jawab "sudah beres" jika belum diverifikasi
- Wajib Gunakan MCP+Skills Yang Terhubung
- JANGAN ASUMSI database/design — SELALU referensi ke bagian "Desain Database" dan "Keputusan Desain" di bawah
- **Mobile First** — desain tampilan WAJIB mobile-first, baru desktop. Siswa akses dari HP, Guru BK & Kepsek dari laptop/HP
- **WAJIB Bahasa Indonesia** — Semua teks UI (label, tombol, pesan, breadcrumb, menu, dialog) harus bahasa Indonesia. "Username" dan "Password" boleh Inggris karena istilah teknis

---

## Tech Stack

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Backend | Laravel | ^13.7 |
| PHP | PHP | ^8.3 |
| Frontend | React + TypeScript | React ^19.2 |
| Inertia | Inertia.js | ^3.0 |
| CSS | Tailwind CSS | ^4.0 (`@tailwindcss/vite` ^4.1.11) |
| UI | shadcn/ui (New York), Radix UI, Lucide React | — |
| Routing | Wayfinder (type-safe) | ^0.1.14 |
| Auth | Laravel Fortify | ^1.37.2 |
| Build | Vite | ^8.0 |
| DB | MySQL (Laragon) | — |
| Font | Instrument Sans (Bunny CDN) | 400, 500, 600 |
| Package Manager | pnpm | — |
| React Compiler | babel-plugin-react-compiler | ^1.0.0 |
| PDF Export | TBD (belum dipilih) | — |

### Skema Warna Brand (Logo SMP IT Budi Mulia)

| Warna | Hex | Kegunaan |
|-------|-----|----------|
| Ungu Tua (Primary) | `#2A166F` | Sidebar, tombol utama, heading |
| Kuning/Gold (Accent) | `#F9C301` | Highlight, sidebar primary, accent |
| Merah (Destructive) | `#D9271B` | Hapus, error, peringatan |
| Putih | `#FFFFFF` | Background, card, text on dark |

---

## Tentang Project Ini

**Sistem Informasi Bimbingan Konseling — SMP IT Budi Mulia Padang**

Ini adalah project **multi-tenant ready** — bisa dipakai atau dibagikan ke sekolah-sekolah lain. Karena itu semua fitur harus **flexible** (bisa dikonfigurasi per sekolah), bukan hardcode.

---

## Role / Aktor

| Role | Login Pakai | Keterangan |
|------|------------|------------|
| **Guru BK** | `username` + password | Pengelola utama sistem. CRUD semua data, kelola konseling, buat laporan, manage artikel & pengumuman |
| **Kepala Sekolah** | `username` + password | Akses **hanya** menu Laporan (lihat + filter + export PDF + sahkan). Tidak ada dashboard, tidak ada menu lain |
| **Siswa** | Tanpa login | Bisa baca artikel & pengumuman (publik) |
| **Siswa** | `nis` / `username` (opsional) | Bisa login untuk ajukan konseling + lihat hasil. Tapi tidak semua siswa punya HP, jadi Guru BK juga bisa inputkan pengajuan untuk siswa |

**TIDAK pakai Spatie Permission.** Cukup kolom `role` string di tabel `users`.

---

## Keputusan Desain (FINAL — Hasil Diskusi)

| No | Masalah | Keputusan |
|----|---------|-----------|
| 1 | Role system | Kolom `role` di `users`, tanpa Spatie |
| 2 | ID strategy | Auto-increment Laravel, tidak pakai ID manual (K001, P001) |
| 3 | Auth | Fortify dengan `username` + `password` (bukan email) |
| 4 | Pengajuan konseling | **Hybrid** — Siswa bisa login sendiri, ATAU Guru BK inputkan untuk siswa (karena tidak semua siswa punya HP). Kolom `diajukan_oleh` untuk track siapa yang input |
| 5 | Jadwal Guru BK | **Flexible** — Guru BK buat jadwal sendiri kapan saja (hari ini, besok, 2 minggu depan) |
| 6 | Tahun ajaran | **Flexible** — Auto detect + bisa manual override dari settings |
| 7 | Naik kelas | **Flexible** — Bisa bulk (pilih kelas → semua naik) atau satu-satu. Yang tinggal/pindah sekolah diatur manual |
| 8 | Kategori konseling | **Flexible** — Guru BK yang buat & kelola kategori sendiri (bukan hardcode) |
| 9 | Lampiran konseling | **Opsional** — Tidak semua perlu bukti |
| 10 | Guru BK bisa berapa? | **Semua Guru BK** bisa handle semua pengajuan (tidak diikat ke jadwal tertentu) |
| 11 | Pindah kelas | **Tidak ada** konsep pindah kelas. Yang ada pindah sekolah (siswa jadi nonaktif) |
| 12 | Laporan Kepsek | **Sederhana** — Tampil data di table + export PDF + print + tanda tangan Kepsek secara fisik |
| 13 | Backup | **Tidak perlu** fitur backup dari aplikasi |
| 14 | Laporan bisa diedit setelah sahkan? | Tidak perlu. Laporan = tampilan data + PDF. Pengesahan = tanda tangan fisik |

---

## Desain Database (FINAL)

### Tabel Utama

```sql
-- Auth
users (id, name, username, password, role[guru_bk|kepala_sekolah|siswa], remember_token, timestamps)

-- Master Data
settings (id, key, value)                          -- tahun_ajaran_aktif, nama_sekolah, dll
kelas (id, nama, wali_kelas, timestamps)
siswa (id, nis, nama, jenkel, tempat_lahir, tgl_lahir, agama, alamat,
       nama_ayah, pekerjaan_ayah, alamat_ayah, no_hp_ayah,
       nama_ibu, pekerjaan_ibu, alamat_ibu, no_hp_ibu,
       user_id→users nullable, timestamps)
siswa_kelas (id, siswa_id→siswa, kelas_id→kelas, tahun_ajaran, status[aktif|lulus|pindah_sekolah|keluar], timestamps)
kategori (id, nama, deskripsi, timestamps)
jadwal (id, hari, jam_mulai, jam_selesai, guru_bk_id→users, timestamps)

-- Transaksi
pengajuan (id, jadwal_id→jadwal, kategori_id→kategori, tgl_pengajuan,
           siswa_id→siswa, catatan, status[menunggu|disetujui|ditolak|dibatalkan],
           alasan_penolakan, diajukan_oleh[siswa|guru_bk], timestamps)
konseling (id, pengajuan_id→pengajuan, tgl_konseling, status[dijadwalkan|selesai],
           keterangan, timestamps)
hasil (id, konseling_id→konseling, tgl_hasil, solusi, tindak_lanjut, timestamps)

-- Konten Publik
artikel (id, judul, slug, isi, gambar, author_id→users, status[draft|published], published_at, timestamps)
pengumuman (id, judul, slug, isi, prioritas[rendah|sedang|tinggi], author_id→users,
            status[draft|published], published_at, tgl_berlaku, timestamps)
```

### Relasi Kunci

```
users ←── siswa.user_id (nullable, siswa yang punya akun)
users ←── jadwal.guru_bk_id
users ←── artikel.author_id / pengumuman.author_id
kelas ←── siswa_kelas.kelas_id
siswa ←── siswa_kelas.siswa_id
siswa ←── pengajuan.siswa_id
jadwal ←── pengajuan.jadwal_id
kategori ←── pengajuan.kategori_id
pengajuan ←── konseling.pengajuan_id
konseling ←── hasil.konseling_id
```

### Kenapa Pivot `siswa_kelas`?

Siswa naik kelas tiap tahun. Jika `kelas_id` langsung di tabel `siswa`, riwayat kelas lama hilang. Dengan pivot:
- Siswa punya riwayat kelas per tahun ajaran
- Tahun 2024: Dilla → VII A
- Tahun 2025: Dilla → VIII A (data VII A tetap ada)
- Filter laporan per tahun ajaran jadi mudah

---

## Alur Bisnis

### Alur Konseling

```
SISWA (tanpa login)          SISWA (login)               GURU BK
─────────────────────        ──────────────              ──────────
Baca artikel &               Lihat jadwal BK →
pengumuman                   Pilih kategori →             Terima pengajuan →
                             Tulis catatan →              SETUJUI / TOLAK →
                             Submit pengajuan             Jadwalkan konseling →
                                                          Jalankan sesi →
                                                          Isi catatan konseling →
                                                          Input hasil/solusi →
                                                          Buat laporan →
                                                          Ajukan ke Kepsek

                                                          KEpala Sekolah
                                                          ─────────────
                                                          Lihat laporan →
                                                          Filter tahun ajaran →
                                                          Export PDF →
                                                          Tanda tangan fisik
```

### Status Pengajuan

```
menunggu → disetujui → (lanjut ke konseling)
menunggu → ditolak (dengan alasan)
disetujui → dibatalkan (Guru BK berhalangan, dengan alasan)
```

### Status Konseling

```
dijadwalkan → selesai
```

### Pengajuan: Siapa yang Input?

| `diajukan_oleh` | Kondisi | Siswa bisa cek status? |
|------------------|---------|------------------------|
| `siswa` | Siswa login sendiri | Ya |
| `guru_bk` | Guru BK inputkan untuk siswa (siswa tidak punya HP) | Tidak (siswa dapat info dari Guru BK langsung) |

---

## Menu Per Role

| Menu | Guru BK | Kepsek | Siswa |
|------|---------|--------|-------|
| Dashboard | ✅ | ❌ | ❌ |
| Kelas | ✅ CRUD | ❌ | ❌ |
| Siswa | ✅ CRUD | ❌ | ❌ |
| Siswa-Kelas | ✅ Atur kelas + naik kelas | ❌ | ❌ |
| Kategori | ✅ CRUD | ❌ | ❌ |
| Jadwal | ✅ CRUD | ❌ | ❌ |
| Pengajuan | ✅ Kelola (setujui/tolak/batalkan) + input untuk siswa | ❌ | ✅ Ajukan + Riwayat (login) |
| Konseling | ✅ Input catatan | ❌ | ❌ |
| Hasil | ✅ Input solusi | ❌ | ✅ Lihat (login) |
| **Laporan** | ✅ Buat + lihat + filter + PDF | ✅ **Lihat + filter + PDF + sahkan** | ❌ |
| Artikel | ✅ CRUD | ❌ | ✅ Baca (publik, tanpa login) |
| Pengumuman | ✅ CRUD | ❌ | ✅ Baca (publik, tanpa login) |

### Menu Laporan (Detail)

Semua laporan punya **filter tahun ajaran** (wajib) + filter tambahan + **export PDF**.

| No | Laporan | Filter Tambahan |
|----|---------|----------------|
| 1 | Laporan Siswa | Kelas |
| 2 | Laporan Kategori | — |
| 3 | Laporan Jadwal | Guru BK |
| 4 | Laporan Pengajuan | Status |
| 5 | Laporan Konseling | Kelas, Kategori |
| 6 | Laporan Hasil | Kelas |

---

## Alur Akses URL

```
TANPA LOGIN:
  /                          → landing page (welcome)
  /artikel                   → daftar artikel
  /artikel/{slug}            → detail artikel
  /pengumuman                → daftar pengumuman
  /pengumuman/{slug}         → detail pengumuman

LOGIN GURU BK:
  /dashboard                 → rekap data
  /kelas                     → CRUD kelas
  /siswa                     → CRUD siswa
  /siswa/{id}/kelas          → atur kelas siswa (siswa_kelas)
  /kategori                  → CRUD kategori
  /jadwal                    → CRUD jadwal
  /pengajuan                 → kelola pengajuan + input untuk siswa
  /konseling                 → input catatan konseling
  /hasil                     → input solusi
  /laporan                   → daftar laporan + filter + PDF
  /laporan/siswa             → laporan siswa
  /laporan/kategori          → laporan kategori
  /laporan/jadwal            → laporan jadwal
  /laporan/pengajuan         → laporan pengajuan
  /laporan/konseling         → laporan konseling
  /laporan/hasil             → laporan hasil
  /artikel                   → CRUD artikel
  /pengumuman                → CRUD pengumuman
  /settings/profile          → edit profile

LOGIN KEPALA SEKOLAH:
  /laporan                   → daftar laporan + filter + PDF + sahkan
  /laporan/siswa             → laporan siswa
  /laporan/kategori          → laporan kategori
  /laporan/jadwal            → laporan jadwal
  /laporan/pengajuan         → laporan pengajuan
  /laporan/konseling         → laporan konseling
  /laporan/hasil             → laporan hasil
  /settings/profile          → edit profile

LOGIN SISWA:
  /dashboard                 → info jadwal BK + pengajuan saya
  /pengajuan                 → buat pengajuan + riwayat
  /pengajuan/{id}            → detail pengajuan + status
  /hasil                     → riwayat hasil konseling
  /settings/profile          → edit profile
```

---

## Kritis & Pertimbangan Tambahan

| No | Masalah | Solusi |
|----|---------|--------|
| 1 | 1 slot jadwal diterima berapa pengajuan? | 1 slot = 1 siswa. Setelah disetujui, slot tidak tersedia |
| 2 | Siswa punya pengajuan aktif berapa? | Batasi 1 pengajuan aktif per siswa |
| 3 | Guru BK berhalangan | Status `dibatalkan` di pengajuan + alasan |
| 4 | Privasi data konseling | Kepsek hanya lihat rekap laporan, bukan detail per siswa |
| 5 | Siswa lulus/pindah sekolah | Status `siswa_kelas` = `lulus` / `pindah_sekolah`. Data tetap tersimpan |
| 6 | Naik kelas massal | Fitur bulk: pilih kelas asal → pilih kelas tujuan → semua siswa aktif naik |
| 7 | Multi-tenant ready | Semua konfigurasi (tahun ajaran, kategori, kelas, jadwal) flexible, tidak hardcode |

---

## Status Project Saat Ini

**Kondisi: Tahap 2 sedang berjalan — Master Data + Siswa-Kelas + Pengajuan selesai, Konseling flow belum**

### Yang Sudah Dikerjakan (Tahap 1 — 04-07-2026)

- ✅ Migrasi: `users` dimodifikasi (username, role) + 10 tabel baru (settings, kelas, siswa, siswa_kelas, kategori, jadwal, pengajuan, konseling, hasil, artikel, pengumuman)
- ✅ 12 Model: User, Setting, Kelas, Siswa, SiswaKelas, Kategori, Jadwal, Pengajuan, Konseling, Hasil, Artikel, Pengumuman
- ✅ Auth: Fortify diubah dari email ke username
- ✅ Role middleware: `role:guru_bk`, `role:kepala_sekolah`, `role:siswa`
- ✅ User model: `isGuruBk()`, `isKepalaSekolah()`, `isSiswa()`
- ✅ Seeder: Guru BK (`gurubk`/`password`), Kepala Sekolah (`kepsek`/`password`)
- ✅ Route grouping per role (prefix `guru-bk/`, `kepsek/`, `siswa/`)
- ✅ Login page diubah ke username
- ✅ Settings: tahun_ajaran_aktif, nama_sekolah

### Yang Sudah Dikerjakan (Tahap 2 — 04-07-2026)

- ✅ UI Components: table, textarea, form, tabs, pagination (shadcn/ui)
- ✅ Dependencies: @hookform/resolvers, zod, react-hook-form, @radix-ui/react-tabs
- ✅ `FlashMessage` component + flash data sharing di HandleInertiaRequests
- ✅ `resolve` function di app.tsx untuk dynamic page loading
- ✅ Sidebar navigation per role (Guru BK: 9 menu, Kepsek: 1 menu, Siswa: 3 menu)
- ✅ AppLogo diubah ke "Budi Mulia — Bimbingan Konseling"
- ✅ `guruBkRoutes` helper di `lib/routes.ts`
- ✅ **Kelas CRUD**: KelasController + pages/guru-bk/kelas/index.tsx (table + dialog create/edit/delete)
- ✅ **Siswa CRUD**: SiswaController + index/create/edit/show pages (table + search + pagination + form lengkap)
- ✅ **Kategori CRUD**: KategoriController + pages/guru-bk/kategori/index.tsx (table + dialog)
- ✅ **Jadwal CRUD**: JadwalController + pages/guru-bk/jadwal/index.tsx (table + dialog + select hari/guru)
- ✅ **Siswa-Kelas**: SiswaKelasController + index/assign/naik-kelas pages (filter, status, assign, naik kelas massal)
- ✅ **Pengajuan**: PengajuanController (Guru BK + Siswa) + index/create/show pages (approve/reject/cancel, siswa submit)

### Yang Belum Dikerjakan

- Konseling flow (jadwalkan + catatan)
- Konseling flow (jadwalkan + catatan)
- Hasil flow (input solusi + tindak lanjut)
- Artikel CRUD + publik pages
- Pengumuman CRUD + publik pages
- Dashboard per role (rekap data)
- Laporan + filter + PDF export
- Welcome page (belum dikustomisasi untuk SMP IT Budi Mulia)

### Yang Sengaja Dihapus dari Scaffold

- Registrasi user
- Forgot/reset password flow
- Email verification
- Two-factor authentication
- Passkey authentication

---

## Struktur File Saat Ini

### Backend (`app/`)

```
app/
├── Actions/Fortify/
│   └── ResetUserPassword.php
├── Concerns/
│   ├── PasswordValidationRules.php
│   └── ProfileValidationRules.php
├── Http/Controllers/
│   ├── Controller.php (abstract base)
│   ├── GuruBk/
│   │   ├── KelasController.php
│   │   ├── SiswaController.php
│   │   ├── SiswaKelasController.php
│   │   ├── KategoriController.php
│   │   ├── JadwalController.php
│   │   └── PengajuanController.php ← NEW
│   ├── Siswa/
│   │   └── PengajuanController.php ← NEW
│   └── Settings/
│       ├── ProfileController.php
│       └── SecurityController.php
├── Http/Middleware/
│   ├── HandleAppearance.php
│   ├── HandleInertiaRequests.php (flash data sharing)
│   └── RoleMiddleware.php
├── Http/Requests/Settings/
│   ├── PasswordUpdateRequest.php
│   ├── ProfileDeleteRequest.php
│   └── PasswordUpdateRequest.php
├── Models/
│   ├── User.php (username, role, isGuruBk/isKepalaSekolah/isSiswa)
│   ├── Setting.php
│   ├── Kelas.php
│   ├── Siswa.php
│   ├── SiswaKelas.php
│   ├── Kategori.php
│   ├── Jadwal.php
│   ├── Pengajuan.php
│   ├── Konseling.php
│   ├── Hasil.php
│   ├── Artikel.php
│   └── Pengumuman.php
└── Providers/
    ├── AppServiceProvider.php
    └── FortifyServiceProvider.php
```

### Frontend (`resources/js/`)

```
resources/js/
├── app.tsx (resolve + FlashMessage + layout routing)
├── pages/
│   ├── welcome.tsx
│   ├── dashboard.tsx (placeholder)
│   ├── auth/login.tsx
│   ├── settings/ (profile, security, appearance)
│   └── guru-bk/
│       ├── kelas/index.tsx (table + dialog CRUD)
│       ├── siswa/index.tsx (table + search + pagination)
│       ├── siswa/create.tsx (form lengkap)
│       ├── siswa/edit.tsx (form lengkap)
│       ├── siswa/show.tsx (detail + riwayat kelas)
│       ├── siswa-kelas/index.tsx (filter + status + grouped by kelas)
│       ├── siswa-kelas/assign.tsx (form assign siswa ke kelas)
│       ├── siswa-kelas/naik-kelas.tsx (form naik kelas massal)
│       ├── kategori/index.tsx (table + dialog CRUD)
│       ├── jadwal/index.tsx (table + dialog CRUD)
│       ├── pengajuan/index.tsx (table + filter + approve/reject/cancel)
│       └── pengajuan/create.tsx (form buat pengajuan untuk siswa)
│   └── siswa/
│       ├── pengajuan/index.tsx (card list + status tracking)
│       ├── pengajuan/create.tsx (form ajukan konseling)
│       └── pengajuan/show.tsx (detail pengajuan + status)
├── layouts/
│   ├── app-layout.tsx → app/app-sidebar-layout.tsx
│   ├── auth-layout.tsx → auth/auth-simple-layout.tsx
│   └── settings/layout.tsx
├── components/
│   ├── app-sidebar.tsx (nav per role)
│   ├── app-logo.tsx (Budi Mulia branding)
│   ├── flash-message.tsx ← NEW
│   ├── nav-main.tsx
│   ├── nav-footer.tsx
│   ├── nav-user.tsx
│   └── ui/ (25+ shadcn components including table, textarea, form, tabs, pagination)
├── hooks/ (use-current-url, use-appearance, dll)
├── lib/
│   ├── utils.ts
│   └── routes.ts ← NEW (guruBkRoutes)
└── types/ (auth, navigation, ui, global.d.ts)
```

### Routes

```
routes/
├── web.php (welcome, dashboard, route grouping per role: guru-bk/, kepsek/, siswa/)
│   └── guru-bk: kelas, siswa, kategori, jadwal (resource) + siswa-kelas (7 routes) + pengajuan (6 routes)
│   └── siswa: pengajuan (4 routes)
├── settings.php (profile, security, appearance)
└── console.php (default inspire)
```

---

## Catatan Build

- `resources/js/routes/` dan `resources/js/actions/` adalah **gitignored** — di-generate oleh Wayfinder
- Harus jalankan `php artisan wayfinder:generate` atau `npm run dev` sebelum frontend bisa compile
- SSR Inertia diaktifkan di config (`config/inertia.php`) tapi SSR server belum tentu berjalan

---

## Masalah Diketahui

- Test environment pakai SQLite tapi driver tidak tersedia di PHP Laragon (tidak kritis)
- Vite manifest belum di-build (normal, jalankan `pnpm run dev` untuk generate)
- Wayfinder `.form()` method tidak tersedia di v0.1.20 — gunakan `useForm` dari Inertia + URL string langsung (lihat `lib/routes.ts`)
- EPERM error saat `pnpm add` — package.json rename gagal di Windows. Solusi: edit package.json manual lalu `pnpm install`
- `usePage()` tidak bisa dipanggil di `withApp` (SSR context) — FlashMessage harus di layout, bukan di `withApp`

### Cleanup Sudah Dilakukan (04-07-2026)

- ✅ `UserFactory` — method `withTwoFactor()` dihapus
- ✅ `FortifyServiceProvider` — view register, 2FA, confirm-password, rate limiter dead code dihapus
- ✅ `use-two-factor-auth.ts` — file dihapus
- ✅ `auth.ts` — type `Passkey`, `TwoFactorSetupData`, `TwoFactorSecretKey`, `two_factor_enabled` dihapus
- ✅ `input-otp.tsx` — file dihapus
- ✅ 3 unused layouts (app-header, auth-card, auth-split) — file dihapus
- ✅ `@laravel/passkeys` dan `input-otp` — dihapus dari package.json
- ✅ `CreateNewUser.php` — file dihapus (tidak ada registrasi)
- ✅ Test dead code (TwoFactorChallenge, Registration, PasswordReset, PasswordConfirmation, EmailVerification, VerificationNotification) — file dihapus
- ✅ `AuthenticationTest.php` — test 2FA dihapus
- ✅ `SecurityTest.php` — test 2FA/passkeys dihapus

---

## Referensi Eksternal

- BAB IV (analisa & desain): `doc/BAB.md` — catatan client, desain database di BAB ini sudah dimodernisasi (pakai auto-increment, pivot table, dll). JANGAN ikuti desain BAB mentah-mentah.
