<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hasil extends Model
{
    protected $fillable = ['konseling_id', 'tgl_hasil', 'solusi', 'tindak_lanjut'];

    protected function casts(): array
    {
        return [
            'tgl_hasil' => 'date',
        ];
    }

    public function konseling(): BelongsTo
    {
        return $this->belongsTo(Konseling::class);
    }
}
