import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isAccessTokenExpired } from "../auth/jwt";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    userId: string | null;
    role: "candidate" | "hr" | "admin" | null;

    setSession: (data: {
        accessToken: string;
        refreshToken: string;
        userId: string;
        role: string;
    }) => void;
    clearAuth: () => void;
}

const EMPTY: Pick<AuthState, "accessToken" | "refreshToken" | "userId" | "role"> = {
    accessToken: null,
    refreshToken: null,
    userId: null,
    role: null,
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            ...EMPTY,
            setSession: ({ accessToken, refreshToken, userId, role }) =>
                set({
                    accessToken,
                    refreshToken,
                    userId,
                    role: role as AuthState["role"],
                }),
            clearAuth: () => set(EMPTY),
        }),
        {
            name: "awtar-auth",
            storage: createJSONStorage(() => localStorage),
            partialize: ({ accessToken, refreshToken, userId, role }) => ({
                accessToken,
                refreshToken,
                userId,
                role,
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
