<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>{{ $label }} — {{ $tahunAjaran }}</title>
<style>
    @page {
        margin: 20mm 20mm 20mm 20mm;
    }
    body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 10pt;
        color: #000;
        line-height: 1.3;
    }

    /* ── KOP SURAT TABLE ── */
    table.kop-surat {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 2px;
    }
    table.kop-surat td {
        padding: 0;
        vertical-align: middle;
    }
    .kop-logo-left {
        width: 65px;
        text-align: left;
    }
    .kop-logo-right {
        width: 65px;
        text-align: right;
    }
    .kop-logo-left img,
    .kop-logo-right img {
        width: 55px;
        height: auto;
    }
    .kop-text {
        text-align: center;
        padding: 0 10px;
    }
    .kop-lembaga {
        font-size: 11pt;
        font-weight: bold;
        text-transform: uppercase;
    }
    .kop-sekolah {
        font-size: 15pt;
        font-weight: bold;
        text-transform: uppercase;
        margin: 2px 0;
    }
    .kop-alamat {
        font-size: 8.5pt;
        font-style: italic;
    }

    /* Garis Ganda Kop Surat */
    .line-double {
        border-top: 3px solid #000;
        border-bottom: 1px solid #000;
        height: 2px;
        margin-top: 5px;
        margin-bottom: 18px;
    }

    /* ── JUDUL DOKUMEN LAPORAN ── */
    .judul-container {
        text-align: center;
        margin-bottom: 18px;
    }
    .judul-laporan {
        font-size: 12pt;
        font-weight: bold;
        text-transform: uppercase;
        text-decoration: underline;
    }
    .sub-judul {
        font-size: 10pt;
        margin-top: 3px;
        font-weight: bold;
    }

    /* ── TABEL DATA DINAS ── */
    table.data-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
        margin-bottom: 15px;
    }
    table.data-table th,
    table.data-table td {
        border: 1px solid #000;
        padding: 5px 6px;
        font-size: 9pt;
        vertical-align: top;
    }
    table.data-table th {
        background-color: #f2f2f2;
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
    }
    table.data-table td.col-no {
        text-align: center;
        width: 30px;
    }
    .empty-cell {
        text-align: center;
        font-style: italic;
        padding: 15px;
    }

    .info-summary {
        font-size: 9pt;
        font-style: italic;
        margin-bottom: 30px;
    }

    /* ── BLOK TANDA TANGAN (FORMAL DINAS) ── */
    .ttd-container {
        width: 100%;
        margin-top: 20px;
        page-break-inside: avoid;
    }
    table.ttd-table {
        width: 100%;
        border-collapse: collapse;
    }
    table.ttd-table td {
        width: 50%;
        vertical-align: top;
        text-align: center;
        font-size: 9.5pt;
    }
    .ttd-jabatan {
        font-weight: bold;
    }
    .ttd-nama {
        font-weight: bold;
        text-decoration: underline;
        margin-top: 55px;
    }
    .ttd-nip {
        font-size: 9pt;
    }
</style>
</head>
<body>

{{-- ── KOP SURAT FORMAL DINAS (2 LOGO) ── --}}
@php
    // Logo Sekolah (Kiri)
    $pathSekolah = public_path('images/logo-sekolah.jpg');
    $base64Sekolah = '';
    if (file_exists($pathSekolah)) {
        $typeS = pathinfo($pathSekolah, PATHINFO_EXTENSION);
        $dataS = file_get_contents($pathSekolah);
        $base64Sekolah = 'data:image/' . $typeS . ';base64,' . base64_encode($dataS);
    }

    // Logo Tutwuri (Kanan)
    $pathTutwuri = public_path('images/tutwuri.png');
    $base64Tutwuri = '';
    if (file_exists($pathTutwuri)) {
        $typeT = pathinfo($pathTutwuri, PATHINFO_EXTENSION);
        $dataT = file_get_contents($pathTutwuri);
        $base64Tutwuri = 'data:image/' . $typeT . ';base64,' . base64_encode($dataT);
    }
@endphp

<table class="kop-surat">
    <tr>
        <td class="kop-logo-left">
            @if($base64Sekolah)
                <img src="{{ $base64Sekolah }}" alt="Logo Sekolah">
            @endif
        </td>
        <td class="kop-text">
            <div class="kop-lembaga">YAYASAN BUDI MULIA PADANG</div>
            <div class="kop-sekolah">{{ $namaSekolah }}</div>
            <div class="kop-lembaga">SATUAN PENDIDIKAN BIMBINGAN DAN KONSELING</div>
            <div class="kop-alamat">Jl. Prof. Dr. Hamka No. 1, Kota Padang, Sumatera Barat | Telp: (0751) 123456 | Email: bk@budimuliapadang.sch.id</div>
        </td>
        <td class="kop-logo-right">
            @if($base64Tutwuri)
                <img src="{{ $base64Tutwuri }}" alt="Logo Tut Wuri Handayani">
            @endif
        </td>
    </tr>
</table>
<div class="line-double"></div>

{{-- ── JUDUL LAPORAN ── --}}
<div class="judul-container">
    <div class="judul-laporan">{{ $label }}</div>
    <div class="sub-judul">TAHUN AJARAN {{ $tahunAjaran }}</div>
    @if(!empty($filterInfo))
        <div style="font-size: 9pt; font-style: italic; margin-top: 3px;">
            Filter: {{ implode(' | ', $filterInfo) }}
        </div>
    @endif
</div>

{{-- ── LOGIK KOLOM TABEL ── --}}
@php
    $columns = match($jenis) {
        'kelas'        => ['Nama Kelas', 'Wali Kelas', 'Jumlah Siswa'],
        'siswa'        => ['NIS', 'Nama Siswa', 'Jenis Kelamin', 'Agama', 'Kelas', 'Status'],
        'siswa-kelas'  => ['NIS', 'Nama Siswa', 'Kelas Asal', 'Status', 'Keterangan'],
        'kategori'     => ['Nama Kategori', 'Deskripsi Kategori', 'Total Pengajuan'],
        'ketersediaan' => ['Nama Guru BK', 'Hari', 'Jam Mulai', 'Jam Selesai'],
        'pengajuan'    => ['Tanggal', 'NIS', 'Nama Siswa', 'Kelas', 'Kategori', 'Status', 'Diajukan Oleh'],
        'konseling'    => ['Tanggal', 'Jam', 'NIS', 'Nama Siswa', 'Kelas', 'Kategori', 'Status', 'Keterangan'],
        'hasil'        => ['Tanggal Hasil', 'NIS', 'Nama Siswa', 'Kelas', 'Kategori', 'Rekomendasi / Solusi', 'Tindak Lanjut'],
        'artikel'      => ['Judul Artikel', 'Status', 'Tanggal Publikasi', 'Penulis / Author'],
        'pengumuman'   => ['Judul Pengumuman', 'Prioritas', 'Status', 'Tanggal Publish', 'Berlaku Sampai'],
        default        => [],
    };

    $fields = match($jenis) {
        'kelas'        => ['nama_kelas', 'wali_kelas', 'jumlah_siswa'],
        'siswa'        => ['nis', 'nama', 'jenkel', 'agama', 'kelas', 'status'],
        'siswa-kelas'  => ['nis', 'nama', 'kelas_asal', 'status', 'keterangan'],
        'kategori'     => ['nama_kategori', 'deskripsi', 'jumlah_pengajuan'],
        'ketersediaan' => ['nama_guru_bk', 'hari', 'jam_mulai', 'jam_selesai'],
        'pengajuan'    => ['tanggal', 'nis', 'nama_siswa', 'kelas', 'kategori', 'status', 'diajukan_oleh'],
        'konseling'    => ['tanggal', 'jam', 'nis', 'nama_siswa', 'kelas', 'kategori', 'status', 'keterangan'],
        'hasil'        => ['tanggal_hasil', 'nis', 'nama_siswa', 'kelas', 'kategori', 'solusi', 'tindak_lanjut'],
        'artikel'      => ['judul', 'status', 'tanggal_publish', 'author'],
        'pengumuman'   => ['judul', 'prioritas', 'status', 'tanggal_publish', 'tanggal_berlaku'],
        default        => [],
    };
@endphp

{{-- ── TABEL DINAS ── --}}
<table class="data-table">
    <thead>
        <tr>
            <th style="width: 30px;">NO</th>
            @foreach($columns as $col)
                <th>{{ $col }}</th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        @forelse($data as $i => $row)
            <tr>
                <td class="col-no">{{ $i + 1 }}</td>
                @foreach($fields as $field)
                    <td>{{ $row[$field] ?? '-' }}</td>
                @endforeach
            </tr>
        @empty
            <tr>
                <td colspan="{{ count($columns) + 1 }}" class="empty-cell">
                    Data tidak ditemukan untuk kriteria laporan ini.
                </td>
            </tr>
        @endforelse
    </tbody>
</table>

<div class="info-summary">
    Total Data: {{ count($data) }} baris terdaftar.
</div>

{{-- ── TANDA TANGAN FORMAL DINAS ── --}}
<div class="ttd-container">
    <table class="ttd-table">
        <tr>
            <td>
                <div>Mengetahui,</div>
                <div class="ttd-jabatan">Guru Bimbingan Konseling</div>
                <div class="ttd-nama">Guru BK, S.Pd</div>
                <div class="ttd-nip">NIP. 19850101 201001 1 002</div>
            </td>
            <td>
                <div>Padang, {{ $tanggalCetak }}</div>
                <div class="ttd-jabatan">Kepala {{ $namaSekolah }}</div>
                <div class="ttd-nama">Kepala Sekolah, M.Pd</div>
                <div class="ttd-nip">NIP. 19780312 200501 1 005</div>
            </td>
        </tr>
    </table>
</div>

</body>
</html>
