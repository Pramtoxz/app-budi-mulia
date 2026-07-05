<?php

namespace Database\Factories;

use App\Models\Hasil;
use Illuminate\Database\Eloquent\Factories\Factory;

class HasilFactory extends Factory
{
    protected $model = Hasil::class;

    public function definition(): array
    {
        return [
            'konseling_id' => \App\Models\Konseling::factory(),
            'tgl_hasil' => fake()->dateTimeBetween('-1 month', 'now'),
            'solusi' => fake()->paragraph(),
            'tindak_lanjut' => fake()->optional(0.5)->sentence(),
        ];
    }
}
