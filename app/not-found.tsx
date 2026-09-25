import Link from "next/link";

export default function NotFound() {
  return (
    <div className="prose">
      <h1>Page not found</h1>
      <p>That page doesn&apos;t exist, or the model was renamed.</p>
      <p className="btn-row"><Link className="btn btn--primary" href="/">Open the finder</Link><Link className="btn" href="/guides">Read the guides</Link></p>
    </div>
  );
}
