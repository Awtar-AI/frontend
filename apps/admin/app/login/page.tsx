"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const LoginContent = dynamic(
  () => import("./_components/login-content").then((mod) => mod.LoginContent),
  { ssr: false },
);

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginContent />
    </Suspense>
  );
}
