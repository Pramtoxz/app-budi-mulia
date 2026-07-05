<?php

namespace Database\Factories;

use App\Models\Kelas;
use Illuminate\Database\Eloquent\Factories\Factory;

class KelasFactory extends Factory
{
    protected $model = Kelas::class;

    public function definition(): array
    {
        return [
            'nama' => 'Kelas ' . fake()->unique()->numerify('###'),
            'wali_kelas' => fake()->name(),
        ];
    }
}
