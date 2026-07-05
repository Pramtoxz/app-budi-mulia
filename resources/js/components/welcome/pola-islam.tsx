import { cn } from '@/lib/utils';

interface PolaIslamProps {
    className?: string;
    color?: string;
    opacity?: number;
}

export default function PolaIslam({ className, color = '#F9C301', opacity = 0.08 }: PolaIslamProps) {
    return (
        <svg
            className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity }}
        >
            <defs>
                <pattern id="polaIslam" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path
                        d="M30 0 L60 30 L30 60 L0 30 Z"
                        fill="none"
                        stroke={color}
                        strokeWidth="0.5"
                    />
                    <circle cx="30" cy="30" r="8" fill="none" stroke={color} strokeWidth="0.5" />
                    <circle cx="30" cy="30" r="3" fill="none" stroke={color} strokeWidth="0.5" />
                    <circle cx="0" cy="0" r="3" fill="none" stroke={color} strokeWidth="0.5" />
                    <circle cx="60" cy="0" r="3" fill="none" stroke={color} strokeWidth="0.5" />
                    <circle cx="0" cy="60" r="3" fill="none" stroke={color} strokeWidth="0.5" />
                    <circle cx="60" cy="60" r="3" fill="none" stroke={color} strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#polaIslam)" />
        </svg>
    );
}
