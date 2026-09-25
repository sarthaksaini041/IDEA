import { NextResponse } from "next/server";
import { reportError } from "../../../../lib/monitoring";
import { priceStatus } from "../../../../lib/prices/config";
import { syncPrices } from "../../../../lib/prices/sync";

export const maxDuration = 60;

// Daily price sync (vercel.json cron). Until eBay credentials exist this is a no-op that
// reports PENDING_CREDENTIALS; it never writes placeholder prices.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const status = priceStatus();
  if (status !== "ACTIVE") return NextResponse.json({ status, saved: 0 }, { status: 200 });
  try {
    return NextResponse.json(await syncPrices());
  } catch (e) {
    reportError(e, { where: "cron/sync-prices" });
    return NextResponse.json({ status, error: "sync failed" }, { status: 500 });
  }
}
