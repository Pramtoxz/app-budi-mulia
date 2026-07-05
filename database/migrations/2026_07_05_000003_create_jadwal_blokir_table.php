<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_blokir', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_bk_id')->constrained('users')->cascadeOnDelete();
            $table->date('tgl_blokir');
            $table->string('alasan')->nullable();
            $table->timestamps();

            $table->unique(['guru_bk_id', 'tgl_blokir']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_blokir');
    }
};
