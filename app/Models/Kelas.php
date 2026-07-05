<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kelas extends Model
{
    use HasFactory;
    protected $table = 'kelas';

    protected $fillable = ['nama', 'wali_kelas'];

    public function siswaKelas(): HasMany
    {
        return $this->hasMany(SiswaKelas::class);
    }
}
