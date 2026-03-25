import { API_URL } from "./env";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig extends Omit<RequestInit, "method" | "body"> {
    method?: HttpMethod;
    params?: Record<string, string>;
    body?: BodyInit | Record<string, unknown> | null;
}

function buildUrl(path: string, params?: Record<string, string>): string {
    const base = path.startsWith("http")
        ? path
        : `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

    if (!params || Object.keys(params).length === 0) {
        return base;
    }

    const search = new URLSearchParams(params).toString();

    return `${base}?${search}`;
}

let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
    authToken = token;
}

export async function request<T>(
    path: string,
    { method = "GET", params, headers = {}, body, ...rest }: RequestConfig,
) {
    const url = buildUrl(path, params);

    const res = await fetch(url, {
        method,
        ...rest,
        headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            ...headers,
        },
        ...(body !== undefined
            ? { body: typeof body === "string" ? body : JSON.stringify(body) }
            : {}),
    });

    if (!res.ok) {
        const text = await res.text();

        let payload: unknown = text;
        try {
            payload = JSON.parse(text);
        } catch {}

        throw new ApiError(res.status, payload, text);
    }

    const contentType = res.headers.get("content-type");

    if (contentType?.includes("application/json")) {
        return res.text() as Promise<T>;
    }
}

export class ApiError extends Error {
    constructor(
        public status: number,
        public payload: unknown,
        public raw: string,
    ) {
        super(
            typeof payload === "object" && payload !== null && "message" in payload
                ? String((payload as { message: unknown }).message)
                : raw || `Request failed with status ${status}`,
        );
        this.name = "ApiError";
    }
}
