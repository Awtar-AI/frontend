import axios from "axios";
import { isAccessTokenExpired } from "./auth/jwt";
import { isTerminalRefreshError, refreshAuthSessionSingleFlight } from "./auth/refresh-session";
import { normalizeError } from "./errors";
import { useAuthStore } from "./store/auth";

const http = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_URL ||
        (process.env.NODE_ENV === "development" ? "http://localhost:5432" : ""),
});

http.interceptors.request.use(async (config) => {
    const requestUrl = String(config.url ?? "");
    const isRefreshRequest = requestUrl.includes("/api/v1/auth/refresh");
    let { accessToken, refreshToken } = useAuthStore.getState();

    if (!isRefreshRequest && accessToken && isAccessTokenExpired(accessToken) && refreshToken) {
        try {
            await refreshAuthSessionSingleFlight();
            accessToken = useAuthStore.getState().accessToken;
            refreshToken = useAuthStore.getState().refreshToken;
        } catch {
            // Let downstream 401 handling decide whether to sign out.
        }
    }

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

http.interceptors.response.use(
    (res) => res,
    async (error) => {
        const status = error?.response?.status;
        const originalRequest = error?.config as
            | (typeof error.config & { _authRetryAttempted?: boolean })
            | undefined;
        const requestUrl = String(originalRequest?.url ?? "");
        const shouldSkipRetry =
            requestUrl.includes("/api/v1/auth/login") ||
            requestUrl.includes("/api/v1/auth/refresh");

        if (
            status === 401 &&
            originalRequest &&
            !originalRequest._authRetryAttempted &&
            !shouldSkipRetry
        ) {
            originalRequest._authRetryAttempted = true;
            try {
                await refreshAuthSessionSingleFlight();
                const { accessToken } = useAuthStore.getState();
                if (accessToken) {
                    originalRequest.headers = originalRequest.headers ?? {};
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }
                return http(originalRequest);
            } catch (refreshError) {
                if (isTerminalRefreshError(refreshError)) {
                    useAuthStore.getState().clearAuth();
                }
                return Promise.reject(normalizeError(refreshError));
            }
        }

        const appError = normalizeError(error);
        if (appError.status === 401) {
            useAuthStore.getState().clearAuth();
        }
        return Promise.reject(appError);
    },
);

export default http;
