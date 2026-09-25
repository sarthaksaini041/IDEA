"use client";
import { useState } from "react";

/** Plain share links (no third-party scripts or trackers) plus copy-to-clipboard. */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links: [string, string][] = [
    ["Reddit", `https://www.reddit.com/submit?url=${u}&title=${t}`],
    ["X", `https://twitter.com/intent/tweet?url=${u}&text=${t}`],
    ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${u}`],
  ];
  return (
    <div className="btn-row share" aria-label="Share this comparison">
      <button type="button" className="btn" onClick={async () => {
        try {
          if (navigator.share) await navigator.share({ url, title });
          else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
        } catch { /* user cancelled */ }
      }}>{copied ? "Link copied" : "Share / copy link"}</button>
      {links.map(([n, href]) => <a key={n} className="btn" href={href} target="_blank" rel="noopener nofollow">{n}</a>)}
    </div>
  );
}
