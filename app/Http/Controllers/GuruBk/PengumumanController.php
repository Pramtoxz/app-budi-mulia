<?php

namespace App\Http\Controllers\GuruBk;

use App\Http\Controllers\Controller;
use App\Models\Pengumuman;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengumumanController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search');
        $status = $request->get('status');

        $pengumuman = Pengumuman::with('author')
            ->when($search, fn ($q) => $q->where('judul', 'like', "%{$search}%"))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('guru-bk/pengumuman/index', [
            'pengumuman' => $pengumuman,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('guru-bk/pengumuman/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'prioritas' => 'required|in:rendah,sedang,tinggi',
            'status' => 'required|in:draft,published',
            'tgl_berlaku' => 'nullable|date',
        ]);

        Pengumuman::create([
            ...$validated,
            'author_id' => auth()->id(),
            'published_at' => $validated['status'] === 'published' ? now() : null,
        ]);

        return redirect()->route('guru-bk.pengumuman.index')
            ->with('success', 'Pengumuman berhasil dibuat.');
    }

    public function show(Pengumuman $pengumuman): Response
    {
        $pengumuman->load('author');

        return Inertia::render('guru-bk/pengumuman/show', [
            'pengumuman' => $pengumuman,
        ]);
    }

    public function edit(Pengumuman $pengumuman): Response
    {
        return Inertia::render('guru-bk/pengumuman/edit', [
            'pengumuman' => $pengumuman,
        ]);
    }

    public function update(Request $request, Pengumuman $pengumuman): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'prioritas' => 'required|in:rendah,sedang,tinggi',
            'status' => 'required|in:draft,published',
            'tgl_berlaku' => 'nullable|date',
        ]);

        if ($validated['status'] === 'published' && $pengumuman->status === 'draft') {
            $validated['published_at'] = now();
        } elseif ($validated['status'] === 'draft') {
            $validated['published_at'] = null;
        }

        $pengumuman->update($validated);

        return redirect()->route('guru-bk.pengumuman.index')
            ->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy(Pengumuman $pengumuman): RedirectResponse
    {
        $pengumuman->delete();

        return redirect()->route('guru-bk.pengumuman.index')
            ->with('success', 'Pengumuman berhasil dihapus.');
    }
}
