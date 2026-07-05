<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Pengumuman;
use Inertia\Inertia;
use Inertia\Response;

class PublikController extends Controller
{
    public function artikelIndex(): Response
    {
        $artikel = Artikel::with('author')
            ->where('status', 'published')
            ->latest('published_at')
            ->paginate(9);

        return Inertia::render('publik/artikel/index', [
            'artikel' => $artikel,
        ]);
    }

    public function artikelShow(string $slug): Response
    {
        $artikel = Artikel::with('author')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return Inertia::render('publik/artikel/show', [
            'artikel' => $artikel,
        ]);
    }

    public function pengumumanIndex(): Response
    {
        $pengumuman = Pengumuman::with('author')
            ->where('status', 'published')
            ->latest('published_at')
            ->paginate(9);

        return Inertia::render('publik/pengumuman/index', [
            'pengumuman' => $pengumuman,
        ]);
    }

    public function pengumumanShow(string $slug): Response
    {
        $pengumuman = Pengumuman::with('author')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return Inertia::render('publik/pengumuman/show', [
            'pengumuman' => $pengumuman,
        ]);
    }
}
