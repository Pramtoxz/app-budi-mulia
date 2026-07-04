<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Siswa extends Model
{
    protected $table = 'siswa';

    protected $fillable = [
        'nis', 'nama', 'jenkel', 'tempat_lahir', 'tgl_lahir', 'agama', 'alamat',
        'nama_ayah', 'pekerjaan_ayah', 'alamat_ayah', 'no_hp_ayah',
        'nama_ibu', 'pekerjaan_ibu', 'alamat_ibu', 'no_hp_ibu',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'tgl_lahir' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function siswaKelas(): HasMany
    {
        return $this->hasMany(SiswaKelas::class);
    }

    public function pengajuan(): HasMany
    {
        return $this->hasMany(Pengajuan::class);
    }
}
