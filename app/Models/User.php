<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function isGuruBk(): bool
    {
        return $this->role === 'guru_bk';
    }

    public function isKepalaSekolah(): bool
    {
        return $this->role === 'kepala_sekolah';
    }

    public function isSiswa(): bool
    {
        return $this->role === 'siswa';
    }

    public function jadwal(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'guru_bk_id');
    }

    public function siswa(): HasOne
    {
        return $this->hasOne(Siswa::class);
    }

    public function artikel(): HasMany
    {
        return $this->hasMany(Artikel::class, 'author_id');
    }

    public function pengumuman(): HasMany
    {
        return $this->hasMany(Pengumuman::class, 'author_id');
    }
}
