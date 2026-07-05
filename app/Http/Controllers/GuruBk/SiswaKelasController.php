<?php

namespace App\Http\Controllers\GuruBk;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Setting;
use App\Models\Siswa;
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

        $query = SiswaKelas::with(['siswa', 'kelas'])
            ->when($tahunAjaran, fn ($q) => $q->where('tahun_ajaran', $tahunAjaran))
            ->when($kelasId, fn ($q) => $q->where('kelas_id', $kelasId))
            ->orderBy('kelas_id')
            ->orderBy('siswa_id');

        $siswaKelas = $query->get();
        $kelasList = Kelas::orderBy('nama')->get();
        $tahunAjaranList = SiswaKelas::distinct()->pluck('tahun_ajaran')->sort()->values();

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

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'kelas_id' => 'required|exists:kelas,id',
            'tahun_ajaran' => 'required|string|max:20',
        ]);

        $exists = SiswaKelas::where('siswa_id', $validated['siswa_id'])
            ->where('kelas_id', $validated['kelas_id'])
            ->where('tahun_ajaran', $validated['tahun_ajaran'])
            ->exists();

        if ($exists) {
            return redirect()->back()
                ->with('error', 'Siswa sudah terdaftar di kelas ini pada tahun ajaran tersebut.');
        }

        SiswaKelas::create([...$validated, 'status' => 'aktif']);

        return redirect()->back()
            ->with('success', 'Siswa berhasil ditambahkan ke kelas.');
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

    public function naikKelasForm(): Response
    {
        $tahunAjaranAktif = Setting::get('tahun_ajaran_aktif', '');
        $kelasList = Kelas::orderBy('nama')->get();

        $siswaPerKelas = [];
        foreach ($kelasList as $kelas) {
            $count = SiswaKelas::where('kelas_id', $kelas->id)
                ->where('tahun_ajaran', $tahunAjaranAktif)
                ->where('status', 'aktif')
                ->count();
            $siswaPerKelas[$kelas->id] = $count;
        }

        return Inertia::render('guru-bk/siswa-kelas/naik-kelas', [
            'kelasList' => $kelasList,
            'siswaPerKelas' => $siswaPerKelas,
            'tahunAjaranAktif' => $tahunAjaranAktif,
        ]);
    }

    public function naikKelas(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kelas_asal_id' => 'required|exists:kelas,id',
            'kelas_tujuan_id' => 'required|exists:kelas,id|different:kelas_asal_id',
            'tahun_ajaran_asal' => 'required|string|max:20',
            'tahun_ajaran_tujuan' => 'required|string|max:20',
        ]);

        $siswaKelas = SiswaKelas::where('kelas_id', $validated['kelas_asal_id'])
            ->where('tahun_ajaran', $validated['tahun_ajaran_asal'])
            ->where('status', 'aktif')
            ->get();

        if ($siswaKelas->isEmpty()) {
            return redirect()->back()
                ->with('error', 'Tidak ada siswa aktif di kelas asal.');
        }

        $moved = 0;
        foreach ($siswaKelas as $sk) {
            $exists = SiswaKelas::where('siswa_id', $sk->siswa_id)
                ->where('kelas_id', $validated['kelas_tujuan_id'])
                ->where('tahun_ajaran', $validated['tahun_ajaran_tujuan'])
                ->exists();

            if (!$exists) {
                SiswaKelas::create([
                    'siswa_id' => $sk->siswa_id,
                    'kelas_id' => $validated['kelas_tujuan_id'],
                    'tahun_ajaran' => $validated['tahun_ajaran_tujuan'],
                    'status' => 'aktif',
                ]);
                $sk->update(['status' => 'lulus']);
                $moved++;
            }
        }

        return redirect()->route('guru-bk.siswa-kelas.index')
            ->with('success', "{$moved} siswa berhasil dipindahkan ke kelas tujuan.");
    }

    public function assignForm(): Response
    {
        $siswaList = Siswa::orderBy('nama')->get(['id', 'nis', 'nama']);
        $kelasList = Kelas::orderBy('nama')->get();
        $tahunAjaranAktif = Setting::get('tahun_ajaran_aktif', '');

        return Inertia::render('guru-bk/siswa-kelas/assign', [
            'siswaList' => $siswaList,
            'kelasList' => $kelasList,
            'tahunAjaranAktif' => $tahunAjaranAktif,
        ]);
    }
}
