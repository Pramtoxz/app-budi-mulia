<?php

namespace App\Http\Controllers\GuruBk;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Konseling;
use App\Models\Jadwal;
use App\Models\JadwalBlokir;
use App\Models\Pengajuan;
use App\Models\Siswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->get('status');
        $search = $request->get('search');

        $pengajuan = Pengajuan::with(['siswa', 'kategori', 'konseling'])
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($search, fn ($q) => $q->whereHas('siswa', fn ($sq) => $sq->where('nama', 'like', "%{$search}%")->orWhere('nis', 'like', "%{$search}%")))
            ->orderByRaw("CASE WHEN status = 'menunggu' THEN 0 ELSE 1 END")
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('guru-bk/pengajuan/index', [
            'pengajuan' => $pengajuan,
            'filters' => $request->only('status', 'search'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'kategori_id' => 'required|exists:kategori,id',
            'catatan' => 'nullable|string',
        ]);

        $activeExists = Pengajuan::where('siswa_id', $validated['siswa_id'])
            ->whereIn('status', ['menunggu', 'disetujui'])
            ->exists();

        if ($activeExists) {
            return redirect()->back()
                ->with('error', 'Siswa ini masih memiliki pengajuan aktif.');
        }

        Pengajuan::create([
            ...$validated,
            'tgl_pengajuan' => now(),
            'status' => 'menunggu',
            'diajukan_oleh' => 'guru_bk',
        ]);

        return redirect()->route('guru-bk.pengajuan.index')
            ->with('success', 'Pengajuan berhasil dibuat untuk siswa.');
    }

    public function approve(Request $request, Pengajuan $pengajuan): RedirectResponse
    {
        if ($pengajuan->status !== 'menunggu') {
            return redirect()->back()
                ->with('error', 'Pengajuan ini sudah diproses.');
        }

        $validated = $request->validate([
            'tgl_konseling' => 'required|date',
            'jam_konseling' => 'required|date_format:H:i',
            'keterangan' => 'nullable|string',
        ]);

        $pengajuan->update(['status' => 'disetujui']);

        Konseling::create([
            'pengajuan_id' => $pengajuan->id,
            'tgl_konseling' => $validated['tgl_konseling'],
            'jam_konseling' => $validated['jam_konseling'],
            'status' => 'dijadwalkan',
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        return redirect()->back()
            ->with('success', 'Pengajuan disetujui dan konseling dijadwalkan.');
    }

    public function reject(Request $request, Pengajuan $pengajuan): RedirectResponse
    {
        if ($pengajuan->status !== 'menunggu') {
            return redirect()->back()
                ->with('error', 'Pengajuan ini sudah diproses.');
        }

        $validated = $request->validate([
            'alasan_penolakan' => 'required|string',
        ]);

        $pengajuan->update([
            'status' => 'ditolak',
            'alasan_penolakan' => $validated['alasan_penolakan'],
        ]);

        return redirect()->back()
            ->with('success', 'Pengajuan berhasil ditolak.');
    }

    public function cancel(Request $request, Pengajuan $pengajuan): RedirectResponse
    {
        if ($pengajuan->status !== 'disetujui') {
            return redirect()->back()
                ->with('error', 'Hanya pengajuan yang sudah disetujui yang bisa dibatalkan.');
        }

        $validated = $request->validate([
            'alasan_penolakan' => 'required|string',
        ]);

        $pengajuan->update([
            'status' => 'dibatalkan',
            'alasan_penolakan' => $validated['alasan_penolakan'],
        ]);

        return redirect()->back()
            ->with('success', 'Pengajuan berhasil dibatalkan.');
    }

    public function createForm(): Response
    {
        $siswaList = Siswa::orderBy('nama')->get(['id', 'nis', 'nama']);
        $kategoriList = Kategori::orderBy('nama')->get(['id', 'nama']);

        return Inertia::render('guru-bk/pengajuan/create', [
            'siswaList' => $siswaList,
            'kategoriList' => $kategoriList,
        ]);
    }

    public function show(Pengajuan $pengajuan): Response
    {
        $pengajuan->load(['siswa', 'kategori', 'konseling']);

        $jadwal = [];
        $blokir = [];

        if ($pengajuan->status === 'menunggu') {
            $user = auth()->user();
            $jadwal = Jadwal::where('guru_bk_id', $user->id)
                ->orderByRaw("FIELD(hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')")
                ->get(['hari', 'jam_mulai', 'jam_selesai']);
            $blokir = JadwalBlokir::where('guru_bk_id', $user->id)
                ->where('tgl_blokir', '>=', now()->toDateString())
                ->pluck('tgl_blokir')
                ->map(fn ($d) => $d->format('Y-m-d'))
                ->toArray();
        }

        return Inertia::render('guru-bk/pengajuan/show', [
            'pengajuan' => $pengajuan,
            'jadwalTemplate' => $jadwal,
            'blockedDates' => $blokir,
        ]);
    }

    public function edit(Pengajuan $pengajuan): Response
    {
        if ($pengajuan->status !== 'menunggu') {
            return redirect()->route('guru-bk.pengajuan.show', $pengajuan)
                ->with('error', 'Hanya pengajuan dengan status menunggu yang bisa diedit.');
        }

        $pengajuan->load(['siswa', 'kategori']);

        $kategoriList = Kategori::orderBy('nama')->get(['id', 'nama']);

        return Inertia::render('guru-bk/pengajuan/edit', [
            'pengajuan' => $pengajuan,
            'kategoriList' => $kategoriList,
        ]);
    }

    public function update(Request $request, Pengajuan $pengajuan): RedirectResponse
    {
        if ($pengajuan->status !== 'menunggu') {
            return redirect()->back()
                ->with('error', 'Hanya pengajuan dengan status menunggu yang bisa diedit.');
        }

        $validated = $request->validate([
            'kategori_id' => 'required|exists:kategori,id',
            'catatan' => 'nullable|string',
        ]);

        $pengajuan->update($validated);

        return redirect()->route('guru-bk.pengajuan.show', $pengajuan)
            ->with('success', 'Pengajuan berhasil diperbarui.');
    }

    public function destroy(Pengajuan $pengajuan): RedirectResponse
    {
        if ($pengajuan->status !== 'menunggu') {
            return redirect()->back()
                ->with('error', 'Hanya pengajuan dengan status menunggu yang bisa dihapus.');
        }

        $pengajuan->delete();

        return redirect()->route('guru-bk.pengajuan.index')
            ->with('success', 'Pengajuan berhasil dihapus.');
    }
}
