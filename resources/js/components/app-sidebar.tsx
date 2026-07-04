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
import type { NavItem } from '@/types';

interface AuthUser {
    id: number;
    name: string;
    username: string;
    role: string;
}

const guruBkNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Kelas',
        href: '/guru-bk/kelas',
        icon: GraduationCap,
    },
    {
        title: 'Siswa',
        href: '/guru-bk/siswa',
        icon: Users,
    },
    {
        title: 'Kategori',
        href: '/guru-bk/kategori',
        icon: Tags,
    },
    {
        title: 'Jadwal',
        href: '/guru-bk/jadwal',
        icon: Calendar,
    },
    {
        title: 'Pengajuan',
        href: '/guru-bk/pengajuan',
        icon: ScrollText,
    },
    {
        title: 'Konseling',
        href: '/guru-bk/konseling',
        icon: MessageSquare,
    },
    {
        title: 'Artikel',
        href: '/guru-bk/artikel',
        icon: BookOpen,
    },
    {
        title: 'Pengumuman',
        href: '/guru-bk/pengumuman',
        icon: Newspaper,
    },
];

const kepsekNavItems: NavItem[] = [
    {
        title: 'Laporan',
        href: '/kepsek/laporan',
        icon: ScrollText,
    },
];

const siswaNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Pengajuan',
        href: '/siswa/pengajuan',
        icon: ScrollText,
    },
    {
        title: 'Hasil',
        href: '/siswa/hasil',
        icon: MessageSquare,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as { auth: { user: AuthUser | null } };
    const user = auth.user;

    let mainNavItems: NavItem[] = [];

    if (user?.role === 'guru_bk') {
        mainNavItems = guruBkNavItems;
    } else if (user?.role === 'kepala_sekolah') {
        mainNavItems = kepsekNavItems;
    } else if (user?.role === 'siswa') {
        mainNavItems = siswaNavItems;
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
