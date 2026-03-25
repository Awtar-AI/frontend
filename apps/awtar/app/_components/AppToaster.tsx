"use client";

import { Check, X, XIcon } from "lucide-react";
import { useToastStore } from "@/lib/store/toast";

export function AppToaster() {
    const toasts = useToastStore((state) => state.toasts);
    const remove = useToastStore((state) => state.remove);

    return (
        <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto rounded-lg border-l-[6px] border px-4 py-3 text-sm shadow-lg ${
                        toast.kind === "success"
                            ? "border-l-emerald-500 border-emerald-300 bg-white text-emerald-900"
                            : toast.kind === "error"
                              ? "border-l-rose-600 border-rose-300 bg-white text-rose-900"
                              : "border-l-slate-500 border-slate-300 bg-white text-slate-900"
                    }`}
                >
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                            <div
                                className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md ${
                                    toast.kind === "success"
                                        ? "bg-emerald-500 text-white"
                                        : toast.kind === "error"
                                          ? "bg-rose-600 text-white"
                                          : "bg-slate-500 text-white"
                                }`}
                            >
                                {toast.kind === "success" ? (
                                    <Check className="h-4 w-4" />
                                ) : toast.kind === "error" ? (
                                    <XIcon className="h-4 w-4" />
                                ) : (
                                    "i"
                                )}
                            </div>
                            <p className="font-semibold">{toast.message}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => remove(toast.id)}
                            className="text-current/70 hover:text-current"
                            aria-label="Dismiss notification"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
