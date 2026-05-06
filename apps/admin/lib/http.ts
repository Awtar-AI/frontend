import axios from "axios";
import { normalizeError } from "./errors";
import { useAuthStore } from "./store/auth";

const http = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_URL ||
        (process.env.NODE_ENV === "development" ? "http://localhost:5432" : ""),
});

http.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        const appError = normalizeError(error);
        if (appError.status === 401) {
            useAuthStore.getState().clearAuth();
        }
        return Promise.reject(appError);
    },
);

export default http;
