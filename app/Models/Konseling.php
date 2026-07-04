<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Konseling extends Model
{
    protected $fillable = ['pengajuan_id', 'tgl_konseling', 'status', 'keterangan'];

    protected function casts(): array
    {
        return [
            'tgl_konseling' => 'date',
        ];
    }

    public function pengajuan(): BelongsTo
    {
        return $this->belongsTo(Pengajuan::class);
    }

    public function hasil(): HasOne
    {
        return $this->hasOne(Hasil::class);
    }
}
