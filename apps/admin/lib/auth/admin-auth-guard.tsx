"use client";

import { isAdminPublicRoute } from "./admin-public-routes";
import { AuthGuard } from "./auth-guard";

const ADMIN_LOGIN_PATH = "/login";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard loginPath={ADMIN_LOGIN_PATH} isPublicPath={isAdminPublicRoute}>
            {children}
        </AuthGuard>
    );
}
