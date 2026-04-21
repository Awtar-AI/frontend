import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{value}</p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <Icon className="h-6 w-6" />
                </div>
            </div>
            
            {trend && (
                <div className="mt-4 flex items-center gap-2">
                    <span
                        className={`inline-flex items-center text-sm font-bold ${
                            trend.isPositive ? "text-emerald-600" : "text-red-600"
                        }`}
                    >
                        {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                    </span>
                    <span className="text-sm font-medium text-gray-500">vs last month</span>
                </div>
            )}
        </div>
    );
}
