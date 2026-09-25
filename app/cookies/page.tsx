import type { Metadata } from "next";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import Link from "next/link";
import { AD_PROVIDER, adsEnabled } from "../../components/ads/AdConfig";
import { SITE } from "../../lib/site";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: `Every cookie and browser storage item ${SITE.name} uses, and why.`,
  alternates: { canonical: "/cookies" },
};

export default function Cookies() {
  const adsOn = AD_PROVIDER === "adsense" && adsEnabled();
  return (
    <div className="prose">
      <Breadcrumbs items={[{ name: "Cookies", href: "/cookies" }]} />
      <h1>Cookie policy</h1>
      <p className="muted small">Last updated {SITE.dataUpdated}</p>
      <p>
        We keep this short because we use very little. Browsing models, filters, comparisons and guides sets no cookies
        at all. The only cookie we set is a login cookie, and only after you sign in.
      </p>

      <h2>What we use</h2>
      <div className="table-scroll">
        <table className="grid-table">
          <thead>
            <tr><th>Name</th><th>Type</th><th>Purpose</th><th>Kept for</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>tlf_session</code></td>
              <td>Cookie, first-party. Strictly necessary.</td>
              <td>Keeps you signed in so you can manage price alerts. Set only when you log in. It holds a random token; we store only its hash. HttpOnly, Secure and SameSite=Lax, so scripts and other sites cannot read it.</td>
              <td>30 days, or until you log out</td>
            </tr>
            <tr>
              <td><code>tlf-compare</code></td>
              <td>localStorage, first-party. Functional.</td>
              <td>Remembers the models you added to compare. It never leaves your browser.</td>
              <td>Until you clear it or your browser data</td>
            </tr>
            <tr>
              <td>Vercel Web Analytics</td>
              <td>No cookies, no storage</td>
              <td>Counts page views, referrers, country and device type. Visitors are not tracked across days or sites. We strip email addresses, codes and tokens from page addresses before anything is sent.</td>
              <td>Nothing stored on your device</td>
            </tr>
            <tr>
              <td>Vercel Speed Insights</td>
              <td>No cookies, no storage</td>
              <td>Measures real page load speed (Core Web Vitals) so we can keep the site fast. Same address scrubbing as above.</td>
              <td>Nothing stored on your device</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Why there is no cookie banner</h2>
      <p>
        Consent laws such as the EU ePrivacy Directive and UK PECR exempt storage that is strictly necessary for a service
        you ask for: staying logged in, and remembering your own compare list. Our analytics set no cookies and store
        nothing on your device. So there is nothing to ask permission for today.
      </p>

      <h2>Advertising</h2>
      {adsOn ? (
        <p>
          This site shows ads served by Google AdSense. Google and its partners may set cookies to serve and measure ads.
          Visitors in the EEA, UK and Switzerland are asked for consent through Google&apos;s certified consent message
          before any personalised ads or ad cookies are used. You can change your choice at any time from the
          &quot;Privacy and cookie settings&quot; link that message adds to the page.
        </p>
      ) : (
        <p>
          Ads are not switched on yet. If we add Google AdSense, Google and its partners may set advertising cookies. Before
          that happens this page will list them, and visitors in the EEA, UK and Switzerland will be asked for consent
          through Google&apos;s certified consent message first.
        </p>
      )}
      <p>
        You can opt out of personalised Google ads at{" "}
        <a href="https://adssettings.google.com" rel="noopener" target="_blank">Google Ads Settings</a>.
      </p>

      <h2>Marketplace links</h2>
      <p>When you click through to a marketplace such as eBay, that site sets its own cookies under its own policy.</p>

      <h2>Controlling cookies</h2>
      <p>
        You can block or delete cookies in your browser settings. Blocking <code>tlf_session</code> means you cannot sign
        in; everything else on the site works without it.
      </p>
      <p>
        Questions: <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. See also our{" "}
        <Link href="/privacy">privacy policy</Link>.
      </p>
    </div>
  );
}
