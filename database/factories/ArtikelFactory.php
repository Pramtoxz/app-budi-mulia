<?php

namespace Database\Factories;

use App\Models\Artikel;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ArtikelFactory extends Factory
{
    protected $model = Artikel::class;

    public function definition(): array
    {
        $judul = fake()->unique()->sentence(4);
        $status = fake()->randomElement(['draft', 'published', 'published']);

        return [
            'judul' => $judul,
            'slug' => Str::slug($judul) . '-' . Str::random(5),
            'isi' => fake()->paragraphs(3, true),
            'gambar' => null,
            'author_id' => \App\Models\User::factory(),
            'status' => $status,
            'published_at' => $status === 'published' ? fake()->dateTimeBetween('-2 months', 'now') : null,
        ];
    }
}
