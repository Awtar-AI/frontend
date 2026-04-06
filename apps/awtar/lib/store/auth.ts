import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AppUser } from "@/applicant/user-me/models/app-user";
import { isAccessTokenExpired } from "../auth/jwt";
import { setAuthToken } from "../http";

export type { AppUser, CandidateProfile } from "@/applicant/user-me/models/app-user";

interface AuthState {
    user: AppUser | null;
    token: string | null;
    refreshToken: string | null;
    setAuth: (user: AppUser, token: string, refreshToken?: string | null) => void;
    setUser: (user: AppUser | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            refreshToken: null,
            setAuth: (user, token, refreshToken = null) => {
                setAuthToken(token);
                set({ user, token, refreshToken });
            },
            setUser: (user) => set({ user }),
            clearAuth: () => {
                setAuthToken(null);
                set({ user: null, token: null, refreshToken: null });
            },
        }),
        {
            name: "awtar-auth",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                refreshToken: state.refreshToken,
            }),
            onRehydrateStorage: () => (state) => {
                if (!state) return;
                if (state.token && !isAccessTokenExpired(state.token)) {
                    setAuthToken(state.token);
                } else {
                    state.clearAuth();
                }
            },
        },
    ),
);
