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

function serializeRequestBody(body: RequestConfig["body"]): BodyInit | undefined {
    if (body === undefined || body === null) return undefined;
    if (typeof body === "string") return body;
    if (
        body instanceof FormData ||
        body instanceof Blob ||
        body instanceof ArrayBuffer ||
        body instanceof URLSearchParams
    ) {
        return body;
    }
    return JSON.stringify(body);
}

function shouldUseJsonContentType(body: RequestConfig["body"]): boolean {
    if (body === undefined || body === null) return false;
    if (typeof body === "string") return true;
    if (
        body instanceof FormData ||
        body instanceof Blob ||
        body instanceof ArrayBuffer ||
        body instanceof URLSearchParams
    ) {
        return false;
    }
    return typeof body === "object";
}

export async function request<T>(
    path: string,
    { method = "GET", params, headers = {}, body, ...rest }: RequestConfig,
) {
    const url = buildUrl(path, params);
    const serializedBody = serializeRequestBody(body);

    const res = await fetch(url, {
        method,
        ...rest,
        headers: {
            ...(shouldUseJsonContentType(body) ? { "Content-Type": "application/json" } : {}),
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            ...headers,
        },
        ...(serializedBody !== undefined ? { body: serializedBody } : {}),
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
        return (await res.json()) as T;
    }

    return (await res.text()) as T;
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
