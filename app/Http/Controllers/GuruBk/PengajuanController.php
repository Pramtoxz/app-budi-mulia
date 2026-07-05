<?php

namespace App\Http\Controllers\GuruBk;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Kategori;
use App\Models\Pengajuan;
use App\Models\Setting;
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

        $pengajuan = Pengajuan::with(['siswa', 'jadwal.guruBk', 'kategori', 'konseling'])
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($search, fn ($q) => $q->whereHas('siswa', fn ($sq) => $sq->where('nama', 'like', "%{$search}%")->orWhere('nis', 'like', "%{$search}%")))
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
            'jadwal_id' => 'required|exists:jadwal,id',
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

    public function approve(Pengajuan $pengajuan): RedirectResponse
    {
        if ($pengajuan->status !== 'menunggu') {
            return redirect()->back()
                ->with('error', 'Pengajuan ini sudah diproses.');
        }

        $pengajuan->update(['status' => 'disetujui']);

        return redirect()->back()
            ->with('success', 'Pengajuan berhasil disetujui.');
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
        $jadwalList = Jadwal::with('guruBk:id,name')->orderBy('hari')->get();

        return Inertia::render('guru-bk/pengajuan/create', [
            'siswaList' => $siswaList,
            'kategoriList' => $kategoriList,
            'jadwalList' => $jadwalList,
        ]);
    }
}
