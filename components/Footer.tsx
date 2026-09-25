import Link from "next/link";
import { SITE } from "../lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <nav aria-label="Footer">
          <Link href="/about">About &amp; methodology</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact &amp; corrections</Link>
        </nav>
        <p>
          Some marketplace links may be affiliate links: if you buy through them we may earn a commission at no extra
          cost to you. It never changes which models we list or how we describe them.
        </p>
        <p>
          Spec data last reviewed {SITE.dataUpdated}. Not affiliated with Lenovo, Dell or HP; product names are
          trademarks of their owners.
        </p>
      </div>
    </footer>
  );
}
