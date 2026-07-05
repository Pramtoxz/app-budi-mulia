<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hasil extends Model
{
    use HasFactory;

    protected $table = 'hasil';

    protected $fillable = ['konseling_id', 'tgl_hasil', 'solusi', 'tindak_lanjut'];

    protected function casts(): array
    {
        return [
            'tgl_hasil' => 'date:Y-m-d',
        ];
    }

    public function konseling(): BelongsTo
    {
        return $this->belongsTo(Konseling::class);
    }
}
