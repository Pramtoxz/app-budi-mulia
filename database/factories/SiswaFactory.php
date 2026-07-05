<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Factories\Factory;

class SiswaFactory extends Factory
{
    protected $model = Siswa::class;

    public function definition(): array
    {
        $jenkel = fake()->randomElement(['L', 'P']);
        $agama = fake()->randomElement(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha']);
        $pekerjaan = ['Wiraswasta', 'PNS', 'Guru', 'Dokter', 'Petani', 'Buruh', 'Pedagang', 'Sopir'];

        return [
            'nis' => fake()->unique()->numerify('2024######'),
            'nama' => $jenkel === 'L' ? fake()->name('male') : fake()->name('female'),
            'jenkel' => $jenkel,
            'tempat_lahir' => fake()->city(),
            'tgl_lahir' => fake()->dateTimeBetween('2010-01-01', '2014-12-31'),
            'agama' => $agama,
            'alamat' => fake()->address(),
            'nama_ayah' => fake()->name('male'),
            'pekerjaan_ayah' => fake()->randomElement($pekerjaan),
            'alamat_ayah' => fake()->address(),
            'no_hp_ayah' => fake()->numerify('08##########'),
            'nama_ibu' => fake()->name('female'),
            'pekerjaan_ibu' => fake()->randomElement($pekerjaan),
            'alamat_ibu' => fake()->address(),
            'no_hp_ibu' => fake()->numerify('08##########'),
            'user_id' => null,
        ];
    }
}
