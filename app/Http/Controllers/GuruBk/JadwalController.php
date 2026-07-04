<?php

namespace App\Http\Controllers\GuruBk;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JadwalController extends Controller
{
    public function index(): Response
    {
        $jadwal = Jadwal::with('guruBk:id,name')->latest()->get();

        $guruBkList = User::where('role', 'guru_bk')->get(['id', 'name']);

        return Inertia::render('guru-bk/jadwal/index', [
            'jadwal' => $jadwal,
            'guruBkList' => $guruBkList,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hari' => 'required|string|max:20',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'guru_bk_id' => 'required|exists:users,id',
        ]);

        Jadwal::create($validated);

        return redirect()->route('guru-bk.jadwal.index')
            ->with('success', 'Jadwal berhasil ditambahkan.');
    }

    public function update(Request $request, Jadwal $jadwal): RedirectResponse
    {
        $validated = $request->validate([
            'hari' => 'required|string|max:20',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'guru_bk_id' => 'required|exists:users,id',
        ]);

        $jadwal->update($validated);

        return redirect()->route('guru-bk.jadwal.index')
            ->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(Jadwal $jadwal): RedirectResponse
    {
        if ($jadwal->pengajuan()->whereIn('status', ['menunggu', 'disetujui'])->exists()) {
            return redirect()->route('guru-bk.jadwal.index')
                ->with('error', 'Jadwal tidak bisa dihapus karena memiliki pengajuan aktif.');
        }

        $jadwal->delete();

        return redirect()->route('guru-bk.jadwal.index')
            ->with('success', 'Jadwal berhasil dihapus.');
    }
}
