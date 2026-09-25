import Link from "next/link";
import { SITE } from "../lib/site";

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand" aria-label={`${SITE.name} home`}>
          <span className="brand__mark" aria-hidden="true" />
          {SITE.name}
        </Link>
        <nav className="nav" aria-label="Main">
          <Link href="/">Finder</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/alerts">Price alerts</Link>
        </nav>
      </div>
    </header>
  );
}
