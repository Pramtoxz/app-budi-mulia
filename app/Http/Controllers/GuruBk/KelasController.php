<?php

namespace App\Http\Controllers\GuruBk;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KelasController extends Controller
{
    public function index(Request $request): Response
    {
        $kelas = Kelas::query()
            ->withCount('siswaKelas')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('guru-bk/kelas/index', [
            'kelas' => $kelas,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'wali_kelas' => 'nullable|string|max:255',
        ]);

        Kelas::create($validated);

        return redirect()->route('guru-bk.kelas.index')
            ->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function update(Request $request, Kelas $kelas): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'wali_kelas' => 'nullable|string|max:255',
        ]);

        $kelas->update($validated);

        return redirect()->route('guru-bk.kelas.index')
            ->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy(Kelas $kelas): RedirectResponse
    {
        if ($kelas->siswaKelas()->where('status', 'aktif')->exists()) {
            return redirect()->route('guru-bk.kelas.index')
                ->with('error', 'Kelas tidak bisa dihapus karena masih memiliki siswa aktif.');
        }

        $kelas->delete();

        return redirect()->route('guru-bk.kelas.index')
            ->with('success', 'Kelas berhasil dihapus.');
    }
}
