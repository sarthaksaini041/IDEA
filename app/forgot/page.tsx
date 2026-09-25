import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ForgotForm } from "../../components/auth/ForgotForm";
import { getSessionUser } from "../../lib/auth/session";
import { safeNext } from "../../lib/auth/validate";

export const metadata: Metadata = { title: "Reset your password", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function Page({ searchParams }: Props) {
  if (await getSessionUser()) redirect(safeNext((await searchParams).next));
  return (
    <div className="auth">
      <h1>Reset your password</h1>
      <p className="lede">We'll email you a code.</p>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <ForgotForm />
      </Suspense>
    </div>
  );
}
