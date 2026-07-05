<?php

namespace Database\Factories;

use App\Models\Pengumuman;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PengumumanFactory extends Factory
{
    protected $model = Pengumuman::class;

    public function definition(): array
    {
        $judul = fake()->unique()->sentence(3);
        $status = fake()->randomElement(['draft', 'published', 'published']);

        return [
            'judul' => $judul,
            'slug' => Str::slug($judul) . '-' . Str::random(5),
            'isi' => fake()->paragraphs(2, true),
            'prioritas' => fake()->randomElement(['rendah', 'sedang', 'tinggi']),
            'author_id' => \App\Models\User::factory(),
            'status' => $status,
            'published_at' => $status === 'published' ? fake()->dateTimeBetween('-1 month', 'now') : null,
            'tgl_berlaku' => fake()->optional(0.5)->dateTimeBetween('-1 month', '+3 months'),
        ];
    }
}
