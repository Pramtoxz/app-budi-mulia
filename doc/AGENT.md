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
| 5 | Jadwal Guru BK | **Ketersediaan** — Jadwal = info kapan BK buka (Senin 08:00-11:00, dst). Bukan slot booking. Guru BK menjadwalkan konseling SETELAH approve pengajuan |
| 6 | Tahun ajaran | **Flexible** — Auto detect + bisa manual override dari settings |
| 7 | Naik kelas | **Per siswa** — Pilih kelas → tampil daftar siswa → per siswa pilih: Naik (pilih kelas tujuan) / Tidak Naik / Pindah Sekolah / Lulus. Submit semua sekaligus |
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
pengajuan (id, kategori_id→kategori, tgl_pengajuan,
           siswa_id→siswa, catatan, status[menunggu|disetujui|ditolak|dibatalkan],
           alasan_penolakan, diajukan_oleh[siswa|guru_bk], timestamps)
konseling (id, pengajuan_id→pengajuan, tgl_konseling, jam_konseling, status[dijadwalkan|selesai],
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
Baca artikel &               Pilih kategori →
pengumuman                   Tulis catatan →             Review pengajuan →
                             Submit pengajuan             SETUJUI + JADWALKAN →
                                                          (tgl + jam konseling) →
                                                          Jalankan sesi →
                                                          Input hasil/solusi →
                                                          Buat laporan →
                                                          Ajukan ke Kepsek

                                                          Kepala Sekolah
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
| Siswa | ✅ CRUD (kelas wajib saat create) | ❌ | ❌ |
| Siswa-Kelas | ✅ Filter per kelas + ubah status | ❌ | ❌ |
| Kategori | ✅ CRUD | ❌ | ❌ |
| Ketersediaan | ✅ Template mingguan + blokir tanggal | ❌ | ❌ |
| Pengajuan | ✅ Kelola (approve+jadwalkan/tolak/batalkan) + input untuk siswa | ❌ | ✅ Ajukan + Riwayat (login) |
| Konseling | ✅ Input catatan | ❌ | ❌ |
| Hasil | ✅ Input solusi | ❌ | ✅ Lihat (login) |
| **Laporan** | ✅ Buat + lihat + filter + PDF | ✅ **Lihat + filter + PDF + sahkan** | ❌ |
| Artikel | ✅ CRUD | ❌ | ✅ Baca (di welcome page) |
| Pengumuman | ✅ CRUD | ❌ | ✅ Baca (di welcome page) |

### Menu Laporan (Detail)

Semua laporan punya **filter tahun ajaran** (wajib) + filter tambahan + **export PDF**.

| No | Laporan | Filter Tambahan |
|----|---------|----------------|
| 1 | Laporan Kelas | — |
| 2 | Laporan Siswa | Kelas |
| 3 | Laporan Siswa-Kelas | Kelas, Status |
| 4 | Laporan Kategori | — |
| 5 | Laporan Ketersediaan | Guru BK |
| 6 | Laporan Pengajuan | Status |
| 7 | Laporan Konseling | Kelas, Kategori |
| 8 | Laporan Hasil | Kelas |
| 9 | Laporan Artikel | Status |
| 10 | Laporan Pengumuman | Status |

Detail kolom tabel: `doc/LAPORAN.md`

---

## Alur Akses URL

```
TANPA LOGIN:
  /                          → landing page (welcome: profil sekolah + pengumuman + artikel)
  /artikel                   → daftar artikel (publik)
  /artikel/{slug}            → detail artikel (publik)
  /pengumuman                → daftar pengumuman (publik)
  /pengumuman/{slug}         → detail pengumuman (publik)

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
  /laporan/kelas             → laporan kelas
  /laporan/siswa             → laporan siswa
  /laporan/siswa-kelas       → laporan siswa-kelas (naik kelas)
  /laporan/kategori          → laporan kategori
  /laporan/ketersediaan      → laporan ketersediaan
  /laporan/pengajuan         → laporan pengajuan
  /laporan/konseling         → laporan konseling
  /laporan/hasil             → laporan hasil
  /laporan/artikel           → laporan artikel
  /laporan/pengumuman        → laporan pengumuman
  /artikel                   → CRUD artikel
  /pengumuman                → CRUD pengumuman
  /settings/profile          → edit profile

LOGIN KEPALA SEKOLAH:
  /laporan                   → daftar laporan + filter + PDF + sahkan
  /laporan/kelas             → laporan kelas
  /laporan/siswa             → laporan siswa
  /laporan/siswa-kelas       → laporan siswa-kelas
  /laporan/kategori          → laporan kategori
  /laporan/ketersediaan      → laporan ketersediaan
  /laporan/pengajuan         → laporan pengajuan
  /laporan/konseling         → laporan konseling
  /laporan/hasil             → laporan hasil
  /laporan/artikel           → laporan artikel
  /laporan/pengumuman        → laporan pengumuman
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
| 1 | Jadwal Guru BK | Info ketersediaan (Senin 08:00-11:00, dst). Bukan slot booking. Guru BK jadwalkan konseling saat approve |
| 2 | Siswa punya pengajuan aktif berapa? | Batasi 1 pengajuan aktif per siswa |
| 3 | Guru BK berhalangan | Status `dibatalkan` di pengajuan + alasan |
| 4 | Privasi data konseling | Kepsek hanya lihat rekap laporan, bukan detail per siswa |
| 5 | Siswa lulus/pindah sekolah | Status `siswa_kelas` = `lulus` / `pindah_sekolah`. Data tetap tersimpan |
| 6 | Naik kelas | Per siswa: pilih kelas → tampil daftar → per siswa pilih naik/tidak/pindah/lulus |
| 7 | Siswa baru tanpa kelas | Tidak ada. Siswa WAJIB pilih kelas saat create (langsung siswa_kelas) |
| 8 | Multi-tenant ready | Semua konfigurasi (tahun ajaran, kategori, kelas, jadwal) flexible, tidak hardcode |

---

## Status Project Saat Ini

**Kondisi: Tahap 5 CLEAR — Siswa, Dashboard (Guru BK, Kepsek, Siswa), Laporan selesai penuh**

### Yang Sudah Dikerjakan (Tahap 5 — 29-07-2026)

- ✅ **Siswa login + Dashboard**: user siswa di seeder, redirect login per role, dashboard siswa
- ✅ **Login UI redesign**: full-screen mobile-first, ungu-gold brand, glassmorphism, Islamic pattern
- ✅ **Dashboard Guru BK & Kepsek**: `DashboardController` + `pages/dashboard.tsx` — statistik ringkas (Total Siswa, Menunggu, Disetujui, Selesai) + rekap 5 Pengajuan & Konseling terbaru
- ✅ **LaporanController** (shared guru_bk + kepsek): 10 jenis laporan, filter tahun ajaran Juli-Juni, PDF DomPDF
- ✅ **Routes laporan & dashboard**: `/dashboard`, `/kepsek/dashboard`, `/guru-bk/laporan/{jenis}`, `/kepsek/laporan/{jenis}`
- ✅ **laporan/show.tsx**: halaman shared, input tahun ajaran 2 field (auto-combine), filter per jenis, tabel No auto-increment, Export PDF button
- ✅ **PDF Blade template**: `resources/views/pdf/laporan.blade.php` — shared semua jenis, header sekolah ungu, footer TTD Kepsek
- ✅ **Sidebar**: menu Dashboard dan 10 item laporan terpisah per menu di NavGroup untuk Guru BK dan Kepsek

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

### Fix Tahap 2 (05-07-2026)

- ✅ Route siswa: `.except(['create', 'edit'])` dihapus → `/guru-bk/siswa/create` dan `/{id}/edit` bisa diakses
- ✅ Siswa index: Edit button navigasi ke `/edit` (sebelumnya salah ke `/show`)
- ✅ Siswa show: Edit button navigasi ke `/edit` (sebelumnya salah ke `/show`)
- ✅ Semua halaman guru-bk konsisten pakai `guruBkRoutes` dari `lib/routes.ts` (tidak ada hardcode URL)
- ✅ `routes.ts` ditambah: `siswa.edit`, `pengajuan.*` (index, create, store, approve, reject, cancel)
- ✅ Pengajuan index: pagination links ditambah (sebelumnya hanya info halaman)
- ✅ Semua tombol "Batal" / "Kembali" navigasi ke index (bukan `window.history.back()`)
- ✅ `php artisan wayfinder:generate` dijalankan
- ✅ TypeScript check: 0 error baru (4 error pre-existing `.form()` Wayfinder)
- ✅ Factories untuk semua model (10 factories: User, Kelas, Siswa, SiswaKelas, Kategori, Jadwal, Pengajuan, Konseling, Hasil, Artikel, Pengumuman)
- ✅ `HasFactory` trait + `$table` di semua model (Jadwal, Hasil, Konseling, Pengajuan, Artikel, SiswaKelas)
- ✅ `TestingSeeder` (100 data per tabel) + `app:seed-dummy` command
- ✅ Normal `php artisan migrate:fresh --seed` tetap jalan (minimal data: 2 users + settings)
- ✅ Semua index page pakai pagination (Kelas, Kategori, Jadwal, Siswa-Kelas, Siswa, Pengajuan)
- ✅ TestingSeeder data realistis: 9 kelas, 270 siswa (30/kelas), 8 kategori, 30 jadwal, 90 pengajuan, 60 konseling+hasil, 15 artikel, 8 pengumuman

### Redesign Tahap 2 (05-07-2026)

- ✅ **Siswa create**: kelas wajib saat create (siswa langsung punya siswa_kelas)
- ✅ **Hapus assign page**: tidak perlu assign manual 1 per 1
- ✅ **Naik kelas redesign**: pilih kelas → tampil daftar siswa → per siswa pilih naik/tidak/pindah/lulus → submit semua
- ✅ **Pengajuan**: jadwal_id dihapus dari pengajuan (siswa tidak pilih jadwal saat mengajukan)
- ✅ **Jadwal Guru BK**: fungsi berubah jadi info ketersediaan (bukan slot booking)
- ✅ **Approve + Jadwalkan**: Guru BK approve sekaligus jadwalkan konseling (tgl + jam) dalam satu dialog
- ✅ **Konseling**: jam_konseling ditambah ke tabel konseling
- ✅ Migration: jadwal_id nullable di pengajuan, jam_konseling di konseling
- ✅ Lint bersih, TypeScript 0 error baru

### Redesign Jadwal (05-07-2026)

- ✅ **Jadwal CRUD dihapus** — diganti "Ketersediaan BK"
- ✅ **Template mingguan**: checklist hari + jam → generate jadwal otomatis
- ✅ **Blokir tanggal**: Guru BK bisa blokir tanggal tertentu (sakit, rapat)
- ✅ **Model JadwalBlokir** + migration + controller (KetersediaanController)
- ✅ Sidebar "Jadwal" → "Ketersediaan"
- ✅ Old jadwal page deleted, routes updated

### Redesign UI & Pengajuan (05-07-2026)

- ✅ **EntityPicker component**: reusable modal search (`components/entity-picker.tsx`) — dipakai untuk cari siswa, kategori, kelas
- ✅ **SelectTrigger fix**: `w-fit` → `w-full` (select box sama lebar dengan input)
- ✅ **Date format fix**: semua model pakai `'date:Y-m-d'` bukan `'date'` (hindari UTC timestamp di frontend)
- ✅ **Sidebar grouped**: Guru BK sidebar per label (Umum, Master, Bimbingan Konseling, Konten)
- ✅ **Pengajuan index**: order `menunggu` di atas, aksi = Detail + Edit + Hapus (hapus hanya status menunggu)
- ✅ **Pengajuan show**: cards vertikal (bukan horizontal grid), tombol aksi = Tolak + Setujui & Jadwalkan (menunggu) / Batalkan (disetujui)
- ✅ **Pengajuan edit**: Guru BK + Siswa bisa edit kategori+catatan saat status menunggu
- ✅ **Approve + Jadwalkan**: slot di-generate dari template ketersediaan di frontend (jadwalTemplate + blockedDates props), bukan fetch API
- ✅ **Siswa create**: kelas pakai EntityPicker modal (bukan select dropdown)
- ✅ **Pengajuan create**: siswa+kategori pakai EntityPicker modal
- ✅ **Navigation fix**: `router.get()` di DropdownMenuItem → `<Link asChild>` (hindari request canceled)
- ✅ Lint bersih, TypeScript 0 error baru

### Yang Sudah Dikerjakan (Tahap 3 — 05-07-2026)

- ✅ **Hasil flow**: KonselingController (Guru BK: index, show, inputHasil, editHasil, updateHasil) + Siswa HasilController (index, show)
- ✅ **Konseling page (Guru BK)**: index (table + filter status + search + pagination) + show (detail + form input hasil) + edit-hasil
- ✅ **Hasil page (Siswa)**: index (card list) + show (detail hasil konseling)
- ✅ Routes: `guru-bk/konseling` (5 routes) + `siswa/hasil` (2 routes)
- ✅ `routes.ts` ditambah: `konseling.*` (index, show, inputHasil, editHasil, updateHasil)
- ✅ Sidebar sudah ada "Konseling" (Guru BK) dan "Hasil" (Siswa) — tidak perlu ubah
- ✅ Lint bersih, TypeScript 0 error baru

### Yang Sudah Dikerjakan (Tahap 4 — 05-07-2026)

- ✅ **Artikel CRUD (Guru BK)**: ArtikelController (index, create, store, show, edit, update, destroy) + pages (index + create + edit + show)
- ✅ **Pengumuman CRUD (Guru BK)**: PengumumanController (index, create, store, show, edit, update, destroy) + pages (index + create + edit + show)
- ✅ **PublikController**: artikelIndex, artikelShow, pengumumanIndex, pengumumanShow
- ✅ **Publik pages**: `publik/artikel/index.tsx` (grid cards) + `publik/artikel/show.tsx` (detail) + `publik/pengumuman/index.tsx` (card list) + `publik/pengumuman/show.tsx` (detail)
- ✅ **PublikLayout**: header (logo + nav Artikel/Pengumuman/Masuk) + footer
- ✅ `app.tsx` update: `publik/` prefix → PublikLayout
- ✅ Routes publik: `/artikel`, `/artikel/{slug}`, `/pengumuman`, `/pengumuman/{slug}` (tanpa auth)
- ✅ Routes guru-bk: `resource('artikel')` + `resource('pengumuman')` (full CRUD)
- ✅ `routes.ts` ditambah: `artikel.*`, `pengumuman.*`
- ✅ Lint bersih, TypeScript 0 error baru

### Fix Tahap 4 (05-07-2026)

- ✅ **Welcome page redesign v2**: storytelling-driven layout — hero full-screen foto + logo sekolah + visi, statistik bar emas, tentang split asymmetric (foto miring + kontak), kegiatan zigzag, pengumuman, artikel featured+grid, footer dengan pola Islam SVG
- ✅ **welcome.tsx**: thin wrapper — import 8 komponen terpisah dari `components/welcome/`
- ✅ **8 komponen**: header.tsx, hero.tsx, statistik.tsx, tentang.tsx, kegiatan.tsx, pengumuman-section.tsx, artikel-section.tsx, footer.tsx, pola-islam.tsx
- ✅ **Foto**: it1.jpg (hero), it2.jpg (tentang), logo-sekolah.jpg (header+hero+footer) — di-copy ke `public/images/`
- ✅ **Pola Islam**: SVG pattern geometris Islam subtil sebagai signature visual di footer
- ✅ **Route publik**: `/artikel`, `/artikel/{slug}`, `/pengumuman`, `/pengumuman/{slug}` (PublikController)
- ✅ **Page publik**: `publik/artikel/index.tsx` (grid + pagination), `publik/artikel/show.tsx` (detail), `publik/pengumuman/index.tsx` (list + pagination), `publik/pengumuman/show.tsx` (detail)
- ✅ **Welcome**: artikel & pengumuman limit 3 terbaru + link "Lihat Semua"
- ✅ **app.tsx**: `publik/` prefix → null layout (publik pages pakai Header/Footer sendiri)
- ✅ Lint bersih

### Yang Belum Dikerjakan

- Dashboard per role (rekap data)
- Laporan (10 laporan) + filter + PDF export — detail di `doc/LAPORAN.md`

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
│   │   ├── KetersediaanController.php (template + blokir)
│   │   ├── KonselingController.php (index, show, inputHasil, editHasil, updateHasil)
│   │   ├── PengajuanController.php
│   │   ├── ArtikelController.php ← NEW (CRUD + publish)
│   │   └── PengumumanController.php ← NEW (CRUD + publish)
│   ├── Siswa/
│   │   ├── PengajuanController.php
│   │   └── HasilController.php (index, show)
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
│   ├── User.php (username, role, isGuruBk/isKepalaSekolah/isSiswa, HasFactory)
│   ├── Setting.php
│   ├── Kelas.php (HasFactory, $table='kelas')
│   ├── Siswa.php (HasFactory, $table='siswa')
│   ├── SiswaKelas.php (HasFactory, $table='siswa_kelas')
│   ├── Kategori.php (HasFactory, $table='kategori')
│   ├── Jadwal.php (HasFactory, $table='jadwal')
│   ├── JadwalBlokir.php (HasFactory, $table='jadwal_blokir')
│   ├── Pengajuan.php (HasFactory, $table='pengajuan')
│   ├── Konseling.php (HasFactory, $table='konseling')
│   ├── Hasil.php (HasFactory, $table='hasil')
│   ├── Artikel.php (HasFactory, $table='artikel')
│   └── Pengumuman.php (HasFactory, $table='pengumuman')
├── Console/Commands/
│   └── SeedDummy.php (app:seed-dummy)
└── Providers/
    ├── AppServiceProvider.php
    └── FortifyServiceProvider.php
```

### Database (`database/`)

```
database/
├── factories/
│   ├── UserFactory.php (guruBk, kepalaSekolah states)
│   ├── KelasFactory.php
│   ├── SiswaFactory.php
│   ├── SiswaKelasFactory.php
│   ├── KategoriFactory.php
│   ├── JadwalFactory.php
│   ├── PengajuanFactory.php
│   ├── KonselingFactory.php
│   ├── HasilFactory.php
│   ├── ArtikelFactory.php
│   └── PengumumanFactory.php
├── seeders/
│   ├── DatabaseSeeder.php (normal: 2 users + settings)
│   └── TestingSeeder.php (100 data per tabel)
└── migrations/ (14 files)
```

### Frontend (`resources/js/`)

```
resources/js/
├── app.tsx (resolve + FlashMessage + layout routing)
├── pages/
│   ├── welcome.tsx (thin wrapper — import 8 komponen dari components/welcome/)
│   ├── dashboard.tsx (placeholder)
│   ├── auth/login.tsx
│   ├── settings/ (profile, security, appearance)
│   ├── guru-bk/
│   │   ├── kelas/index.tsx (table + dialog CRUD + pagination)
│   │   ├── siswa/index.tsx (table + search + pagination + EntityPicker)
│   │   ├── siswa/create.tsx (form lengkap + EntityPicker kelas)
│   │   ├── siswa/edit.tsx (form lengkap)
│   │   ├── siswa/show.tsx (detail + riwayat kelas)
│   │   ├── siswa-kelas/index.tsx (wajib pilih kelas dulu + filter + status)
│   │   ├── siswa-kelas/naik-kelas.tsx (semua default naik, override per siswa)
│   │   ├── kategori/index.tsx (table + dialog CRUD + pagination)
│   │   ├── ketersediaan/index.tsx (template mingguan + blokir tanggal)
│   │   ├── pengajuan/index.tsx (table + filter + order menunggu atas + pagination)
│   │   ├── pengajuan/create.tsx (EntityPicker siswa + kategori)
│   │   ├── pengajuan/show.tsx (vertikal cards + slot scheduling + dialog approve/reject/cancel)
│   │   ├── pengajuan/edit.tsx (EntityPicker kategori + catatan)
│   │   ├── konseling/index.tsx (table + filter status + search + pagination)
│   │   ├── konseling/show.tsx (detail konseling + form input hasil)
│   │   ├── konseling/edit-hasil.tsx (form edit solusi + tindak lanjut)
│   │   ├── artikel/index.tsx (table + filter + search + pagination + CRUD)
│   │   ├── artikel/create.tsx (form judul + isi + gambar + status)
│   │   ├── artikel/edit.tsx (form edit)
│   │   ├── artikel/show.tsx (detail + badge status)
│   │   ├── pengumuman/index.tsx (table + filter + prioritas + CRUD)
│   │   ├── pengumuman/create.tsx (form judul + isi + prioritas + tgl_berlaku)
│   │   ├── pengumuman/edit.tsx (form edit)
│   │   └── pengumuman/show.tsx (detail + badge prioritas)
│   ├── siswa/
│   │   ├── pengajuan/index.tsx (card list + status tracking)
│   │   ├── pengajuan/create.tsx (EntityPicker kategori)
│   │   ├── pengajuan/show.tsx (detail + tombol edit)
│   │   ├── pengajuan/edit.tsx (EntityPicker kategori + catatan)
│   │   ├── hasil/index.tsx (card list hasil konseling)
│   │   └── hasil/show.tsx (detail hasil + solusi + tindak lanjut)
│   ├── publik/
│   │   ├── artikel/index.tsx (grid cards + pagination)
│   │   ├── artikel/show.tsx (detail artikel)
│   │   ├── pengumuman/index.tsx (list + pagination)
│   │   └── pengumuman/show.tsx (detail pengumuman)
├── layouts/
│   ├── app-layout.tsx → app/app-sidebar-layout.tsx
│   ├── auth-layout.tsx → auth/auth-simple-layout.tsx
│   └── settings/layout.tsx
├── components/
│   ├── app-sidebar.tsx (nav grouped per label: Umum, Master, BK, Konten)
│   ├── app-logo.tsx (Budi Mulia branding)
│   ├── entity-picker.tsx (reusable modal search + select)
│   ├── flash-message.tsx
│   ├── nav-main.tsx (support NavGroup + NavItem)
│   ├── nav-footer.tsx
│   ├── nav-user.tsx
│   ├── welcome/ (8 komponen: header, hero, statistik, tentang, kegiatan, pengumuman-section, artikel-section, footer, pola-islam)
│   └── ui/ (25+ shadcn components including table, textarea, form, tabs, pagination, scroll-area)
├── hooks/ (use-current-url, use-appearance, dll)
├── lib/
│   ├── utils.ts
│   └── routes.ts (guruBkRoutes — semua URL guru-bk)
└── types/ (auth, navigation.ts [NavItem, NavGroup], ui, global.d.ts)
```

### Routes

```
routes/
├── web.php (welcome, dashboard, route grouping per role: guru-bk/, kepsek/, siswa/)
│   └── guru-bk:
│       ├── kelas (resource: index, store, update, destroy)
│       ├── siswa (full resource: index, create, store, show, edit, update, destroy)
│       ├── kategori (resource: index, store, update, destroy)
│       ├── ketersediaan (4 routes: index, template, blokir, removeBlokir)
│       ├── siswa-kelas (5 routes: index, update, destroy, naik-kelas form, naik-kelas process)
│       ├── pengajuan (10 routes: index, create, store, show, edit, update, destroy, approve, reject, cancel)
│       ├── konseling (5 routes: index, show, input-hasil, edit-hasil, update-hasil)
│       ├── artikel (7 routes: resource — index, create, store, show, edit, update, destroy)
│       └── pengumuman (7 routes: resource — index, create, store, show, edit, update, destroy)
│   └── publik: / (welcome page: profil + artikel + pengumuman)
│       ├── /artikel (index publik)
│       ├── /artikel/{slug} (detail publik)
│       ├── /pengumuman (index publik)
│       └── /pengumuman/{slug} (detail publik)
│   └── siswa:
│       ├── pengajuan (6 routes: index, create, store, show, edit, update)
│       └── hasil (2 routes: index, show)
├── settings.php (profile, security, appearance)
└── console.php (default inspire)
```

---

## Catatan Build

- `resources/js/routes/` dan `resources/js/actions/` adalah **gitignored** — di-generate oleh Wayfinder
- Harus jalankan `php artisan wayfinder:generate` atau `npm run dev` sebelum frontend bisa compile
- SSR Inertia diaktifkan di config (`config/inertia.php`) tapi SSR server belum tentu berjalan

### Perintah Seeding

| Perintah | Fungsi |
|----------|--------|
| `php artisan migrate:fresh --seed` | Reset DB + seed normal (2 users + settings) |
| `php artisan app:seed-dummy` | Reset DB + data dummy realistis (270 siswa, 9 kelas, 90 pengajuan, dll) |

---

## Masalah Diketahui

- Test environment pakai SQLite tapi driver tidak tersedia di PHP Laragon (tidak kritis)
- Vite manifest belum di-build (normal, jalankan `pnpm run dev` untuk generate)
- Wayfinder `.form()` method tidak tersedia di v0.1.20 — gunakan `useForm` dari Inertia + URL string langsung (lihat `lib/routes.ts`)
- EPERM error saat `pnpm add` — package.json rename gagal di Windows. Solusi: edit package.json manual lalu `pnpm install`
- `usePage()` tidak bisa dipanggil di `withApp` (SSR context) — FlashMessage harus di layout, bukan di `withApp`
- `router.get()` di `DropdownMenuItem` onClick → request canceled (dropdown unmount). Solusi: pakai `<Link asChild>`
- Route cache bisa stale setelah edit routes — jalankan `php artisan route:clear` setelah perubahan route
- `fetch()` API di Inertia app bisa stuck karena session/auth issue — hindari, kirim data langsung sebagai Inertia props dari controller

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
