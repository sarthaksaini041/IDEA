import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignupForm } from "../../components/auth/SignupForm";
import { getSessionUser } from "../../lib/auth/session";
import { safeNext } from "../../lib/auth/validate";

export const metadata: Metadata = { title: "Create your account", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function Page({ searchParams }: Props) {
  if (await getSessionUser()) redirect(safeNext((await searchParams).next));
  return (
    <div className="auth">
      <h1>Create your account</h1>
      <p className="lede">Free. Only needed for price alerts; everything else works without an account.</p>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
