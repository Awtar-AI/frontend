"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const ResetPasswordContent = dynamic(
  () =>
    import("./_components/reset-password-content").then(
      (mod) => mod.ResetPasswordContent,
    ),
  { ssr: false },
);

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
