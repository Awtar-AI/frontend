"use client";

import { isApplicantPublicRoute } from "./applicant-public-routes";
import { AuthGuard } from "./auth-guard";

const APPLICANT_LOGIN_PATH = "/applicant/login";

/** Wraps all `app/(platform)/applicant/**` UI. Public: login + register only. */
export function ApplicantAuthGuard({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard
            loginPath={APPLICANT_LOGIN_PATH}
            isPublicPath={isApplicantPublicRoute}
            allowedRoles={["candidate"]}
            expectedAreaLabel="applicants"
        >
            {children}
        </AuthGuard>
    );
}
