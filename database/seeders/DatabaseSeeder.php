<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Setting::set('tahun_ajaran_aktif', '2025/2026');
        Setting::set('nama_sekolah', 'SMP IT Budi Mulia Padang');

        User::create([
            'name' => 'Guru BK',
            'username' => 'gurubk',
            'password' => Hash::make('password'),
            'role' => 'guru_bk',
        ]);

        User::create([
            'name' => 'Kepala Sekolah',
            'username' => 'kepsek',
            'password' => Hash::make('password'),
            'role' => 'kepala_sekolah',
        ]);
    }
}
