<?php

namespace Database\Seeders;

use App\Models\Siswa;
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

        $userSiswa = User::create([
            'name'     => 'Ahmad Fadhil',
            'username' => 'siswa',
            'password' => Hash::make('password'),
            'role'     => 'siswa',
        ]);

        Siswa::create([
            'user_id'     => $userSiswa->id,
            'nis'         => '26001',
            'nama'        => 'Ahmad Fadhil',
            'jenkel'      => 'L',
            'tempat_lahir'=> 'Padang',
            'tgl_lahir'   => '2012-05-10',
            'agama'       => 'Islam',
            'alamat'      => 'Jl. Sudirman No. 1, Padang',
            'nama_ayah'   => 'Fadhil Senior',
            'nama_ibu'    => 'Siti Rahma',
        ]);
    }
}
