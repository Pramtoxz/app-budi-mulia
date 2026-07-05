<?php

namespace App\Http\Controllers\GuruBk;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Setting;
use App\Models\SiswaKelas;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiswaKelasController extends Controller
{
    public function index(Request $request): Response
    {
        $tahunAjaran = $request->get('tahun_ajaran', Setting::get('tahun_ajaran_aktif', ''));
        $kelasId = $request->get('kelas_id');

        $kelasList = Kelas::orderBy('nama')->get();
        $tahunAjaranList = SiswaKelas::distinct()->pluck('tahun_ajaran')->sort()->values();

        $siswaKelas = null;
        if ($kelasId) {
            $siswaKelas = SiswaKelas::with(['siswa', 'kelas'])
                ->where('kelas_id', $kelasId)
                ->when($tahunAjaran, fn ($q) => $q->where('tahun_ajaran', $tahunAjaran))
                ->orderBy('siswa_id')
                ->paginate(50)
                ->withQueryString();
        }

        return Inertia::render('guru-bk/siswa-kelas/index', [
            'siswaKelas' => $siswaKelas,
            'kelasList' => $kelasList,
            'tahunAjaranList' => $tahunAjaranList,
            'filters' => [
                'tahun_ajaran' => $tahunAjaran,
                'kelas_id' => $kelasId ? (int) $kelasId : null,
            ],
        ]);
    }

    public function update(Request $request, SiswaKelas $siswaKelas): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:aktif,lulus,pindah_sekolah,keluar',
        ]);

        $siswaKelas->update($validated);

        return redirect()->back()
            ->with('success', 'Status siswa berhasil diperbarui.');
    }

    public function destroy(SiswaKelas $siswaKelas): RedirectResponse
    {
        $siswaKelas->delete();

        return redirect()->back()
            ->with('success', 'Siswa berhasil dikeluarkan dari kelas.');
    }

    public function naikKelasForm(Request $request): Response
    {
        $tahunAjaranAktif = Setting::get('tahun_ajaran_aktif', '');
        $kelasId = $request->get('kelas_id');
        $kelasList = Kelas::orderBy('nama')->get();

        $siswaList = collect();
        if ($kelasId) {
            $siswaList = SiswaKelas::with('siswa')
                ->where('kelas_id', $kelasId)
                ->where('tahun_ajaran', $tahunAjaranAktif)
                ->where('status', 'aktif')
                ->orderBy('siswa_id')
                ->get();
        }

        [$tahunAsal, $tahunTujuan] = explode('/', $tahunAjaranAktif);
        $nextTahunAjaran = (int)$tahunAsal + 1 . '/' . ((int)$tahunTujuan + 1);

        return Inertia::render('guru-bk/siswa-kelas/naik-kelas', [
            'kelasList' => $kelasList,
            'siswaList' => $siswaList,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'nextTahunAjaran' => $nextTahunAjaran,
            'selectedKelasId' => $kelasId ? (int) $kelasId : null,
        ]);
    }

    public function naikKelas(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tahun_ajaran_tujuan' => 'required|string|max:20',
            'siswa' => 'required|array|min:1',
            'siswa.*.siswa_id' => 'required|exists:siswa,id',
            'siswa.*.status' => 'required|in:naik,tidak_naik,pindah_sekolah,lulus',
            'siswa.*.kelas_tujuan_id' => 'nullable|exists:kelas,id',
        ]);

        $moved = 0;
        $tahunAjaranAktif = Setting::get('tahun_ajaran_aktif', '');

        foreach ($validated['siswa'] as $item) {
            $sk = SiswaKelas::where('siswa_id', $item['siswa_id'])
                ->where('tahun_ajaran', $tahunAjaranAktif)
                ->where('status', 'aktif')
                ->first();

            if (!$sk) continue;

            if ($item['status'] === 'naik' && !empty($item['kelas_tujuan_id'])) {
                $exists = SiswaKelas::where('siswa_id', $item['siswa_id'])
                    ->where('tahun_ajaran', $validated['tahun_ajaran_tujuan'])
                    ->exists();

                if (!$exists) {
                    SiswaKelas::create([
                        'siswa_id' => $item['siswa_id'],
                        'kelas_id' => $item['kelas_tujuan_id'],
                        'tahun_ajaran' => $validated['tahun_ajaran_tujuan'],
                        'status' => 'aktif',
                    ]);
                    $sk->update(['status' => 'lulus']);
                    $moved++;
                }
            } elseif ($item['status'] === 'tidak_naik') {
                $sk->update(['status' => 'aktif']);
            } elseif ($item['status'] === 'pindah_sekolah') {
                $sk->update(['status' => 'pindah_sekolah']);
            } elseif ($item['status'] === 'lulus') {
                $sk->update(['status' => 'lulus']);
            }
        }

        return redirect()->route('guru-bk.siswa-kelas.index')
            ->with('success', "Proses kenaikan kelas selesai. {$moved} siswa dipindahkan.");
    }
}
