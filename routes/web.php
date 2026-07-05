<?php

use App\Http\Controllers\GuruBk\JadwalController;
use App\Http\Controllers\GuruBk\KelasController;
use App\Http\Controllers\GuruBk\KategoriController;
use App\Http\Controllers\GuruBk\PengajuanController as GuruBkPengajuanController;
use App\Http\Controllers\GuruBk\SiswaController;
use App\Http\Controllers\GuruBk\SiswaKelasController;
use App\Http\Controllers\Siswa\PengajuanController as SiswaPengajuanController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'role:guru_bk'])->prefix('guru-bk')->name('guru-bk.')->group(function () {
    Route::resource('kelas', KelasController::class)->except(['show', 'create', 'edit'])->parameters(['kelas' => 'kelas']);
    Route::resource('siswa', SiswaController::class)->except(['create', 'edit']);
    Route::resource('kategori', KategoriController::class)->except(['show', 'create', 'edit']);
    Route::resource('jadwal', JadwalController::class)->except(['show', 'create', 'edit']);

    Route::prefix('siswa-kelas')->name('siswa-kelas.')->group(function () {
        Route::get('/', [SiswaKelasController::class, 'index'])->name('index');
        Route::post('/', [SiswaKelasController::class, 'store'])->name('store');
        Route::put('/{siswaKela}', [SiswaKelasController::class, 'update'])->name('update');
        Route::delete('/{siswaKela}', [SiswaKelasController::class, 'destroy'])->name('destroy');
        Route::get('/assign', [SiswaKelasController::class, 'assignForm'])->name('assign');
        Route::get('/naik-kelas', [SiswaKelasController::class, 'naikKelasForm'])->name('naik-kelas');
        Route::post('/naik-kelas', [SiswaKelasController::class, 'naikKelas'])->name('naik-kelas.process');
    });

    Route::prefix('pengajuan')->name('pengajuan.')->group(function () {
        Route::get('/', [GuruBkPengajuanController::class, 'index'])->name('index');
        Route::get('/create', [GuruBkPengajuanController::class, 'createForm'])->name('create');
        Route::post('/', [GuruBkPengajuanController::class, 'store'])->name('store');
        Route::post('/{pengajuan}/approve', [GuruBkPengajuanController::class, 'approve'])->name('approve');
        Route::post('/{pengajuan}/reject', [GuruBkPengajuanController::class, 'reject'])->name('reject');
        Route::post('/{pengajuan}/cancel', [GuruBkPengajuanController::class, 'cancel'])->name('cancel');
    });
});

Route::middleware(['auth', 'role:kepala_sekolah'])->prefix('kepsek')->name('kepsek.')->group(function () {
    //
});

Route::middleware(['auth', 'role:siswa'])->prefix('siswa')->name('siswa.')->group(function () {
    Route::prefix('pengajuan')->name('pengajuan.')->group(function () {
        Route::get('/', [SiswaPengajuanController::class, 'index'])->name('index');
        Route::get('/create', [SiswaPengajuanController::class, 'create'])->name('create');
        Route::post('/', [SiswaPengajuanController::class, 'store'])->name('store');
        Route::get('/{pengajuan}', [SiswaPengajuanController::class, 'show'])->name('show');
    });
});

require __DIR__.'/settings.php';
