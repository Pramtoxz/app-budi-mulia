<?php

namespace Database\Factories;

use App\Models\Jadwal;
use Illuminate\Database\Eloquent\Factories\Factory;

class JadwalFactory extends Factory
{
    protected $model = Jadwal::class;

    public function definition(): array
    {
        $jamMulai = fake()->randomElement(['07:00', '08:00', '09:00', '10:00', '13:00', '14:00']);
        $jamSelesai = date('H:i', strtotime($jamMulai) + 3600);

        return [
            'hari' => fake()->randomElement(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']),
            'jam_mulai' => $jamMulai,
            'jam_selesai' => $jamSelesai,
            'guru_bk_id' => \App\Models\User::factory(),
        ];
    }
}
