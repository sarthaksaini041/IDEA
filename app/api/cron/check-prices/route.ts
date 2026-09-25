import { NextResponse } from "next/server";
import { getModel } from "../../../../data/models";
import { ebayConfigured, findListingsUnder } from "../../../../lib/ebay";
import { sendEmail } from "../../../../lib/email";
import { alertEmail } from "../../../../lib/emailTemplates";
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
      const unsubscribeUrl = absoluteUrl(`/alerts/unsubscribe?token=${a.token}`);
      const mail = alertEmail({
        modelName: model.shortName,
        modelUrl: absoluteUrl(`/models/${model.slug}`),
        maxPrice: a.maxPrice,
        hits: hits.slice(0, 5),
        unsubscribeUrl,
        accountUrl: absoluteUrl("/account"),
      });
      await sendEmail({ to: a.email, ...mail, headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` } });
      await markNotified(a.id, new Date().toISOString());
      notified++;
    } catch (e) {
      failed++;
      console.error(`[cron] alert ${a.id} failed`, e);
    }
  }
  return NextResponse.json({ checked: alerts.length, notified, failed });
}
