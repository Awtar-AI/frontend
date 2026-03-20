import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    // Simple pass-through layout that guarantees a clean slate (no sidebar).
    return <div className="min-h-screen bg-white text-gray-900 font-sans">{children}</div>;
}
