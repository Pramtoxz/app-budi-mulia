<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Setting;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\SiswaKelas;
use App\Models\Kategori;
use App\Models\Jadwal;
use App\Models\Pengajuan;
use App\Models\Konseling;
use App\Models\Hasil;
use App\Models\Artikel;
use App\Models\Pengumuman;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestingSeeder extends Seeder
{
    public function run(): void
    {
        Setting::set('tahun_ajaran_aktif', '2025/2026');
        Setting::set('nama_sekolah', 'SMP IT Budi Mulia Padang');

        $guruBk1 = User::create(['name' => 'Guru BK', 'username' => 'gurubk', 'password' => Hash::make('password'), 'role' => 'guru_bk']);
        User::create(['name' => 'Bu Siti Rahayu', 'username' => 'gurubk2', 'password' => Hash::make('password'), 'role' => 'guru_bk']);
        User::create(['name' => 'Kepala Sekolah', 'username' => 'kepsek', 'password' => Hash::make('password'), 'role' => 'kepala_sekolah']);

        $kategoriNames = [
            'Masalah Akademik' => 'Kesulitan belajar, nilai rendah, malas belajar',
            'Masalah Keluarga' => 'Orang tua cerai, KDRT, masalah ekonomi keluarga',
            'Bullying' => 'Perundungan fisik, verbal, atau cyber',
            'Pergaulan Bebas' => 'Pergaulan negatif, kenakalan remaja',
            'Kesehatan Mental' => 'Stres, cemas berlebihan, depresi ringan',
            'Kedisiplinan' => 'Bolos, terlambat, melanggar tata tertib',
            'Narkoba & Zat Adiktif' => 'Penggunaan rokok, vape, atau zat terlarang',
            'Prestasi & Motivasi' => 'Kurang motivasi, butuh dorongan berprestasi',
        ];

        $kategori = collect();
        foreach ($kategoriNames as $nama => $deskripsi) {
            $kategori->push(Kategori::create(['nama' => $nama, 'deskripsi' => $deskripsi]));
        }

        $hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
        $jamList = ['07:00-08:00', '08:00-09:00', '09:30-10:30', '10:30-11:30', '13:00-14:00', '14:00-15:00'];
        $jadwal = collect();
        foreach ($hariList as $hari) {
            foreach ($jamList as $jam) {
                [$mulai, $selesai] = explode('-', $jam);
                $jadwal->push(Jadwal::create([
                    'hari' => $hari,
                    'jam_mulai' => $mulai,
                    'jam_selesai' => $selesai,
                    'guru_bk_id' => $guruBk1->id,
                ]));
            }
        }

        $kelasNames = ['VII A', 'VII B', 'VII C', 'VIII A', 'VIII B', 'VIII C', 'IX A', 'IX B', 'IX C'];
        $waliKelas = ['Pak Ahmad Hidayat', 'Bu Ratna Sari', 'Pak Budi Santoso', 'Bu Dewi Lestari', 'Pak Eko Prasetyo', 'Bu Fitriani', 'Pak Gunawan', 'Bu Hana Putri', 'Pak Irwan'];
        $kelas = collect();
        foreach ($kelasNames as $i => $nama) {
            $kelas->push(Kelas::create(['nama' => $nama, 'wali_kelas' => $waliKelas[$i]]));
        }

        $siswaCounter = 0;
        $siswaPerKelas = 30;
        $siswaList = collect();

        foreach ($kelas as $k) {
            for ($i = 0; $i < $siswaPerKelas; $i++) {
                $siswaCounter++;
                $jenkel = $i % 3 === 0 ? 'P' : 'L';
                $namaDepan = $jenkel === 'L' ? fake()->firstNameMale() : fake()->firstNameFemale();
                $namaBelakang = fake()->lastName();

                $siswa = Siswa::create([
                    'nis' => '2025' . str_pad($siswaCounter, 4, '0', STR_PAD_LEFT),
                    'nama' => $namaDepan . ' ' . $namaBelakang,
                    'jenkel' => $jenkel,
                    'tempat_lahir' => fake()->city(),
                    'tgl_lahir' => fake()->dateTimeBetween('2011-01-01', '2013-12-31'),
                    'agama' => 'Islam',
                    'alamat' => fake()->streetAddress() . ', Padang',
                    'nama_ayah' => fake()->name('male'),
                    'pekerjaan_ayah' => fake()->randomElement(['Wiraswasta', 'PNS', 'Guru', 'Pedagang', 'Sopir', 'Buruh']),
                    'alamat_ayah' => fake()->address(),
                    'no_hp_ayah' => '08' . fake()->numerify('##########'),
                    'nama_ibu' => fake()->name('female'),
                    'pekerjaan_ibu' => fake()->randomElement(['Ibu Rumah Tangga', 'Guru', 'Perawat', 'Pedagang']),
                    'alamat_ibu' => fake()->address(),
                    'no_hp_ibu' => '08' . fake()->numerify('##########'),
                ]);

                SiswaKelas::create([
                    'siswa_id' => $siswa->id,
                    'kelas_id' => $k->id,
                    'tahun_ajaran' => '2025/2026',
                    'status' => 'aktif',
                ]);

                $siswaList->push($siswa);
            }
        }

        $pengajuanStatuses = array_merge(
            array_fill(0, 60, 'disetujui'),
            array_fill(0, 15, 'menunggu'),
            array_fill(0, 10, 'ditolak'),
            array_fill(0, 5, 'dibatalkan')
        );
        shuffle($pengajuanStatuses);

        $jamKonseling = ['07:00', '08:00', '09:00', '10:00', '13:00', '14:00'];
        $pengajuan = collect();
        for ($i = 0; $i < 90; $i++) {
            $s = $siswaList[$i];
            $status = $pengajuanStatuses[$i];
            $pengajuan->push(Pengajuan::create([
                'kategori_id' => $kategori->random()->id,
                'tgl_pengajuan' => fake()->dateTimeBetween('-3 months', '-1 week'),
                'siswa_id' => $s->id,
                'catatan' => fake()->sentence(),
                'status' => $status,
                'alasan_penolakan' => in_array($status, ['ditolak', 'dibatalkan']) ? 'Pertimbangan dari Guru BK' : null,
                'diajukan_oleh' => fake()->randomElement(['siswa', 'guru_bk']),
            ]));
        }

        $disetujui = $pengajuan->where('status', 'disetujui');
        $konselingList = collect();
        foreach ($disetujui as $p) {
            $konselingList->push(Konseling::create([
                'pengajuan_id' => $p->id,
                'tgl_konseling' => fake()->dateTimeBetween('-2 months', '-3 days'),
                'jam_konseling' => fake()->randomElement($jamKonseling),
                'status' => 'selesai',
                'keterangan' => 'Sesi konseling telah dilaksanakan',
            ]));
        }

        foreach ($konselingList as $k) {
            Hasil::create([
                'konseling_id' => $k->id,
                'tgl_hasil' => fake()->dateTimeBetween('-1 month', 'now'),
                'solusi' => fake()->paragraph(2),
                'tindak_lanjut' => fake()->randomElement([
                    'Monitoring perkembangan siswa selama 2 minggu',
                    'Koordinasi dengan wali kelas',
                    'Panggilan orang tua',
                    'Rujukan ke psikolog',
                    null,
                ]),
            ]);
        }

        $artikelJudul = [
            'Tips Mengatasi Stres Saat Ujian', 'Pentingnya Komunikasi dalam Keluarga',
            'Cara Mencegah Bullying di Sekolah', 'Manajemen Waktu untuk Pelajar',
            'Mengenali Tanda-Tanda Depresi pada Remaja', 'Pentingnya Olahraga untuk Kesehatan Mental',
            'Cara Membangun Kepercayaan Diri', 'Bahaya Narkoba bagi Remaja',
            'Tips Belajar Efektif di Rumah', 'Menghadapi Tekanan Teman Sebaya',
            'Pentingnya Tidur Cukup untuk Pelajar', 'Cara Mengelola Emosi dengan Baik',
            'Dampak Negatif Media Sosial', 'Membangun Hubungan yang Sehat dengan Teman',
            'Peran Guru BK dalam Kehidupan Siswa',
        ];

        foreach ($artikelJudul as $judul) {
            Artikel::create([
                'judul' => $judul, 'isi' => fake()->paragraphs(5, true),
                'author_id' => $guruBk1->id, 'status' => 'published',
                'published_at' => fake()->dateTimeBetween('-2 months', 'now'),
            ]);
        }

        $pengumumanJudul = [
            'Jadwal Konseling Semester Genap 2025/2026', 'Pendaftaran Ekstrakurikuler Dibuka',
            'Sosialisasi Anti-Bullying', 'Libur Semester Genap',
            'Pelatihan Kepemimpinan Siswa', 'Pengumuman Hasil Ujian Akhir',
            'Kegiatan Bakti Sosial', 'Workshop Manajemen Stres untuk Siswa',
        ];

        foreach ($pengumumanJudul as $judul) {
            Pengumuman::create([
                'judul' => $judul, 'isi' => fake()->paragraphs(2, true),
                'prioritas' => fake()->randomElement(['rendah', 'sedang', 'tinggi']),
                'author_id' => $guruBk1->id, 'status' => 'published',
                'published_at' => fake()->dateTimeBetween('-1 month', 'now'),
                'tgl_berlaku' => fake()->dateTimeBetween('now', '+3 months'),
            ]);
        }
    }
}
