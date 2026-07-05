<?php

namespace Database\Factories;

use App\Models\Pengajuan;
use Illuminate\Database\Eloquent\Factories\Factory;

class PengajuanFactory extends Factory
{
    protected $model = Pengajuan::class;

    public function definition(): array
    {
        $status = fake()->randomElement(['menunggu', 'disetujui', 'disetujui', 'ditolak', 'dibatalkan']);

        return [
            'kategori_id' => \App\Models\Kategori::factory(),
            'tgl_pengajuan' => fake()->dateTimeBetween('-3 months', 'now'),
            'siswa_id' => \App\Models\Siswa::factory(),
            'catatan' => fake()->optional(0.7)->sentence(),
            'status' => $status,
            'alasan_penolakan' => in_array($status, ['ditolak', 'dibatalkan']) ? fake()->sentence() : null,
            'diajukan_oleh' => fake()->randomElement(['siswa', 'guru_bk']),
        ];
    }
}
