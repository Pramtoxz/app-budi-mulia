<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kelas extends Model
{
    protected $table = 'kelas';

    protected $fillable = ['nama', 'wali_kelas'];

    public function siswaKelas(): HasMany
    {
        return $this->hasMany(SiswaKelas::class);
    }
}
