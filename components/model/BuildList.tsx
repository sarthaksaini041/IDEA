import type { Model } from "../../data/models";
import { amazonEnabled } from "../../lib/affiliate/amazon";
import { buildList, itemLink } from "../../lib/build";

/** "What to buy with it": compatible parts derived from the spec data. No prices shown. */
export function BuildList({ m }: { m: Model }) {
  const items = buildList(m);
  const affiliate = amazonEnabled();
  return (
    <>
      <ul className="build-list">
        {items.map((it) => {
          const href = itemLink(it);
          return (
            <li key={it.id} className="build-list__item">
              <div>
                <strong>{it.label}</strong>{it.optional && <span className="small muted"> · optional</span>}
                <div className="small">{it.spec}</div>
                <div className="small muted">{it.compatibility}</div>
              </div>
              {href && <a className="btn" href={href} target="_blank" rel="sponsored nofollow noopener">Find on Amazon ↗</a>}
            </li>
          );
        })}
      </ul>
      <p className="small muted">
        We list the spec to look for rather than a price, because part prices change daily and we only show prices from a live source.
        {affiliate && " As an Amazon Associate we earn from qualifying purchases."}
      </p>
    </>
  );
}
