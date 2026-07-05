<?php

namespace App\Http\Controllers\GuruBk;

use App\Http\Controllers\Controller;
use App\Models\Hasil;
use App\Models\Konseling;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KonselingController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->get('status');
        $search = $request->get('search');

        $konseling = Konseling::with(['pengajuan.siswa', 'pengajuan.kategori', 'hasil'])
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($search, fn ($q) => $q->whereHas('pengajuan.siswa', fn ($sq) => $sq->where('nama', 'like', "%{$search}%")->orWhere('nis', 'like', "%{$search}%")))
            ->orderByRaw("CASE WHEN status = 'dijadwalkan' THEN 0 ELSE 1 END")
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('guru-bk/konseling/index', [
            'konseling' => $konseling,
            'filters' => $request->only('status', 'search'),
        ]);
    }

    public function show(Konseling $konseling): Response
    {
        $konseling->load(['pengajuan.siswa', 'pengajuan.kategori', 'hasil']);

        return Inertia::render('guru-bk/konseling/show', [
            'konseling' => $konseling,
        ]);
    }

    public function inputHasil(Request $request, Konseling $konseling): RedirectResponse
    {
        if ($konseling->hasil) {
            return redirect()->back()
                ->with('error', 'Konseling ini sudah memiliki hasil.');
        }

        $validated = $request->validate([
            'solusi' => 'required|string',
            'tindak_lanjut' => 'nullable|string',
        ]);

        Hasil::create([
            'konseling_id' => $konseling->id,
            'tgl_hasil' => now(),
            'solusi' => $validated['solusi'],
            'tindak_lanjut' => $validated['tindak_lanjut'] ?? null,
        ]);

        $konseling->update(['status' => 'selesai']);

        return redirect()->route('guru-bk.konseling.show', $konseling)
            ->with('success', 'Hasil konseling berhasil disimpan.');
    }

    public function editHasil(Konseling $konseling): Response
    {
        $konseling->load(['pengajuan.siswa', 'pengajuan.kategori', 'hasil']);

        if (!$konseling->hasil) {
            return redirect()->route('guru-bk.konseling.show', $konseling)
                ->with('error', 'Konseling ini belum memiliki hasil.');
        }

        return Inertia::render('guru-bk/konseling/edit-hasil', [
            'konseling' => $konseling,
        ]);
    }

    public function updateHasil(Request $request, Konseling $konseling): RedirectResponse
    {
        if (!$konseling->hasil) {
            return redirect()->back()
                ->with('error', 'Konseling ini belum memiliki hasil.');
        }

        $validated = $request->validate([
            'solusi' => 'required|string',
            'tindak_lanjut' => 'nullable|string',
        ]);

        $konseling->hasil->update($validated);

        return redirect()->route('guru-bk.konseling.show', $konseling)
            ->with('success', 'Hasil konseling berhasil diperbarui.');
    }
}
