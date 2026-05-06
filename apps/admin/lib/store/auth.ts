import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isAccessTokenExpired } from "../auth/jwt";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    userId: string | null;
    role: "candidate" | "hr" | "admin" | null;
    organizationId: string | null;
    setSession: (data: {
        accessToken: string;
        refreshToken: string;
        userId: string;
        role: AuthState["role"];
        organizationId?: string | null;
    }) => void;
    clearAuth: () => void;
}

const EMPTY: Pick<
    AuthState,
    "accessToken" | "refreshToken" | "userId" | "role" | "organizationId"
> = {
    accessToken: null,
    refreshToken: null,
    userId: null,
    role: null,
    organizationId: null,
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            ...EMPTY,
            setSession: ({ accessToken, refreshToken, userId, role, organizationId = null }) =>
                set({
                    accessToken,
                    refreshToken,
                    userId,
                    role,
                    organizationId,
                }),
            clearAuth: () => set(EMPTY),
        }),
        {
            name: "awtar-admin-auth",
            storage: createJSONStorage(() => localStorage),
            partialize: ({ accessToken, refreshToken, userId, role, organizationId }) => ({
                accessToken,
                refreshToken,
                userId,
                role,
                organizationId,
            }),
            onRehydrateStorage: () => (state) => {
                if (!state) return;
                if (!state.accessToken || isAccessTokenExpired(state.accessToken)) {
                    state.clearAuth();
                }
            },
        },
    ),
);
