"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { safeNext } from "../../lib/auth/validate";
import { errorsFrom, postJson } from "./api";
import { Field, FormError } from "./Field";

export function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const next = safeNext(params.get("next"));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(60);
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("code") ?? "").replace(/\s/g, "");
    if (!/^\d{6}$/.test(code)) return setErrors({ code: "Enter the 6-digit code from the email." });
    setBusy(true);
    const r = await postJson("/api/auth/verify", { email, code });
    if (r.data.ok) {
      router.replace(next);
      router.refresh();
      return;
    }
    setBusy(false);
    setErrors(errorsFrom(r));
  }

  async function resend() {
    setInfo("");
    const r = await postJson("/api/auth/resend", { email, purpose: "verify" });
    if (r.data.ok) {
      setWait(typeof r.data.cooldown === "number" ? r.data.cooldown : 60);
      setInfo(r.data.cooldown ? "A code was sent recently. Check your inbox and spam folder." : "New code sent.");
      setErrors({});
    } else setErrors(errorsFrom(r));
  }

  if (!email) {
    return <p className="notice">Start by <Link href="/signup">creating an account</Link> or <Link href="/login">logging in</Link>.</p>;
  }
  return (
    <form className="panel" onSubmit={onSubmit} noValidate>
      <p style={{ marginTop: 0 }}>We sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.</p>
      <Field label="Verification code" name="code" className="code-input" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required autoFocus error={errors.code} />
      <FormError message={errors.form} />
      {info && <p className="notice notice--ok" role="status">{info}</p>}
      <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? "Verifying…" : "Verify and continue"}</button>
      <div className="auth-links">
        <button type="button" className="btn" onClick={resend} disabled={wait > 0}>{wait > 0 ? `Resend code in ${wait}s` : "Resend code"}</button>
        <Link href="/signup">Use a different email</Link>
      </div>
    </form>
  );
}
