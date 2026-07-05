<?php

namespace Database\Factories;

use App\Models\SiswaKelas;
use Illuminate\Database\Eloquent\Factories\Factory;

class SiswaKelasFactory extends Factory
{
    protected $model = SiswaKelas::class;

    public function definition(): array
    {
        return [
            'siswa_id' => \App\Models\Siswa::factory(),
            'kelas_id' => \App\Models\Kelas::factory(),
            'tahun_ajaran' => '2025/2026',
            'status' => fake()->randomElement(['aktif', 'aktif', 'aktif', 'lulus', 'pindah_sekolah', 'keluar']),
        ];
    }
}
