<?php

namespace App\Http\Controllers\GuruBk;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiswaController extends Controller
{
    public function index(Request $request): Response
    {
        $siswa = Siswa::query()
            ->with(['siswaKelas' => fn ($q) => $q->where('status', 'aktif')->with('kelas')])
            ->when($request->search, fn ($q, $search) => $q->where('nama', 'like', "%{$search}%")->orWhere('nis', 'like', "%{$search}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('guru-bk/siswa/index', [
            'siswa' => $siswa,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('guru-bk/siswa/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nis' => 'required|string|max:50|unique:siswa,nis',
            'nama' => 'required|string|max:255',
            'jenkel' => 'required|in:L,P',
            'tempat_lahir' => 'nullable|string|max:255',
            'tgl_lahir' => 'nullable|date',
            'agama' => 'nullable|string|max:50',
            'alamat' => 'nullable|string',
            'nama_ayah' => 'nullable|string|max:255',
            'pekerjaan_ayah' => 'nullable|string|max:255',
            'alamat_ayah' => 'nullable|string',
            'no_hp_ayah' => 'nullable|string|max:20',
            'nama_ibu' => 'nullable|string|max:255',
            'pekerjaan_ibu' => 'nullable|string|max:255',
            'alamat_ibu' => 'nullable|string',
            'no_hp_ibu' => 'nullable|string|max:20',
        ]);

        Siswa::create($validated);

        return redirect()->route('guru-bk.siswa.index')
            ->with('success', 'Siswa berhasil ditambahkan.');
    }

    public function show(Siswa $siswa): Response
    {
        $siswa->load(['siswaKelas.kelas', 'pengajuan.kategori']);

        return Inertia::render('guru-bk/siswa/show', [
            'siswa' => $siswa,
        ]);
    }

    public function edit(Siswa $siswa): Response
    {
        return Inertia::render('guru-bk/siswa/edit', [
            'siswa' => $siswa,
        ]);
    }

    public function update(Request $request, Siswa $siswa): RedirectResponse
    {
        $validated = $request->validate([
            'nis' => 'required|string|max:50|unique:siswa,nis,' . $siswa->id,
            'nama' => 'required|string|max:255',
            'jenkel' => 'required|in:L,P',
            'tempat_lahir' => 'nullable|string|max:255',
            'tgl_lahir' => 'nullable|date',
            'agama' => 'nullable|string|max:50',
            'alamat' => 'nullable|string',
            'nama_ayah' => 'nullable|string|max:255',
            'pekerjaan_ayah' => 'nullable|string|max:255',
            'alamat_ayah' => 'nullable|string',
            'no_hp_ayah' => 'nullable|string|max:20',
            'nama_ibu' => 'nullable|string|max:255',
            'pekerjaan_ibu' => 'nullable|string|max:255',
            'alamat_ibu' => 'nullable|string',
            'no_hp_ibu' => 'nullable|string|max:20',
        ]);

        $siswa->update($validated);

        return redirect()->route('guru-bk.siswa.index')
            ->with('success', 'Data siswa berhasil diperbarui.');
    }

    public function destroy(Siswa $siswa): RedirectResponse
    {
        if ($siswa->pengajuan()->whereIn('status', ['menunggu', 'disetujui'])->exists()) {
            return redirect()->route('guru-bk.siswa.index')
                ->with('error', 'Siswa tidak bisa dihapus karena memiliki pengajuan aktif.');
        }

        $siswa->delete();

        return redirect()->route('guru-bk.siswa.index')
            ->with('success', 'Siswa berhasil dihapus.');
    }
}
