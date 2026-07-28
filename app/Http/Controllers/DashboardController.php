<?php

namespace App\Http\Controllers;

use App\Models\Hasil;
use App\Models\Konseling;
use App\Models\Pengajuan;
use App\Models\Setting;
use App\Models\Siswa;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $user = auth()->user();

        // Rekap Statistik Utama
        $totalSiswa = Siswa::count();
        $pengajuanMenunggu = Pengajuan::where('status', 'menunggu')->count();
        $pengajuanDisetujui = Pengajuan::where('status', 'disetujui')->count();
        $konselingSelesai = Konseling::where('status', 'selesai')->count();

        // 5 Pengajuan Terbaru
        $pengajuanTerbaru = Pengajuan::with(['siswa', 'kategori'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'nama_siswa' => $p->siswa?->nama ?? '-',
                'nis' => $p->siswa?->nis ?? '-',
                'kategori' => $p->kategori?->nama ?? '-',
                'tgl_pengajuan' => $p->tgl_pengajuan ? $p->tgl_pengajuan->format('Y-m-d') : '-',
                'status' => $p->status,
            ]);

        // 5 Jadwal Konseling Selesai / Terakhir
        $konselingTerbaru = Konseling::with(['pengajuan.siswa', 'pengajuan.kategori'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($k) => [
                'id' => $k->id,
                'nama_siswa' => $k->pengajuan?->siswa?->nama ?? '-',
                'kategori' => $k->pengajuan?->kategori?->nama ?? '-',
                'tgl_konseling' => $k->tgl_konseling ? $k->tgl_konseling->format('Y-m-d') : '-',
                'jam_konseling' => $k->jam_konseling ? substr((string) $k->jam_konseling, 0, 5) : '-',
                'status' => $k->status,
            ]);

        return Inertia::render('dashboard', [
            'role' => $user->role,
            'userName' => $user->name,
            'tahunAjaran' => Setting::get('tahun_ajaran_aktif', '2025/2026'),
            'stats' => [
                'totalSiswa' => $totalSiswa,
                'pengajuanMenunggu' => $pengajuanMenunggu,
                'pengajuanDisetujui' => $pengajuanDisetujui,
                'konselingSelesai' => $konselingSelesai,
            ],
            'pengajuanTerbaru' => $pengajuanTerbaru,
            'konselingTerbaru' => $konselingTerbaru,
        ]);
    }
}
