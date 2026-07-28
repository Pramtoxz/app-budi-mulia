<?php

use App\Http\Controllers\DashboardController;

use App\Http\Controllers\GuruBk\ArtikelController;
use App\Http\Controllers\GuruBk\KelasController;
use App\Http\Controllers\GuruBk\KategoriController;
use App\Http\Controllers\GuruBk\KetersediaanController;
use App\Http\Controllers\GuruBk\KonselingController;
use App\Http\Controllers\GuruBk\PengajuanController as GuruBkPengajuanController;
use App\Http\Controllers\GuruBk\PengumumanController;
use App\Http\Controllers\GuruBk\SiswaController;
use App\Http\Controllers\GuruBk\SiswaKelasController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PublikController;
use App\Http\Controllers\Siswa\HasilController as SiswaHasilController;
use App\Http\Controllers\Siswa\PengajuanController as SiswaPengajuanController;
use App\Http\Controllers\Siswa\DashboardController as SiswaDashboardController;
use App\Models\Artikel;
use App\Models\Pengumuman;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $artikel = Artikel::with('author')->where('status', 'published')->latest('published_at')->limit(3)->get();
    $pengumuman = Pengumuman::with('author')->where('status', 'published')->latest('published_at')->limit(3)->get();

    return inertia('welcome', [
        'artikel' => $artikel,
        'pengumuman' => $pengumuman,
    ]);
})->name('home');

Route::get('/artikel', [PublikController::class, 'artikelIndex'])->name('publik.artikel');
Route::get('/artikel/{slug}', [PublikController::class, 'artikelShow'])->name('publik.artikel.show');
Route::get('/pengumuman', [PublikController::class, 'pengumumanIndex'])->name('publik.pengumuman');
Route::get('/pengumuman/{slug}', [PublikController::class, 'pengumumanShow'])->name('publik.pengumuman.show');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
});

Route::middleware(['auth', 'role:guru_bk'])->prefix('guru-bk')->name('guru-bk.')->group(function () {
    Route::resource('kelas', KelasController::class)->except(['show', 'create', 'edit'])->parameters(['kelas' => 'kelas']);
    Route::resource('siswa', SiswaController::class);
    Route::resource('kategori', KategoriController::class)->except(['show', 'create', 'edit']);

    Route::prefix('ketersediaan')->name('ketersediaan.')->group(function () {
        Route::get('/', [KetersediaanController::class, 'index'])->name('index');
        Route::post('/template', [KetersediaanController::class, 'updateTemplate'])->name('template');
        Route::post('/blokir', [KetersediaanController::class, 'addBlokir'])->name('blokir');
        Route::delete('/blokir/{jadwalBlokir}', [KetersediaanController::class, 'removeBlokir'])->name('blokir.remove');
    });

    Route::prefix('siswa-kelas')->name('siswa-kelas.')->group(function () {
        Route::get('/', [SiswaKelasController::class, 'index'])->name('index');
        Route::put('/{siswaKela}', [SiswaKelasController::class, 'update'])->name('update');
        Route::delete('/{siswaKela}', [SiswaKelasController::class, 'destroy'])->name('destroy');
        Route::get('/naik-kelas', [SiswaKelasController::class, 'naikKelasForm'])->name('naik-kelas');
        Route::post('/naik-kelas', [SiswaKelasController::class, 'naikKelas'])->name('naik-kelas.process');
    });

    Route::prefix('pengajuan')->name('pengajuan.')->group(function () {
        Route::get('/', [GuruBkPengajuanController::class, 'index'])->name('index');
        Route::get('/create', [GuruBkPengajuanController::class, 'createForm'])->name('create');
        Route::post('/', [GuruBkPengajuanController::class, 'store'])->name('store');
        Route::get('/{pengajuan}', [GuruBkPengajuanController::class, 'show'])->name('show');
        Route::get('/{pengajuan}/edit', [GuruBkPengajuanController::class, 'edit'])->name('edit');
        Route::put('/{pengajuan}', [GuruBkPengajuanController::class, 'update'])->name('update');
        Route::delete('/{pengajuan}', [GuruBkPengajuanController::class, 'destroy'])->name('destroy');
        Route::post('/{pengajuan}/approve', [GuruBkPengajuanController::class, 'approve'])->name('approve');
        Route::post('/{pengajuan}/reject', [GuruBkPengajuanController::class, 'reject'])->name('reject');
        Route::post('/{pengajuan}/cancel', [GuruBkPengajuanController::class, 'cancel'])->name('cancel');
    });

    Route::prefix('konseling')->name('konseling.')->group(function () {
        Route::get('/', [KonselingController::class, 'index'])->name('index');
        Route::get('/{konseling}', [KonselingController::class, 'show'])->name('show');
        Route::post('/{konseling}/hasil', [KonselingController::class, 'inputHasil'])->name('input-hasil');
        Route::get('/{konseling}/edit-hasil', [KonselingController::class, 'editHasil'])->name('edit-hasil');
        Route::put('/{konseling}/hasil', [KonselingController::class, 'updateHasil'])->name('update-hasil');
    });

    Route::resource('artikel', ArtikelController::class);
    Route::resource('pengumuman', PengumumanController::class);

    Route::prefix('laporan')->name('laporan.')->group(function () {
        Route::get('/{jenis}', [LaporanController::class, 'show'])->name('show');
        Route::get('/{jenis}/pdf', [LaporanController::class, 'pdf'])->name('pdf');
    });
});

Route::middleware(['auth', 'role:kepala_sekolah'])->prefix('kepsek')->name('kepsek.')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::prefix('laporan')->name('laporan.')->group(function () {
        Route::get('/{jenis}', [LaporanController::class, 'show'])->name('show');
        Route::get('/{jenis}/pdf', [LaporanController::class, 'pdf'])->name('pdf');
    });
});

Route::middleware(['auth', 'role:siswa'])->prefix('siswa')->name('siswa.')->group(function () {
    Route::get('/dashboard', [SiswaDashboardController::class, 'index'])->name('dashboard');

    Route::prefix('pengajuan')->name('pengajuan.')->group(function () {
        Route::get('/', [SiswaPengajuanController::class, 'index'])->name('index');
        Route::get('/create', [SiswaPengajuanController::class, 'create'])->name('create');
        Route::post('/', [SiswaPengajuanController::class, 'store'])->name('store');
        Route::get('/{pengajuan}', [SiswaPengajuanController::class, 'show'])->name('show');
        Route::get('/{pengajuan}/edit', [SiswaPengajuanController::class, 'edit'])->name('edit');
        Route::put('/{pengajuan}', [SiswaPengajuanController::class, 'update'])->name('update');
    });

    Route::prefix('hasil')->name('hasil.')->group(function () {
        Route::get('/', [SiswaHasilController::class, 'index'])->name('index');
        Route::get('/{hasil}', [SiswaHasilController::class, 'show'])->name('show');
    });
});

require __DIR__.'/settings.php';
