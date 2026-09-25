import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertList, LogoutButton, type AlertView } from "../../components/auth/AccountActions";
import { getModel } from "../../data/models";
import { getSessionUser } from "../../lib/auth/session";
import { MARKETPLACES } from "../../lib/listings";
import { MAX_ALERTS_PER_USER, listForUser } from "../../lib/store";
import { listSaved } from "../../lib/saved";

export const metadata: Metadata = { title: "Your account", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account");
  const alerts: AlertView[] = (await listForUser(user.id)).map((a) => ({
    id: a.id,
    modelSlug: a.modelSlug,
    modelName: getModel(a.modelSlug)?.name ?? a.modelSlug,
    maxPrice: a.maxPrice,
    market: MARKETPLACES[a.marketplace].label,
    currency: MARKETPLACES[a.marketplace].currency,
  }));
  const saved = (await listSaved(user.id)).map(getModel).filter((m): m is NonNullable<typeof m> => Boolean(m));
  return (
    <div className="prose" style={{ maxWidth: 760 }}>
      <h1>Hi, {user.name}</h1>
      <p className="muted">Signed in as {user.email}. Alerts are sent to this address.</p>
      <h2>Your price alerts ({alerts.length}/{MAX_ALERTS_PER_USER})</h2>
      <AlertList alerts={alerts} />
      {alerts.length > 0 && alerts.length < MAX_ALERTS_PER_USER && <p><Link href="/alerts">+ Add another alert</Link></p>}
      <h2>Saved models ({saved.length})</h2>
      {saved.length ? (
        <>
          <ul>{saved.map((m) => <li key={m.slug}><Link href={`/models/${m.slug}`}>{m.name}</Link> · <Link href={`/alerts?model=${m.slug}`}>set price alert</Link></li>)}</ul>
          {saved.length > 1 && <p><Link href={`/compare?m=${saved.slice(0, 3).map((m) => m.slug).join(",")}`}>Compare saved models →</Link></p>}
        </>
      ) : (
        <p className="muted">Use &quot;Save model&quot; on any model page to keep a shortlist here.</p>
      )}
      <h2>Account</h2>
      <LogoutButton />
    </div>
  );
}
