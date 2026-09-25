import { SITE, absoluteUrl } from "./site";

// Table-based, inline-styled HTML so it renders in Gmail, Outlook and Apple Mail.
// Every dynamic value goes through esc().
export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const INK = "#1c1e21";
const MUTED = "#5f6368";
const ACCENT = "#c2410c";

export function layout(opts: { preheader: string; body: string; footer?: string }): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(SITE.name)}</title></head>
<body style="margin:0;padding:0;background:#f5f3ee;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ee;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e3e0d8;border-radius:10px;">
<tr><td style="padding:20px 28px;border-bottom:1px solid #eeebe4;font:700 17px/1.2 Arial,Helvetica,sans-serif;color:${INK};">
<a href="${absoluteUrl("/")}" style="color:${INK};text-decoration:none;"><span style="display:inline-block;width:12px;height:12px;background:${ACCENT};border-radius:3px;margin-right:8px;vertical-align:-1px;"></span>${esc(SITE.name)}</a>
</td></tr>
<tr><td style="padding:28px;font:15px/1.6 Arial,Helvetica,sans-serif;color:${INK};">${opts.body}</td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;"><tr><td style="padding:16px 28px;font:12px/1.5 Arial,Helvetica,sans-serif;color:${MUTED};text-align:center;">
${opts.footer ?? ""}${opts.footer ? "<br>" : ""}${esc(SITE.name)} · <a href="${absoluteUrl("/privacy")}" style="color:${MUTED};">Privacy</a>
</td></tr></table>
</td></tr></table></body></html>`;
}

export function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr><td style="background:${ACCENT};border-radius:8px;"><a href="${esc(href)}" style="display:inline-block;padding:12px 22px;font:700 15px Arial,Helvetica,sans-serif;color:#ffffff;text-decoration:none;">${esc(label)}</a></td></tr></table>`;
}

export function codeEmail(p: { name: string; code: string; purpose: "verify" | "reset"; ttlMin: number }) {
  const what = p.purpose === "verify" ? "confirm your email" : "reset your password";
  const subject =
    p.purpose === "verify" ? `${p.code} is your ${SITE.name} verification code` : `${p.code} is your ${SITE.name} password reset code`;
  const text = [
    `Hi ${p.name},`, ``, `Use this code to ${what}:`, ``, `    ${p.code}`, ``,
    `It expires in ${p.ttlMin} minutes. If you didn't ask for this, you can ignore this email.`, ``, `— ${SITE.name}`,
  ].join("\n");
  const html = layout({
    preheader: `Your code is ${p.code}. It expires in ${p.ttlMin} minutes.`,
    body: `<p style="margin:0 0 12px;">Hi ${esc(p.name)},</p>
<p style="margin:0 0 16px;">Use this code to ${what}:</p>
<p style="margin:0 0 16px;padding:14px 0;background:#f5f3ee;border-radius:8px;text-align:center;font:700 30px/1 'Courier New',Courier,monospace;letter-spacing:8px;color:${INK};">${esc(p.code)}</p>
<p style="margin:0;color:${MUTED};font-size:13px;">It expires in ${p.ttlMin} minutes. If you didn't ask for this, you can safely ignore this email; nobody can sign in without the code.</p>`,
  });
  return { subject, text, html };
}

export interface AlertHit { title: string; price: number; currency: string; url: string }

export function alertEmail(p: { modelName: string; modelUrl: string; maxPrice: number; hits: AlertHit[]; unsubscribeUrl: string; accountUrl: string }) {
  const money = (h: AlertHit) => `${h.currency} ${h.price.toFixed(2)}`;
  const subject = `${p.modelName}: ${p.hits.length} listing${p.hits.length === 1 ? "" : "s"} under ${p.maxPrice}`;
  const text = [
    `Listings for ${p.modelName} at or under your price of ${p.maxPrice}.`,
    `Check the CPU, RAM, storage and whether a power adapter is included before buying.`, ``,
    ...p.hits.map((h) => `- ${money(h)}: ${h.title}\n  ${h.url}`), ``,
    `Specs and buying notes: ${p.modelUrl}`,
    `Manage alerts: ${p.accountUrl}`,
    `Stop this alert: ${p.unsubscribeUrl}`,
  ].join("\n");
  const rows = p.hits
    .map(
      (h) => `<tr><td style="padding:10px 0;border-bottom:1px solid #eeebe4;"><a href="${esc(h.url)}" style="color:${INK};text-decoration:none;font-weight:600;">${esc(h.title)}</a></td>
<td style="padding:10px 0 10px 12px;border-bottom:1px solid #eeebe4;text-align:right;white-space:nowrap;font-weight:700;color:${ACCENT};">${esc(money(h))}</td></tr>`,
    )
    .join("");
  const html = layout({
    preheader: `${p.hits.length} ${p.modelName} listing${p.hits.length === 1 ? "" : "s"} at or under ${p.maxPrice}.`,
    body: `<p style="margin:0 0 6px;font-size:18px;font-weight:700;">${esc(p.modelName)} is under your price</p>
<p style="margin:0 0 16px;color:${MUTED};">Listings at or under ${esc(String(p.maxPrice))}. Check the CPU, RAM, storage and whether a power adapter is included.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">${rows}</table>
${button(p.modelUrl, "Specs and buying notes")}`,
    footer: `You get this because you set a price alert. <a href="${esc(p.accountUrl)}" style="color:${MUTED};">Manage alerts</a> · <a href="${esc(p.unsubscribeUrl)}" style="color:${MUTED};">Stop this alert</a>`,
  });
  return { subject, text, html };
}
