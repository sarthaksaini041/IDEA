"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { safeNext } from "../../lib/auth/validate";
import { errorsFrom, postJson } from "./api";
import { Field, FormError } from "./Field";

export function SignupForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = { name: String(f.get("name") ?? ""), email: String(f.get("email") ?? ""), password: String(f.get("password") ?? "") };
    const local: Record<string, string> = {};
    if (!body.name.trim()) local.name = "Enter your name.";
    if (!body.email.includes("@")) local.email = "Enter a valid email address.";
    if (body.password.length < 8) local.password = "Use at least 8 characters.";
    setErrors(local);
    if (Object.keys(local).length) return;

    setBusy(true);
    const r = await postJson("/api/auth/signup", body);
    setBusy(false);
    if (r.data.ok) {
      router.push(`/verify?email=${encodeURIComponent(String(r.data.email ?? body.email))}&next=${encodeURIComponent(next)}`);
      return;
    }
    setErrors(errorsFrom(r));
  }

  return (
    <form className="panel" onSubmit={onSubmit} noValidate>
      <Field label="Name" name="name" autoComplete="name" maxLength={80} required error={errors.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" required error={errors.email} />
      <Field label="Password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required error={errors.password} hint="At least 8 characters." />
      <FormError message={errors.form} />
      <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
      <p className="small muted" style={{ marginBottom: 0 }}>We&apos;ll email you a 6-digit code to confirm it&apos;s you.</p>
      <div className="auth-links"><span>Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`}>Log in</Link></span></div>
    </form>
  );
}
