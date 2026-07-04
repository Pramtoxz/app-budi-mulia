<?php

namespace App\Http\Controllers\GuruBk;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KategoriController extends Controller
{
    public function index(): Response
    {
        $kategori = Kategori::withCount('pengajuan')->latest()->get();

        return Inertia::render('guru-bk/kategori/index', [
            'kategori' => $kategori,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:kategori,nama',
            'deskripsi' => 'nullable|string',
        ]);

        Kategori::create($validated);

        return redirect()->route('guru-bk.kategori.index')
            ->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, Kategori $kategori): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:kategori,nama,' . $kategori->id,
            'deskripsi' => 'nullable|string',
        ]);

        $kategori->update($validated);

        return redirect()->route('guru-bk.kategori.index')
            ->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Kategori $kategori): RedirectResponse
    {
        if ($kategori->pengajuan()->exists()) {
            return redirect()->route('guru-bk.kategori.index')
                ->with('error', 'Kategori tidak bisa dihapus karena masih digunakan oleh pengajuan.');
        }

        $kategori->delete();

        return redirect()->route('guru-bk.kategori.index')
            ->with('success', 'Kategori berhasil dihapus.');
    }
}
