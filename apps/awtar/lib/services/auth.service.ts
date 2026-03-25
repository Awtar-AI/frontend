import { useAuthStore, type AppUser } from "../store/auth";

export const authService = {
    setUser(user: AppUser) {
        useAuthStore.getState().setUser(user);
    },
    setAuth(user: AppUser, token: string) {
        useAuthStore.getState().setAuth(user, token);
    },
    logout() {
        useAuthStore.getState().clearAuth();
    },
};
