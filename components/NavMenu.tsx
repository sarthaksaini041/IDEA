"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LINKS: [string, string][] = [
  ["/", "Finder"],
  ["/compare", "Compare"],
  ["/best", "Best for"],
  ["/guides", "Guides"],
  ["/alerts", "Price alerts"],
  ["/account", "Account"],
];

const isActive = (path: string, href: string) => (href === "/" ? path === "/" || path.startsWith("/models") : path.startsWith(href));

/** Inline links on wide screens; a dropdown menu behind a button on phones (CSS decides which shows). */
export function NavMenu() {
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div className="navmenu" ref={root} data-open={open}>
      <button type="button" className="navmenu__toggle" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>
        <span className="navmenu__icon" aria-hidden="true"><span /><span /><span /></span>
        {open ? "Close" : "Menu"}
      </button>
      <nav id="main-nav" className="nav" aria-label="Main">
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={isActive(path, href) ? "page" : undefined}>{label}</Link>
        ))}
      </nav>
    </div>
  );
}
