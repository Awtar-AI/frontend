"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const ForgotPasswordContent = dynamic(
  () =>
    import("./_components/forgot-password-content").then(
      (mod) => mod.ForgotPasswordContent,
    ),
  { ssr: false },
);

export default function AdminForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
