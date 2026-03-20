import { Bookmark, Calendar, Eye, FileText } from "lucide-react";

export function StatCards() {
    const stats = [
        {
            label: "Applications Sent",
            value: "24",
            sub: "+3 this week",
            icon: FileText,
            color: "text-blue-500",
            bg: "bg-blue-50 border-blue-100",
        },
        {
            label: "Interviews",
            value: "24",
            sub: "+3 this week",
            icon: Calendar,
            color: "text-green-500",
            bg: "bg-green-50 border-green-100",
        },
        {
            label: "Profile Views",
            value: "24",
            sub: "+3 this week",
            icon: Eye,
            color: "text-pink-500",
            bg: "bg-pink-50 border-pink-100",
        },
        {
            label: "Saved Jobs",
            value: "24",
            sub: "+3 this week",
            icon: Bookmark,
            color: "text-orange-500",
            bg: "bg-orange-50 border-orange-100",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between transition-transform hover:-translate-y-1"
                    >
                        <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${stat.bg} ${stat.color}`}
                        >
                            <button type="button">
                                <Icon className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-gray-500 font-bold text-sm mb-2">{stat.label}</p>
                        <h3 className="text-3xl font-black text-gray-900 mb-2">{stat.value}</h3>
                        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                            {stat.sub}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
