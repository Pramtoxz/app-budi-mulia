<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Hasil;
use Inertia\Inertia;
use Inertia\Response;

class HasilController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $siswa = $user->siswa;

        if (!$siswa) {
            return Inertia::render('siswa/hasil/index', [
                'hasilList' => [],
                'siswaNotFound' => true,
            ]);
        }

        $hasilList = Hasil::with(['konseling.pengajuan.kategori'])
            ->whereHas('konseling.pengajuan', fn ($q) => $q->where('siswa_id', $siswa->id))
            ->latest('tgl_hasil')
            ->get();

        return Inertia::render('siswa/hasil/index', [
            'hasilList' => $hasilList,
            'siswaNotFound' => false,
        ]);
    }

    public function show(Hasil $hasil): Response
    {
        $user = auth()->user();
        $siswa = $user->siswa;

        if (!$siswa) {
            abort(403);
        }

        $hasil->load(['konseling.pengajuan.siswa', 'konseling.pengajuan.kategori']);

        if ($hasil->konseling->pengajuan->siswa_id !== $siswa->id) {
            abort(403);
        }

        return Inertia::render('siswa/hasil/show', [
            'hasil' => $hasil,
        ]);
    }
}
