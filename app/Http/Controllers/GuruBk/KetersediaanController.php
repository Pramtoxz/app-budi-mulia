<?php

namespace App\Http\Controllers\GuruBk;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\JadwalBlokir;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KetersediaanController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        $jadwal = Jadwal::where('guru_bk_id', $user->id)
            ->orderByRaw("FIELD(hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')")
            ->get();

        $blokir = JadwalBlokir::where('guru_bk_id', $user->id)
            ->where('tgl_blokir', '>=', now()->toDateString())
            ->orderBy('tgl_blokir')
            ->get();

        $guruBkList = null;
        if ($user->isGuruBk()) {
            $guruBkList = User::where('role', 'guru_bk')->get(['id', 'name']);
        }

        return Inertia::render('guru-bk/ketersediaan/index', [
            'jadwal' => $jadwal,
            'blokir' => $blokir,
            'guruBkList' => $guruBkList,
        ]);
    }

    public function updateTemplate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hari' => 'required|array|min:1',
            'hari.*' => 'string',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
        ]);

        $user = auth()->user();

        Jadwal::where('guru_bk_id', $user->id)->delete();

        foreach ($validated['hari'] as $hari) {
            Jadwal::create([
                'hari' => $hari,
                'jam_mulai' => $validated['jam_mulai'],
                'jam_selesai' => $validated['jam_selesai'],
                'guru_bk_id' => $user->id,
            ]);
        }

        return redirect()->route('guru-bk.ketersediaan.index')
            ->with('success', 'Template ketersediaan berhasil disimpan.');
    }

    public function addBlokir(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tgl_blokir' => 'required|date|after_or_equal:today',
            'alasan' => 'nullable|string|max:255',
        ]);

        JadwalBlokir::create([
            ...$validated,
            'guru_bk_id' => auth()->id(),
        ]);

        return redirect()->route('guru-bk.ketersediaan.index')
            ->with('success', 'Tanggal berhasil diblokir.');
    }

    public function removeBlokir(JadwalBlokir $jadwalBlokir): RedirectResponse
    {
        if ($jadwalBlokir->guru_bk_id !== auth()->id()) {
            abort(403);
        }

        $jadwalBlokir->delete();

        return redirect()->route('guru-bk.ketersediaan.index')
            ->with('success', 'Blokir tanggal berhasil dihapus.');
    }
}
