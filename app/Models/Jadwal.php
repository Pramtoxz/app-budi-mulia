<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Jadwal extends Model
{
    use HasFactory;

    protected $table = 'jadwal';

    protected $fillable = ['hari', 'jam_mulai', 'jam_selesai', 'guru_bk_id'];

    public function guruBk(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guru_bk_id');
    }

    public function pengajuan(): HasMany
    {
        return $this->hasMany(Pengajuan::class);
    }
}
