import type { ReactNode } from "react";
import { RecruiterSidebarNav } from "./_components/RecruiterSidebarNav";
import { RecruiterTopHeader } from "./_components/RecruiterTopHeader";

export default function RecruiterMainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <RecruiterTopHeader />

            <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 shrink-0 overflow-y-auto">
                    <div className="p-4">
                        <RecruiterSidebarNav />
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
                    <div className="max-w-6xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
