import type { Metadata } from "next";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { SITE } from "../../lib/site";

export const metadata: Metadata = { title: "Contact and corrections", description: `Contact ${SITE.name} or report a spec correction.`, alternates: { canonical: "/contact" } };

export default function Contact() {
  const subject = encodeURIComponent("Spec correction: [model name]");
  const body = encodeURIComponent("Model:\nField that is wrong:\nCorrect value:\nSource (manual link, photo, or your own unit):\n");
  return (
    <div className="prose">
      <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />
      <h1>Contact &amp; corrections</h1>
      <p>Spotted a wrong slot count, RAM limit or NIC? Corrections with a source (a manual link or a photo of your own unit) are the most useful thing you can send.</p>
      <p className="btn-row">
        <a className="btn btn--primary" href={`mailto:${SITE.contactEmail}?subject=${subject}&body=${body}`}>Email a correction</a>
        <a className="btn" href={`mailto:${SITE.contactEmail}`}>General contact</a>
      </p>
      <p className="muted small">Or write to {SITE.contactEmail}.</p>
    </div>
  );
}
