export type User = {
    id: number;
    name: string;
    username: string;
    avatar?: string;
    role: 'guru_bk' | 'kepala_sekolah' | 'siswa';
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};
