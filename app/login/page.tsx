import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "../../components/auth/LoginForm";
import { getSessionUser } from "../../lib/auth/session";
import { safeNext } from "../../lib/auth/validate";

export const metadata: Metadata = { title: "Log in", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function Page({ searchParams }: Props) {
  if (await getSessionUser()) redirect(safeNext((await searchParams).next));
  return (
    <div className="auth">
      <h1>Log in</h1>
      
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
