import type { ReactNode } from "react";
import { Header } from "../_components/Header";
import { Sidebar } from "../_components/Sidebar";

export default function ApplicantJobsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />
            <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
