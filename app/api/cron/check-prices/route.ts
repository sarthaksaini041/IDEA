import { NextResponse } from "next/server";
import { getModel } from "../../../../data/models";
import { ebayConfigured, findListingsUnder } from "../../../../lib/ebay";
import { sendEmail } from "../../../../lib/email";
import { searchQuery } from "../../../../lib/listings";
import { absoluteUrl } from "../../../../lib/site";
import { listActive, markNotified } from "../../../../lib/store";

// Called by a scheduler (vercel.json cron or any external cron) with
// "Authorization: Bearer $CRON_SECRET".
const RENOTIFY_MS = 24 * 60 * 60 * 1000;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!ebayConfigured()) return NextResponse.json({ error: "eBay API not configured" }, { status: 503 });

  const alerts = await listActive();
  let notified = 0;
  let failed = 0;
  for (const a of alerts) {
    if (a.lastNotifiedAt && Date.now() - Date.parse(a.lastNotifiedAt) < RENOTIFY_MS) continue;
    const model = getModel(a.modelSlug);
    if (!model) continue;
    try {
      const hits = await findListingsUnder(searchQuery(model), a.maxPrice, a.marketplace);
      if (!hits.length) continue;
      const lines = hits.slice(0, 5).map((h) => `- ${h.currency} ${h.price.toFixed(2)}: ${h.title}\n  ${h.url}`);
      await sendEmail(
        a.email,
        `${model.shortName} listed under ${a.maxPrice}`,
        [
          `Current listings at or under your price (check the CPU, RAM and whether a power adapter is included):`,
          ``,
          ...lines,
          ``,
          `Specs and what to check: ${absoluteUrl(`/models/${model.slug}`)}`,
          `Unsubscribe: ${absoluteUrl(`/alerts/unsubscribe?token=${a.token}`)}`,
        ].join("\n"),
      );
      await markNotified(a.id, new Date().toISOString());
      notified++;
    } catch (e) {
      failed++;
      console.error(`[cron] alert ${a.id} failed`, e);
    }
  }
  return NextResponse.json({ checked: alerts.length, notified, failed });
}
