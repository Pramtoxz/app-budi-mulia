<?php

namespace Database\Seeders;

use App\Models\Artikel;
use App\Models\Hasil;
use App\Models\Jadwal;
use App\Models\Kategori;
use App\Models\Kelas;
use App\Models\Konseling;
use App\Models\Pengajuan;
use App\Models\Pengumuman;
use App\Models\Setting;
use App\Models\Siswa;
use App\Models\SiswaKelas;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestingSeeder extends Seeder
{
    public function run(): void
    {
        // ── Setting ──────────────────────────────────────────────
        Setting::set('tahun_ajaran_aktif', '2025/2026');
        Setting::set('nama_sekolah', 'SMP IT Budi Mulia Padang');

        // ── Users ─────────────────────────────────────────────────
        $guruBk = User::create([
            'name'     => 'Guru BK',
            'username' => 'gurubk',
            'password' => Hash::make('password'),
            'role'     => 'guru_bk',
        ]);

        User::create([
            'name'     => 'Kepala Sekolah',
            'username' => 'kepsek',
            'password' => Hash::make('password'),
            'role'     => 'kepala_sekolah',
        ]);

        // ── Kelas ─────────────────────────────────────────────────
        $kelasList = collect([
            ['nama' => 'VII A', 'wali_kelas' => 'Bu Rina, S.Pd'],
            ['nama' => 'VII B', 'wali_kelas' => 'Pak Hendra, S.Pd'],
            ['nama' => 'VIII A', 'wali_kelas' => 'Bu Sari, S.Pd'],
            ['nama' => 'VIII B', 'wali_kelas' => 'Pak Dedi, S.Pd'],
            ['nama' => 'IX A',  'wali_kelas' => 'Bu Ani, S.Pd'],
        ])->map(fn ($d) => Kelas::create($d));

        // ── Jadwal Ketersediaan BK ────────────────────────────────
        $jadwalData = [
            ['Senin', '08:00', '10:00'],
            ['Selasa', '09:00', '11:00'],
            ['Rabu', '10:00', '12:00'],
            ['Kamis', '08:00', '10:00'],
            ['Jumat', '13:00', '15:00'],
        ];
        foreach ($jadwalData as [$hari, $mulai, $selesai]) {
            Jadwal::create([
                'guru_bk_id'  => $guruBk->id,
                'hari'        => $hari,
                'jam_mulai'   => $mulai,
                'jam_selesai' => $selesai,
            ]);
        }

        // ── Kategori ──────────────────────────────────────────────
        $kategoriData = [
            ['nama' => 'Masalah Pribadi',    'deskripsi' => 'Permasalahan yang bersifat personal'],
            ['nama' => 'Masalah Akademik',   'deskripsi' => 'Berkaitan dengan prestasi dan belajar'],
            ['nama' => 'Masalah Sosial',     'deskripsi' => 'Hubungan dengan teman atau keluarga'],
            ['nama' => 'Masalah Karir',      'deskripsi' => 'Cita-cita dan rencana masa depan'],
        ];
        $kategoriList = collect($kategoriData)->map(fn ($d) => Kategori::create($d));

        // ── Siswa & User Siswa ────────────────────────────────────
        $siswaData = [
            ['Ahmad Fadhil',  'siswa',    '26001', 'L', 'Padang',      '2012-05-10', 'Islam',  'VII A'],
            ['Budi Santoso',  'budi',     '26002', 'L', 'Bukittinggi', '2012-03-15', 'Islam',  'VII A'],
            ['Citra Wulandari','citra',   '26003', 'P', 'Padang',      '2012-07-22', 'Islam',  'VII B'],
            ['Dewi Rahayu',   'dewi',     '26004', 'P', 'Payakumbuh',  '2011-09-01', 'Islam',  'VIII A'],
            ['Eko Prasetyo',  'eko',      '26005', 'L', 'Padang',      '2011-11-30', 'Islam',  'VIII A'],
            ['Farida Hanum',  'farida',   '26006', 'P', 'Pariaman',    '2010-04-18', 'Islam',  'IX A'],
        ];

        $siswaModels = collect();
        foreach ($siswaData as [$nama, $username, $nis, $jenkel, $tempat, $tgl, $agama, $kelasNama]) {
            $userSiswa = User::create([
                'name'     => $nama,
                'username' => $username,
                'password' => Hash::make('password'),
                'role'     => 'siswa',
            ]);

            $siswa = Siswa::create([
                'user_id'      => $userSiswa->id,
                'nis'          => $nis,
                'nama'         => $nama,
                'jenkel'       => $jenkel,
                'tempat_lahir' => $tempat,
                'tgl_lahir'    => $tgl,
                'agama'        => $agama,
                'alamat'       => 'Jl. Contoh No. 1, Padang',
                'nama_ayah'    => 'Ayah ' . $nama,
                'nama_ibu'     => 'Ibu ' . $nama,
            ]);

            $kelas = $kelasList->firstWhere('nama', $kelasNama);
            SiswaKelas::create([
                'siswa_id'    => $siswa->id,
                'kelas_id'    => $kelas->id,
                'tahun_ajaran'=> '2025/2026',
                'status'      => 'aktif',
            ]);

            $siswaModels->push($siswa);
        }

        // ── Pengajuan + Konseling + Hasil ─────────────────────────
        $statusList = ['menunggu', 'disetujui', 'disetujui', 'disetujui'];
        foreach ($siswaModels->take(4) as $i => $siswa) {
            $kategori = $kategoriList->get($i % $kategoriList->count());
            $status   = $statusList[$i];

            $pengajuan = Pengajuan::create([
                'siswa_id'      => $siswa->id,
                'kategori_id'   => $kategori->id,
                'tgl_pengajuan' => now()->subDays(rand(5, 30))->toDateString(),
                'catatan'       => 'Butuh bimbingan terkait ' . strtolower($kategori->nama),
                'status'        => $status,
                'diajukan_oleh' => 'siswa',
            ]);

            if ($status === 'disetujui') {
                $konseling = Konseling::create([
                    'pengajuan_id'  => $pengajuan->id,
                    'tgl_konseling' => now()->subDays(rand(1, 10))->toDateString(),
                    'jam_konseling' => '09:00',
                    'status'        => 'selesai',
                    'keterangan'    => 'Sesi konseling berjalan lancar.',
                ]);

                Hasil::create([
                    'konseling_id'  => $konseling->id,
                    'tgl_hasil'     => now()->subDays(rand(1, 5))->toDateString(),
                    'solusi'        => 'Diberikan bimbingan dan motivasi terkait ' . strtolower($kategori->nama) . '.',
                    'tindak_lanjut' => 'Akan dipantau perkembangannya setiap minggu.',
                ]);
            }
        }

        // ── Artikel ───────────────────────────────────────────────
        Artikel::create([
            'author_id'    => $guruBk->id,
            'judul'        => 'Tips Mengatasi Stres Belajar',
            'slug'         => 'tips-mengatasi-stres-belajar',
            'isi'          => 'Belajar merupakan kewajiban setiap siswa. Namun terkadang tekanan akademik dapat menyebabkan stres...',
            'status'       => 'published',
            'published_at' => now()->subDays(10),
        ]);

        Artikel::create([
            'author_id'    => $guruBk->id,
            'judul'        => 'Pentingnya Komunikasi dengan Orang Tua',
            'slug'         => 'pentingnya-komunikasi-dengan-orang-tua',
            'isi'          => 'Komunikasi yang baik antara anak dan orang tua sangat penting untuk perkembangan emosional...',
            'status'       => 'draft',
            'published_at' => null,
        ]);

        // ── Pengumuman ────────────────────────────────────────────
        Pengumuman::create([
            'author_id'    => $guruBk->id,
            'judul'        => 'Jadwal Konseling Semester Ganjil 2025/2026',
            'slug'         => 'jadwal-konseling-semester-ganjil',
            'isi'          => 'Bimbingan Konseling akan dilaksanakan setiap hari Senin-Jumat mulai pukul 08.00 WIB...',
            'prioritas'    => 'tinggi',
            'status'       => 'published',
            'published_at' => now()->subDays(5),
            'tgl_berlaku'  => now()->addMonths(6)->toDateString(),
        ]);
    }
}
