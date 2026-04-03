import { create } from "zustand";
import type { AppUser } from "@/applicant/user-me/models/app-user";
import { setAuthToken } from "../http";

export type { AppUser, CandidateProfile } from "@/applicant/user-me/models/app-user";

interface AuthState {
    user: AppUser | null;
    token: string | null;
    setAuth: (user: AppUser, token: string) => void;
    setUser: (user: AppUser | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    setAuth: (user, token) => {
        setAuthToken(token);
        set({ user, token });
    },
    setUser: (user) => set({ user }),
    clearAuth: () => {
        setAuthToken(null);
        set({ user: null, token: null });
    },
}));
