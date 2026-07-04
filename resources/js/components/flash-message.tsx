import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function FlashMessage() {
    const { flash } = usePage().props as unknown as Record<string, unknown> & {
        flash?: { success?: string; error?: string };
    };
    const prevFlash = useRef<{ success?: string; error?: string }>({});

    useEffect(() => {
        if (!flash) return;
        if (flash.success && flash.success !== prevFlash.current.success) {
            toast.success(flash.success);
        }
        if (flash.error && flash.error !== prevFlash.current.error) {
            toast.error(flash.error);
        }
        prevFlash.current = flash;
    }, [flash]);

    return null;
}
