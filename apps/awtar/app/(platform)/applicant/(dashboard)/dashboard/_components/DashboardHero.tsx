import { Briefcase, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { mockUser } from "../../../lib/mockData";

export function DashboardHero() {
    return (
        <div
            className="relative overflow-hidden bg-[#475ca3] rounded-3xl p-8 lg:p-10 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 z-0"
            style={{ backgroundColor: "#8fa3c4" }}
        >
            <div className="absolute inset-0 z-[-1] mix-blend-overlay">
                <Image
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                    alt="Office Background"
                    fill
                    className="object-cover opacity-30"
                />
            </div>
            <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-blue-900/90 to-blue-800/40"></div>

            <div className="z-10 w-full md:w-auto">
                <h1 className="text-3xl lg:text-[40px] font-black mb-3 tracking-tight text-white drop-shadow-md">
                    Good afternoon, {mockUser.name.split(" ")[0]}!
                </h1>
                <p className="text-blue-50 font-bold mb-8 text-sm lg:text-base drop-shadow">
                    Ready to take the next step in your career? Here's what's happening today.
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-white font-bold drop-shadow">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Monday, October 6, 2025
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        San Francisco, CA
                    </div>
                    <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Software Engineer
                    </div>
                </div>
            </div>

            <div className="relative w-32 h-32 rounded-full border-[6px] border-white/30 shadow-2xl shrink-0 overflow-hidden z-10 hidden md:block">
                <Image src={mockUser.avatarUrl || ""} alt="Avatar" fill className="object-cover" />
            </div>
        </div>
    );
}
