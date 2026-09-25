import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyForm } from "../../components/auth/VerifyForm";

export const metadata: Metadata = { title: "Verify your email", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <div className="auth">
      <h1>Check your email</h1>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}
