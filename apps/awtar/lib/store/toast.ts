import { create } from "zustand";

type ToastKind = "success" | "error" | "info";

export interface ToastItem {
    id: string;
    kind: ToastKind;
    message: string;
}

interface ToastState {
    toasts: ToastItem[];
    push: (kind: ToastKind, message: string) => void;
    remove: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    push: (kind, message) => {
        const id = crypto.randomUUID();
        set((state) => ({ toasts: [...state.toasts, { id, kind, message }] }));
        if (typeof window !== "undefined") {
            window.setTimeout(() => {
                set((state) => ({
                    toasts: state.toasts.filter((toast) => toast.id !== id),
                }));
            }, 3500);
        }
    },
    remove: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
}));

export const appToast = {
    success(message: string) {
        useToastStore.getState().push("success", message);
    },
    error(message: string) {
        useToastStore.getState().push("error", message);
    },
    info(message: string) {
        useToastStore.getState().push("info", message);
    },
};
