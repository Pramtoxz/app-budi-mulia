<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Hasil;
use App\Models\Jadwal;
use App\Models\Kategori;
use App\Models\Kelas;
use App\Models\Konseling;
use App\Models\Pengajuan;
use App\Models\Pengumuman;
use App\Models\Setting;
use App\Models\SiswaKelas;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    private const VALID_JENIS = [
        'kelas', 'siswa', 'siswa-kelas', 'kategori', 'ketersediaan',
        'pengajuan', 'konseling', 'hasil', 'artikel', 'pengumuman',
    ];

    private const JENIS_LABELS = [
        'kelas'        => 'Laporan Kelas',
        'siswa'        => 'Laporan Siswa',
        'siswa-kelas'  => 'Laporan Siswa-Kelas',
        'kategori'     => 'Laporan Kategori',
        'ketersediaan' => 'Laporan Ketersediaan',
        'pengajuan'    => 'Laporan Pengajuan',
        'konseling'    => 'Laporan Konseling',
        'hasil'        => 'Laporan Hasil',
        'artikel'      => 'Laporan Artikel',
        'pengumuman'   => 'Laporan Pengumuman',
    ];

    private function tahunRange(string $tahunAjaran): array
    {
        [$y1, $y2] = array_pad(explode('/', $tahunAjaran), 2, null);
        $y2 ??= (string)((int)$y1 + 1);
        return ["{$y1}-07-01", "{$y2}-06-30"];
    }

    public function show(Request $request, string $jenis): Response
    {
        abort_unless(in_array($jenis, self::VALID_JENIS), 404);

        $tahunAjaran = $request->input('tahun_ajaran');
        $data        = $tahunAjaran ? $this->getData($jenis, $request) : null;
        $role        = auth()->user()->role;
        $baseUrl     = $role === 'guru_bk' ? '/guru-bk' : '/kepsek';

        return Inertia::render('laporan/show', [
            'jenis'          => $jenis,
            'jenisLabel'     => self::JENIS_LABELS[$jenis],
            'tahunAjaran'    => $tahunAjaran,
            'data'           => $data,
            'kelasList'      => Kelas::orderBy('nama')->get(['id', 'nama']),
            'kategoriList'   => Kategori::orderBy('nama')->get(['id', 'nama']),
            'guruBkList'     => User::where('role', 'guru_bk')->orderBy('name')->get(['id', 'name']),
            'role'           => $role,
            'baseUrl'        => $baseUrl,
            'namaSekolah'    => Setting::get('nama_sekolah', 'SMP IT Budi Mulia Padang'),
            'filterKelasId'    => $request->input('kelas_id'),
            'filterStatus'     => $request->input('status'),
            'filterGuruBkId'   => $request->input('guru_bk_id'),
            'filterKategoriId' => $request->input('kategori_id'),
        ]);
    }

    public function pdf(Request $request, string $jenis): HttpResponse
    {
        abort_unless(in_array($jenis, self::VALID_JENIS), 404);

        $tahunAjaran = $request->input('tahun_ajaran');
        abort_if(!$tahunAjaran, 400, 'Tahun ajaran wajib diisi.');

        $data        = $this->getData($jenis, $request);
        $label       = self::JENIS_LABELS[$jenis];
        $namaSekolah = Setting::get('nama_sekolah', 'SMP IT Budi Mulia Padang');

        $filterInfo = [];
        if ($request->kelas_id && $k = Kelas::find($request->kelas_id)) {
            $filterInfo[] = "Kelas: {$k->nama}";
        }
        if ($request->status) {
            $filterInfo[] = 'Status: ' . ucfirst(str_replace('_', ' ', $request->status));
        }
        if ($request->guru_bk_id && $g = User::find($request->guru_bk_id)) {
            $filterInfo[] = "Guru BK: {$g->name}";
        }
        if ($request->kategori_id && $kt = Kategori::find($request->kategori_id)) {
            $filterInfo[] = "Kategori: {$kt->nama}";
        }

        $pdf = Pdf::loadView('pdf.laporan', [
            'jenis'        => $jenis,
            'label'        => $label,
            'data'         => $data,
            'tahunAjaran'  => $tahunAjaran,
            'namaSekolah'  => $namaSekolah,
            'filterInfo'   => $filterInfo,
            'tanggalCetak' => now()->locale('id')->translatedFormat('d F Y'),
        ])->setPaper('a4', 'portrait');

        $filename = "laporan-{$jenis}-" . str_replace('/', '-', $tahunAjaran) . ".pdf";

        return $pdf->stream($filename);
    }

    private function getData(string $jenis, Request $request): array
    {
        $ta = $request->input('tahun_ajaran');
        return match ($jenis) {
            'kelas'        => $this->getKelas($ta),
            'siswa'        => $this->getSiswa($ta, $request->input('kelas_id')),
            'siswa-kelas'  => $this->getSiswaKelas($ta, $request->input('kelas_id'), $request->input('status')),
            'kategori'     => $this->getKategori($ta),
            'ketersediaan' => $this->getKetersediaan($request->input('guru_bk_id')),
            'pengajuan'    => $this->getPengajuan($ta, $request->input('status')),
            'konseling'    => $this->getKonseling($ta, $request->input('kelas_id'), $request->input('kategori_id')),
            'hasil'        => $this->getHasil($ta, $request->input('kelas_id')),
            'artikel'      => $this->getArtikel($ta, $request->input('status')),
            'pengumuman'   => $this->getPengumuman($ta, $request->input('status')),
            default        => [],
        };
    }

    private function getKelas(string $ta): array
    {
        return Kelas::orderBy('nama')->get()->map(fn ($k) => [
            'nama_kelas'   => $k->nama,
            'wali_kelas'   => $k->wali_kelas,
            'jumlah_siswa' => SiswaKelas::where('kelas_id', $k->id)
                ->where('tahun_ajaran', $ta)->where('status', 'aktif')->count(),
        ])->toArray();
    }

    private function getSiswa(string $ta, ?string $kelasId): array
    {
        $q = SiswaKelas::with(['siswa', 'kelas'])->where('tahun_ajaran', $ta);
        if ($kelasId) $q->where('kelas_id', $kelasId);

        return $q->orderBy('kelas_id')->get()->map(fn ($sk) => [
            'nis'    => $sk->siswa?->nis ?? '-',
            'nama'   => $sk->siswa?->nama ?? '-',
            'jenkel' => $sk->siswa?->jenkel === 'L' ? 'Laki-laki' : 'Perempuan',
            'agama'  => $sk->siswa?->agama ?? '-',
            'kelas'  => $sk->kelas?->nama ?? '-',
            'status' => ucfirst(str_replace('_', ' ', $sk->status)),
        ])->toArray();
    }

    private function getSiswaKelas(string $ta, ?string $kelasId, ?string $status): array
    {
        $q = SiswaKelas::with(['siswa', 'kelas'])->where('tahun_ajaran', $ta);
        if ($kelasId) $q->where('kelas_id', $kelasId);
        if ($status)  $q->where('status', $status);

        return $q->get()->map(fn ($sk) => [
            'nis'        => $sk->siswa?->nis ?? '-',
            'nama'       => $sk->siswa?->nama ?? '-',
            'kelas_asal' => $sk->kelas?->nama ?? '-',
            'status'     => ucfirst(str_replace('_', ' ', $sk->status)),
            'keterangan' => match ($sk->status) {
                'aktif'          => 'Siswa aktif',
                'lulus'          => "Lulus TA {$ta}",
                'pindah_sekolah' => 'Pindah sekolah',
                'keluar'         => 'Keluar',
                default          => '-',
            },
        ])->toArray();
    }

    private function getKategori(string $ta): array
    {
        [$start, $end] = $this->tahunRange($ta);
        return Kategori::orderBy('nama')->get()->map(fn ($k) => [
            'nama_kategori'    => $k->nama,
            'deskripsi'        => $k->deskripsi ?? '-',
            'jumlah_pengajuan' => Pengajuan::where('kategori_id', $k->id)
                ->whereBetween('tgl_pengajuan', [$start, $end])->count(),
        ])->toArray();
    }

    private function getKetersediaan(?string $guruBkId): array
    {
        $q = Jadwal::with('guruBk')
            ->orderByRaw("FIELD(hari,'Senin','Selasa','Rabu','Kamis','Jumat','Sabtu')")
            ->orderBy('jam_mulai');
        if ($guruBkId) $q->where('guru_bk_id', $guruBkId);

        return $q->get()->map(fn ($j) => [
            'nama_guru_bk' => $j->guruBk?->name ?? '-',
            'hari'         => $j->hari,
            'jam_mulai'    => $j->jam_mulai,
            'jam_selesai'  => $j->jam_selesai,
        ])->toArray();
    }

    private function getPengajuan(string $ta, ?string $status): array
    {
        [$start, $end] = $this->tahunRange($ta);
        $q = Pengajuan::with([
            'siswa',
            'kategori',
            'siswa.siswaKelas' => fn ($q) => $q->where('tahun_ajaran', $ta)->with('kelas'),
        ])->whereBetween('tgl_pengajuan', [$start, $end]);
        if ($status) $q->where('status', $status);

        return $q->orderBy('tgl_pengajuan')->get()->map(fn ($p) => [
            'tanggal'       => $p->tgl_pengajuan,
            'nis'           => $p->siswa?->nis ?? '-',
            'nama_siswa'    => $p->siswa?->nama ?? '-',
            'kelas'         => $p->siswa?->siswaKelas->first()?->kelas?->nama ?? '-',
            'kategori'      => $p->kategori?->nama ?? '-',
            'status'        => ucfirst($p->status),
            'diajukan_oleh' => ucfirst(str_replace('_', ' ', $p->diajukan_oleh)),
        ])->toArray();
    }

    private function getKonseling(string $ta, ?string $kelasId, ?string $kategoriId): array
    {
        [$start, $end] = $this->tahunRange($ta);
        $q = Konseling::with([
            'pengajuan.siswa',
            'pengajuan.kategori',
            'pengajuan.siswa.siswaKelas' => fn ($q) => $q->where('tahun_ajaran', $ta)->with('kelas'),
        ])->whereBetween('tgl_konseling', [$start, $end]);

        if ($kelasId) {
            $q->whereHas('pengajuan.siswa.siswaKelas', fn ($q) =>
                $q->where('kelas_id', $kelasId)->where('tahun_ajaran', $ta)
            );
        }
        if ($kategoriId) {
            $q->whereHas('pengajuan', fn ($q) => $q->where('kategori_id', $kategoriId));
        }

        return $q->orderBy('tgl_konseling')->get()->map(fn ($k) => [
            'tanggal'    => $k->tgl_konseling,
            'jam'        => $k->jam_konseling ?? '-',
            'nis'        => $k->pengajuan?->siswa?->nis ?? '-',
            'nama_siswa' => $k->pengajuan?->siswa?->nama ?? '-',
            'kelas'      => $k->pengajuan?->siswa?->siswaKelas->first()?->kelas?->nama ?? '-',
            'kategori'   => $k->pengajuan?->kategori?->nama ?? '-',
            'status'     => ucfirst($k->status),
            'keterangan' => $k->keterangan ?? '-',
        ])->toArray();
    }

    private function getHasil(string $ta, ?string $kelasId): array
    {
        [$start, $end] = $this->tahunRange($ta);
        $q = Hasil::with([
            'konseling.pengajuan.siswa',
            'konseling.pengajuan.kategori',
            'konseling.pengajuan.siswa.siswaKelas' => fn ($q) => $q->where('tahun_ajaran', $ta)->with('kelas'),
        ])->whereBetween('tgl_hasil', [$start, $end]);

        if ($kelasId) {
            $q->whereHas('konseling.pengajuan.siswa.siswaKelas', fn ($q) =>
                $q->where('kelas_id', $kelasId)->where('tahun_ajaran', $ta)
            );
        }

        return $q->orderBy('tgl_hasil')->get()->map(fn ($h) => [
            'tanggal_hasil' => $h->tgl_hasil,
            'nis'           => $h->konseling?->pengajuan?->siswa?->nis ?? '-',
            'nama_siswa'    => $h->konseling?->pengajuan?->siswa?->nama ?? '-',
            'kelas'         => $h->konseling?->pengajuan?->siswa?->siswaKelas->first()?->kelas?->nama ?? '-',
            'kategori'      => $h->konseling?->pengajuan?->kategori?->nama ?? '-',
            'solusi'        => $h->solusi ?? '-',
            'tindak_lanjut' => $h->tindak_lanjut ?? '-',
        ])->toArray();
    }

    private function getArtikel(string $ta, ?string $status): array
    {
        [$start, $end] = $this->tahunRange($ta);
        $q = Artikel::with('author')->whereBetween('created_at', [$start, $end]);
        if ($status) $q->where('status', $status);

        return $q->orderBy('created_at')->get()->map(fn ($a) => [
            'judul'           => $a->judul,
            'status'          => ucfirst($a->status),
            'tanggal_publish' => $a->published_at ?? '-',
            'author'          => $a->author?->name ?? '-',
        ])->toArray();
    }

    private function getPengumuman(string $ta, ?string $status): array
    {
        [$start, $end] = $this->tahunRange($ta);
        $q = Pengumuman::with('author')->whereBetween('created_at', [$start, $end]);
        if ($status) $q->where('status', $status);

        return $q->orderBy('created_at')->get()->map(fn ($a) => [
            'judul'           => $a->judul,
            'prioritas'       => ucfirst($a->prioritas),
            'status'          => ucfirst($a->status),
            'tanggal_publish' => $a->published_at ?? '-',
            'tanggal_berlaku' => $a->tgl_berlaku ?? '-',
        ])->toArray();
    }
}
