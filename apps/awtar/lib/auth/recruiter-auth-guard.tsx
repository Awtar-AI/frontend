"use client";

import { isRecruiterPublicRoute } from "./recruiter-public-routes";
import { AuthGuard } from "./auth-guard";

const RECRUITER_LOGIN_PATH = "/recruiter/login";

/** Wraps all `app/(platform)/recruiter/**` UI. Public: login + register only. */
export function RecruiterAuthGuard({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard
            loginPath={RECRUITER_LOGIN_PATH}
            isPublicPath={isRecruiterPublicRoute}
            allowedRoles={["hr", "admin"]}
            expectedAreaLabel="recruiters"
        >
            {children}
        </AuthGuard>
    );
}
