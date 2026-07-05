<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JadwalBlokir extends Model
{
    use HasFactory;

    protected $table = 'jadwal_blokir';

    protected $fillable = ['guru_bk_id', 'tgl_blokir', 'alasan'];

    protected function casts(): array
    {
        return [
            'tgl_blokir' => 'date:Y-m-d',
        ];
    }

    public function guruBk(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guru_bk_id');
    }
}
