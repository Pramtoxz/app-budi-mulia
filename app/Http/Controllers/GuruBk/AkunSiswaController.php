<?php

namespace App\Http\Controllers\GuruBk;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AkunSiswaController extends Controller
{
    public function store(Request $request, Siswa $siswa): RedirectResponse
    {
        if ($siswa->user_id) {
            return redirect()->back()
                ->with('error', 'Siswa ini sudah memiliki akun.');
        }

        $request->merge(['username' => Str::lower((string) $request->input('username'))]);

        $validated = $request->validate([
            'username' => ['required', 'string', 'max:255', 'alpha_dash', Rule::unique('users', 'username')],
            'password' => ['required', 'string', 'min:6'],
        ]);

        DB::transaction(function () use ($siswa, $validated) {
            $user = User::create([
                'name' => $siswa->nama,
                'username' => $validated['username'],
                'password' => $validated['password'],
                'role' => 'siswa',
            ]);

            $siswa->update(['user_id' => $user->id]);
        });

        return redirect()->back()
            ->with('success', "Akun siswa berhasil dibuat. Username: {$validated['username']}");
    }

    public function resetPassword(Request $request, Siswa $siswa): RedirectResponse
    {
        $user = $siswa->user;

        if (! $user) {
            return redirect()->back()
                ->with('error', 'Siswa ini belum memiliki akun.');
        }

        $validated = $request->validate([
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user->update(['password' => $validated['password']]);

        return redirect()->back()
            ->with('success', 'Password akun siswa berhasil direset.');
    }

    public function destroy(Siswa $siswa): RedirectResponse
    {
        $user = $siswa->user;

        if (! $user) {
            return redirect()->back()
                ->with('error', 'Siswa ini belum memiliki akun.');
        }

        DB::transaction(function () use ($siswa, $user) {
            $siswa->update(['user_id' => null]);
            $user->delete();
        });

        return redirect()->back()
            ->with('success', 'Akun siswa berhasil dihapus. Data siswa tetap tersimpan.');
    }
}
