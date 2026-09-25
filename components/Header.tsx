import Link from "next/link";
import { SITE } from "../lib/site";
import { NavMenu } from "./NavMenu";

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand" aria-label={`${SITE.name} home`}>
          <span className="brand__mark" aria-hidden="true" />
          {SITE.name}
        </Link>
        <NavMenu />
      </div>
    </header>
  );
}
