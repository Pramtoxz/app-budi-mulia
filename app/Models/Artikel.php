<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Artikel extends Model
{
    protected $fillable = ['judul', 'slug', 'isi', 'gambar', 'author_id', 'status', 'published_at'];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Artikel $artikel) {
            if (empty($artikel->slug)) {
                $artikel->slug = Str::slug($artikel->judul) . '-' . Str::random(5);
            }
        });
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
