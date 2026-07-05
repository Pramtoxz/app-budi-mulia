<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Kategori;
use App\Models\Pengajuan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $siswa = $user->siswa;

        if (!$siswa) {
            return Inertia::render('siswa/pengajuan/index', [
                'pengajuan' => [],
                'siswaNotFound' => true,
            ]);
        }

        $pengajuan = Pengajuan::with(['jadwal.guruBk', 'kategori', 'konseling'])
            ->where('siswa_id', $siswa->id)
            ->latest()
            ->get();

        return Inertia::render('siswa/pengajuan/index', [
            'pengajuan' => $pengajuan,
            'siswaNotFound' => false,
        ]);
    }

    public function create(): Response
    {
        $user = auth()->user();
        $siswa = $user->siswa;

        if (!$siswa) {
            return redirect()->route('siswa.pengajuan.index')
                ->with('error', 'Data siswa tidak ditemukan. Hubungi Guru BK.');
        }

        $activeExists = Pengajuan::where('siswa_id', $siswa->id)
            ->whereIn('status', ['menunggu', 'disetujui'])
            ->exists();

        $kategoriList = Kategori::orderBy('nama')->get(['id', 'nama']);
        $jadwalList = Jadwal::with('guruBk:id,name')->orderBy('hari')->get();

        return Inertia::render('siswa/pengajuan/create', [
            'kategoriList' => $kategoriList,
            'jadwalList' => $jadwalList,
            'hasActivePengajuan' => $activeExists,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = auth()->user();
        $siswa = $user->siswa;

        if (!$siswa) {
            return redirect()->back()
                ->with('error', 'Data siswa tidak ditemukan.');
        }

        $activeExists = Pengajuan::where('siswa_id', $siswa->id)
            ->whereIn('status', ['menunggu', 'disetujui'])
            ->exists();

        if ($activeExists) {
            return redirect()->back()
                ->with('error', 'Anda masih memiliki pengajuan aktif. Tunggu sampai selesai.');
        }

        $validated = $request->validate([
            'jadwal_id' => 'required|exists:jadwal,id',
            'kategori_id' => 'required|exists:kategori,id',
            'catatan' => 'nullable|string',
        ]);

        Pengajuan::create([
            ...$validated,
            'siswa_id' => $siswa->id,
            'tgl_pengajuan' => now(),
            'status' => 'menunggu',
            'diajukan_oleh' => 'siswa',
        ]);

        return redirect()->route('siswa.pengajuan.index')
            ->with('success', 'Pengajuan berhasil dikirim. Tunggu persetujuan Guru BK.');
    }

    public function show(Pengajuan $pengajuan): Response
    {
        $user = auth()->user();
        $siswa = $user->siswa;

        if (!$siswa || $pengajuan->siswa_id !== $siswa->id) {
            abort(403);
        }

        $pengajuan->load(['jadwal.guruBk', 'kategori', 'konseling']);

        return Inertia::render('siswa/pengajuan/show', [
            'pengajuan' => $pengajuan,
        ]);
    }
}
