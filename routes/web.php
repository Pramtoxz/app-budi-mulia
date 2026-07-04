<?php

use App\Http\Controllers\GuruBk\JadwalController;
use App\Http\Controllers\GuruBk\KelasController;
use App\Http\Controllers\GuruBk\KategoriController;
use App\Http\Controllers\GuruBk\SiswaController;
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
});

Route::middleware(['auth', 'role:kepala_sekolah'])->prefix('kepsek')->name('kepsek.')->group(function () {
    //
});

Route::middleware(['auth', 'role:siswa'])->prefix('siswa')->name('siswa.')->group(function () {
    //
});

require __DIR__.'/settings.php';
