<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Pengumuman extends Model
{
    protected $table = 'pengumuman';

    protected $fillable = [
        'judul', 'slug', 'isi', 'prioritas', 'author_id',
        'status', 'published_at', 'tgl_berlaku',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'tgl_berlaku' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Pengumuman $pengumuman) {
            if (empty($pengumuman->slug)) {
                $pengumuman->slug = Str::slug($pengumuman->judul) . '-' . Str::random(5);
            }
        });
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
