import type { ReactNode } from "react";
import { ApplicantAuthGuard } from "@/lib/auth/applicant-auth-guard";

export default function ApplicantLayout({ children }: { children: ReactNode }) {
    return <ApplicantAuthGuard>{children}</ApplicantAuthGuard>;
}
