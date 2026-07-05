import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    GraduationCap,
    LayoutGrid,
    MessageSquare,
    Newspaper,
    ScrollText,
    Tags,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavGroup, NavItem } from '@/types';

interface AuthUser {
    id: number;
    name: string;
    username: string;
    role: string;
}

const guruBkGroups: NavGroup[] = [
    {
        label: 'Umum',
        items: [
            { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        ],
    },
    {
        label: 'Master',
        items: [
            { title: 'Kelas', href: '/guru-bk/kelas', icon: GraduationCap },
            { title: 'Siswa', href: '/guru-bk/siswa', icon: Users },
            { title: 'Siswa-Kelas', href: '/guru-bk/siswa-kelas', icon: Users },
            { title: 'Kategori', href: '/guru-bk/kategori', icon: Tags },
            { title: 'Ketersediaan', href: '/guru-bk/ketersediaan', icon: Calendar },
        ],
    },
    {
        label: 'Bimbingan Konseling',
        items: [
            { title: 'Pengajuan', href: '/guru-bk/pengajuan', icon: ScrollText },
            { title: 'Konseling', href: '/guru-bk/konseling', icon: MessageSquare },
        ],
    },
    {
        label: 'Konten',
        items: [
            { title: 'Artikel', href: '/guru-bk/artikel', icon: BookOpen },
            { title: 'Pengumuman', href: '/guru-bk/pengumuman', icon: Newspaper },
        ],
    },
];

const kepsekNavItems: NavItem[] = [
    {
        title: 'Laporan',
        href: '/kepsek/laporan',
        icon: ScrollText,
    },
];

const siswaGroups: NavGroup[] = [
    {
        label: 'Umum',
        items: [
            { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        ],
    },
    {
        label: 'Bimbingan Konseling',
        items: [
            { title: 'Pengajuan', href: '/siswa/pengajuan', icon: ScrollText },
            { title: 'Hasil', href: '/siswa/hasil', icon: MessageSquare },
        ],
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as { auth: { user: AuthUser | null } };
    const user = auth.user;

    let groups: NavGroup[] = [];
    let flatItems: NavItem[] = [];

    if (user?.role === 'guru_bk') {
        groups = guruBkGroups;
    } else if (user?.role === 'kepala_sekolah') {
        flatItems = kepsekNavItems;
    } else if (user?.role === 'siswa') {
        groups = siswaGroups;
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={groups} items={flatItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
