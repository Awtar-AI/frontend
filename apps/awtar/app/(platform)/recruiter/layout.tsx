import type { ReactNode } from "react";
import { RecruiterAuthGuard } from "@/lib/auth/recruiter-auth-guard";

export default function RecruiterLayout({ children }: { children: ReactNode }) {
    return <RecruiterAuthGuard>{children}</RecruiterAuthGuard>;
}
