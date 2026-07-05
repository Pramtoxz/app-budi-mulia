export const guruBkRoutes = {
    kelas: {
        index: '/guru-bk/kelas',
        store: '/guru-bk/kelas',
        update: (id: number) => `/guru-bk/kelas/${id}`,
        destroy: (id: number) => `/guru-bk/kelas/${id}`,
    },
    siswa: {
        index: '/guru-bk/siswa',
        store: '/guru-bk/siswa',
        create: '/guru-bk/siswa/create',
        show: (id: number) => `/guru-bk/siswa/${id}`,
        update: (id: number) => `/guru-bk/siswa/${id}`,
        destroy: (id: number) => `/guru-bk/siswa/${id}`,
    },
    siswaKelas: {
        index: '/guru-bk/siswa-kelas',
        store: '/guru-bk/siswa-kelas',
        update: (id: number) => `/guru-bk/siswa-kelas/${id}`,
        destroy: (id: number) => `/guru-bk/siswa-kelas/${id}`,
        assign: '/guru-bk/siswa-kelas/assign',
        naikKelas: '/guru-bk/siswa-kelas/naik-kelas',
    },
    kategori: {
        index: '/guru-bk/kategori',
        store: '/guru-bk/kategori',
        update: (id: number) => `/guru-bk/kategori/${id}`,
        destroy: (id: number) => `/guru-bk/kategori/${id}`,
    },
    jadwal: {
        index: '/guru-bk/jadwal',
        store: '/guru-bk/jadwal',
        update: (id: number) => `/guru-bk/jadwal/${id}`,
        destroy: (id: number) => `/guru-bk/jadwal/${id}`,
    },
};
