"use client";
import Link from "next/link";
import { useEffect } from "react";

// Route-level error boundary: keeps the header/footer and offers a way forward.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[client-error]", error.digest ?? "", error.message);
  }, [error]);
  return (
    <div className="prose">
      <h1>Something went wrong</h1>
      <p>This page failed to load. It is probably temporary.</p>
      <p className="btn-row">
        <button type="button" className="btn btn--primary" onClick={reset}>Try again</button>
        <Link className="btn" href="/">Back to the finder</Link>
      </p>
      {error.digest && <p className="small muted">Error reference: {error.digest}</p>}
    </div>
  );
}
