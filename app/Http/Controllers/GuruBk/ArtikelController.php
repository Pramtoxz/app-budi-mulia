<?php

namespace App\Http\Controllers\GuruBk;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ArtikelController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search');
        $status = $request->get('status');

        $artikel = Artikel::with('author')
            ->when($search, fn ($q) => $q->where('judul', 'like', "%{$search}%"))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('guru-bk/artikel/index', [
            'artikel' => $artikel,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('guru-bk/artikel/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'required|in:draft,published',
        ]);

        if ($request->hasFile('gambar')) {
            $validated['gambar'] = $request->file('gambar')->store('artikel', 'public');
        } else {
            unset($validated['gambar']);
        }

        Artikel::create([
            ...$validated,
            'author_id' => auth()->id(),
            'published_at' => $validated['status'] === 'published' ? now() : null,
        ]);

        return redirect()->route('guru-bk.artikel.index')
            ->with('success', 'Artikel berhasil dibuat.');
    }

    public function show(Artikel $artikel): Response
    {
        $artikel->load('author');

        return Inertia::render('guru-bk/artikel/show', [
            'artikel' => $artikel,
        ]);
    }

    public function edit(Artikel $artikel): Response
    {
        return Inertia::render('guru-bk/artikel/edit', [
            'artikel' => $artikel,
        ]);
    }

    public function update(Request $request, Artikel $artikel): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'required|in:draft,published',
        ]);

        if ($request->hasFile('gambar')) {
            if ($artikel->gambar) {
                Storage::disk('public')->delete($artikel->gambar);
            }
            $validated['gambar'] = $request->file('gambar')->store('artikel', 'public');
        } else {
            unset($validated['gambar']);
        }

        if ($validated['status'] === 'published' && $artikel->status === 'draft') {
            $validated['published_at'] = now();
        } elseif ($validated['status'] === 'draft') {
            $validated['published_at'] = null;
        }

        $artikel->update($validated);

        return redirect()->route('guru-bk.artikel.index')
            ->with('success', 'Artikel berhasil diperbarui.');
    }

    public function destroy(Artikel $artikel): RedirectResponse
    {
        $artikel->delete();

        return redirect()->route('guru-bk.artikel.index')
            ->with('success', 'Artikel berhasil dihapus.');
    }
}
