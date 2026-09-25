"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { errorsFrom, postJson } from "./api";
import { Field, FormError } from "./Field";

export function ForgotForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function sendCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("email") ?? "").trim().toLowerCase();
    if (!value.includes("@")) return setErrors({ email: "Enter a valid email address." });
    setBusy(true);
    const r = await postJson("/api/auth/forgot", { email: value });
    setBusy(false);
    if (r.data.ok) {
      setEmail(value);
      setErrors({});
      setStep("reset");
    } else setErrors(errorsFrom(r));
  }

  async function reset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = { email, code: String(f.get("code") ?? ""), password: String(f.get("password") ?? "") };
    if (body.password.length < 8) return setErrors({ password: "Use at least 8 characters." });
    setBusy(true);
    const r = await postJson("/api/auth/reset", body);
    if (r.data.ok) {
      router.replace("/account");
      router.refresh();
      return;
    }
    setBusy(false);
    setErrors(errorsFrom(r));
  }

  if (step === "email") {
    return (
      <form className="panel" onSubmit={sendCode} noValidate>
        <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" required error={errors.email} />
        <FormError message={errors.form} />
        <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Send reset code"}</button>
        <div className="auth-links"><Link href="/login">Back to log in</Link></div>
      </form>
    );
  }
  return (
    <form className="panel" onSubmit={reset} noValidate>
      <p style={{ marginTop: 0 }}>If <strong>{email}</strong> has an account, a 6-digit code is on its way.</p>
      <Field label="Code" name="code" className="code-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required error={errors.code} />
      <Field label="New password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required error={errors.password} hint="At least 8 characters. You'll be signed out on other devices." />
      <FormError message={errors.form} />
      <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? "Saving…" : "Set new password"}</button>
      <div className="auth-links"><button type="button" className="btn" onClick={() => setStep("email")}>Use a different email</button></div>
    </form>
  );
}
