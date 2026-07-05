import AppLogoIcon from '@/assets/images/logo-sekolah.jpg';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md  text-sidebar-primary-foreground">
                <img
                    src={AppLogoIcon}
                    alt="Logo Sekolah"
                    className="h-9 w-9 rounded-md object-cover"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    SMP IT Budi Mulia
                </span>
                <span className="truncate text-xs text-muted-background">
                  Sistem  Bimbingan Konseling
                </span>
            </div>
        </>
    );
}
