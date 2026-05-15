import type { LucideIcon } from "lucide-react";
import Image from "next/image";

type RecruiterPageBannerProps = {
    title: string;
    description: string;
    metricLabel?: string;
    metricValue?: string;
    Icon?: LucideIcon;
};

export function RecruiterPageBanner({
    title,
    description,
    metricLabel,
    metricValue,
    Icon,
}: RecruiterPageBannerProps) {
    return (
        <section
            className="relative min-h-[200px] overflow-hidden rounded-3xl bg-[#475ca3] p-8 lg:p-10 text-white shadow-sm z-0"
            style={{ backgroundColor: "#8fa3c4" }}
        >
            <div className="absolute inset-0 z-[-1] mix-blend-overlay">
                <Image
                    src="/images/slide-interview.jpg"
                    alt={`${title} banner`}
                    fill
                    priority
                    className="object-cover opacity-30"
                />
            </div>
            <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-blue-900/90 to-blue-800/40" />

            <div className="max-w-3xl">
                <h1 className="text-3xl lg:text-[40px] font-black mb-3 tracking-tight text-white drop-shadow-md">
                    {title}
                </h1>
                <p className="text-blue-50 font-bold text-sm lg:text-base drop-shadow max-w-2xl">
                    {description}
                </p>

                {metricLabel && metricValue && (
                    <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold">
                        {Icon ? <Icon className="h-4 w-4" /> : null}
                        <span className="text-white/90">{metricLabel}:</span>
                        <span className="text-white">{metricValue}</span>
                    </div>
                )}
            </div>
        </section>
    );
}
