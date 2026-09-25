"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { safeNext } from "../../lib/auth/validate";
import { errorsFrom, postJson } from "./api";
import { Field, FormError } from "./Field";

export function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = { email: String(f.get("email") ?? ""), password: String(f.get("password") ?? "") };
    if (!body.email || !body.password) return setErrors({ form: "Enter your email and password." });
    setBusy(true);
    const r = await postJson("/api/auth/login", body);
    if (r.data.ok) {
      router.replace(next);
      router.refresh();
      return;
    }
    setBusy(false);
    if (r.data.needsVerification) {
      router.push(`/verify?email=${encodeURIComponent(body.email.trim().toLowerCase())}&next=${encodeURIComponent(next)}`);
      return;
    }
    setErrors(errorsFrom(r));
  }

  return (
    <form className="panel" onSubmit={onSubmit} noValidate>
      <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" required />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required />
      <FormError message={errors.form} />
      <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
      <div className="auth-links">
        <Link href="/forgot">Forgot password?</Link>
        <span>New here? <Link href={`/signup?next=${encodeURIComponent(next)}`}>Create an account</Link></span>
      </div>
    </form>
  );
}
