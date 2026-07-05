<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pengajuan extends Model
{
    use HasFactory;

    protected $table = 'pengajuan';

    protected $fillable = [
        'jadwal_id', 'kategori_id', 'tgl_pengajuan', 'siswa_id',
        'catatan', 'status', 'alasan_penolakan', 'diajukan_oleh',
    ];

    protected function casts(): array
    {
        return [
            'tgl_pengajuan' => 'date:Y-m-d',
        ];
    }

    public function jadwal(): BelongsTo
    {
        return $this->belongsTo(Jadwal::class);
    }

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class);
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function konseling(): HasOne
    {
        return $this->hasOne(Konseling::class);
    }
}
