<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Konseling extends Model
{
    use HasFactory;

    protected $table = 'konseling';

    protected $fillable = ['pengajuan_id', 'tgl_konseling', 'jam_konseling', 'status', 'keterangan'];

    protected function casts(): array
    {
        return [
            'tgl_konseling' => 'date:Y-m-d',
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
