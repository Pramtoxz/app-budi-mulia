<?php

namespace Database\Factories;

use App\Models\Konseling;
use Illuminate\Database\Eloquent\Factories\Factory;

class KonselingFactory extends Factory
{
    protected $model = Konseling::class;

    public function definition(): array
    {
        return [
            'pengajuan_id' => \App\Models\Pengajuan::factory(),
            'tgl_konseling' => fake()->dateTimeBetween('-2 months', '+2 weeks'),
            'jam_konseling' => fake()->randomElement(['07:00', '08:00', '09:00', '10:00', '13:00', '14:00']),
            'status' => fake()->randomElement(['dijadwalkan', 'selesai']),
            'keterangan' => fake()->optional(0.6)->sentence(),
        ];
    }
}
