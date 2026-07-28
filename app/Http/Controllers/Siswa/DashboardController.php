<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Pengajuan;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $siswa = $user->siswa;

        $pengajuanAktif = null;
        $totalPengajuan = 0;
        $totalSelesai = 0;

        if ($siswa) {
            $pengajuanAktif = Pengajuan::with(['kategori', 'konseling'])
                ->where('siswa_id', $siswa->id)
                ->whereIn('status', ['menunggu', 'disetujui'])
                ->latest()
                ->first();

            $totalPengajuan = Pengajuan::where('siswa_id', $siswa->id)->count();

            $totalSelesai = Pengajuan::where('siswa_id', $siswa->id)
                ->whereHas('konseling', fn ($q) => $q->where('status', 'selesai'))
                ->count();
        }

        $jadwalBk = Jadwal::with('guruBk')
            ->orderByRaw("FIELD(hari, 'Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu')")
            ->get(['id', 'hari', 'jam_mulai', 'jam_selesai', 'guru_bk_id'])
            ->map(function ($j) {
                return [
                    'id' => $j->id,
                    'hari' => $j->hari,
                    'jam_mulai' => substr((string) $j->jam_mulai, 0, 5),
                    'jam_selesai' => substr((string) $j->jam_selesai, 0, 5),
                    'guru_bk' => $j->guruBk ? ['id' => $j->guruBk->id, 'name' => $j->guruBk->name] : null,
                ];
            });

        return Inertia::render('siswa/dashboard', [
            'siswa'          => $siswa,
            'pengajuanAktif' => $pengajuanAktif ? [
                'id' => $pengajuanAktif->id,
                'status' => $pengajuanAktif->status,
                'tgl_pengajuan' => $pengajuanAktif->tgl_pengajuan ? $pengajuanAktif->tgl_pengajuan->format('Y-m-d') : '-',
                'catatan' => $pengajuanAktif->catatan,
                'kategori' => $pengajuanAktif->kategori,
                'konseling' => $pengajuanAktif->konseling,
            ] : null,
            'totalPengajuan' => $totalPengajuan,
            'totalSelesai'   => $totalSelesai,
            'jadwalBk'       => $jadwalBk,
        ]);
    }
}
