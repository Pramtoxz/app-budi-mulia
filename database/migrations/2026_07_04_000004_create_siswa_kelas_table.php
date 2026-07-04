<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('siswa_kelas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->cascadeOnDelete();
            $table->foreignId('kelas_id')->constrained('kelas')->cascadeOnDelete();
            $table->string('tahun_ajaran');
            $table->enum('status', ['aktif', 'lulus', 'pindah_sekolah', 'keluar'])->default('aktif');
            $table->timestamps();

            $table->unique(['siswa_id', 'kelas_id', 'tahun_ajaran']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('siswa_kelas');
    }
};
