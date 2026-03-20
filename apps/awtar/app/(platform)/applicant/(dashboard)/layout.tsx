import type { ReactNode } from "react";
import { Header } from "../_components/Header";
import { Sidebar } from "../_components/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-[#F8F9FA] text-gray-900 font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Header />
                {/* Main Content Area */}
                <main className="flex-1 overflow-auto bg-[#F8F9FA]">{children}</main>
            </div>
        </div>
    );
}
