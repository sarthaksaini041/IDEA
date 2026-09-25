"use client";
import { useState, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error?: string; hint?: string };

export function Field({ label, name, error, hint, type = "text", ...rest }: Props) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  const describedBy = [error ? `${name}-err` : "", hint ? `${name}-hint` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <div className={isPw ? "pw-wrap" : undefined}>
        <input id={name} name={name} type={isPw && show ? "text" : type} aria-invalid={!!error} aria-describedby={describedBy} {...rest} />
        {isPw && (
          <button type="button" className="pw-toggle" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {hint && !error && <p className="small muted" id={`${name}-hint`} style={{ margin: "4px 0 0" }}>{hint}</p>}
      {error && <p className="field-error" id={`${name}-err`}>{error}</p>}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  return message ? <p className="notice notice--err" role="alert">{message}</p> : null;
}
