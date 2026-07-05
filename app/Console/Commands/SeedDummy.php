<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name: 'app:seed-dummy')]
class SeedDummy extends Command
{
    protected $signature = 'app:seed-dummy';

    protected $description = 'Jalankan migrate:fresh + seed dengan data dummy realistis (270 siswa, 9 kelas, dll)';

    public function handle(): int
    {
        $this->info("Migrasi ulang database...");
        Artisan::call('migrate:fresh', ['--quiet' => true]);
        $this->info("Database berhasil di-reset.");

        $this->info("Seeding data dummy realistis...");
        Artisan::call('db:seed', ['--class' => \Database\Seeders\TestingSeeder::class, '--quiet' => true]);

        $this->info("Selesai! Data dummy berhasil dibuat.");
        $this->newLine();
        $this->table(
            ['Tabel', 'Jumlah', 'Keterangan'],
            [
                ['users', '3', '2 Guru BK + 1 Kepala Sekolah'],
                ['kelas', '9', 'VII A-C, VIII A-C, IX A-C'],
                ['siswa', '270', '30 siswa per kelas'],
                ['siswa_kelas', '270', 'Semua siswa aktif'],
                ['kategori', '8', 'Kategori konseling'],
                ['jadwal', '30', '6 slot per hari x 5 hari'],
                ['pengajuan', '90', '60 disetujui, 15 menunggu, 10 ditolak, 5 dibatalkan'],
                ['konseling', '60', 'Dari pengajuan disetujui'],
                ['hasil', '60', 'Dari konseling selesai'],
                ['artikel', '15', 'Artikel BK published'],
                ['pengumuman', '8', 'Pengumuman sekolah'],
                ['settings', '2', 'Tahun ajaran + nama sekolah'],
            ]
        );

        $this->newLine();
        $this->info('Login Guru BK: gurubk / password');
        $this->info('Login Kepsek: kepsek / password');

        return self::SUCCESS;
    }
}
