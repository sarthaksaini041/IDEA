import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { SITE } from "../../lib/site";

export const metadata: Metadata = { title: "Privacy policy", description: `How ${SITE.name} handles your data.`, alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return (
    <div className="prose">
      <Breadcrumbs items={[{ name: "Privacy", href: "/privacy" }]} />
      <h1>Privacy policy</h1>
      <p className="muted small">Last updated {SITE.dataUpdated}</p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Accounts:</strong> if you create one, we store your name, email address, a salted one-way hash of your password (never the password itself), when you verified your email, and a hashed login session. One-time email codes are stored only as hashes and expire after 10 minutes. We also briefly keep short-lived counters of login and code attempts per IP address and email to block abuse; these are deleted after a day.</li>
        <li><strong>Price alerts:</strong> the model, maximum price and marketplace you choose, linked to your account. We use them only to send the alert emails you asked for. Every alert email has a one-click link that deletes that alert, and you can delete alerts from your account page.</li>
        <li><strong>Analytics and performance:</strong> we use Vercel Web Analytics and Vercel Speed Insights, run by our hosting provider Vercel Inc. They count page views, referrers, country, browser and device type, and measure how fast pages load (Core Web Vitals). They set no cookies, store nothing on your device and do not follow you across days or other sites. Before anything is sent, we remove email addresses, one-time codes, tokens and the query string of login and account pages from the page address.</li>
        <li><strong>Local settings:</strong> your compare selection is stored in your own browser (localStorage) and never sent to us.</li>
      </ul>
      <h2>Cookies</h2>
      <p>Browsing sets no cookies. Signing in sets one strictly necessary login cookie. Full details are in our <Link href="/cookies">cookie policy</Link>.</p>
      <h2>Advertising</h2>
      <p>
        This site may show ads served by Google. Third-party vendors, including Google, use cookies to serve ads based on a
        user&apos;s prior visits to this website or other websites. Google&apos;s use of advertising cookies enables it and its
        partners to serve ads to you based on your visit to this site and/or other sites on the Internet. You may opt out of
        personalised advertising by visiting{" "}
        <a href="https://adssettings.google.com" rel="noopener" target="_blank">Google Ads Settings</a>. Learn more about{" "}
        <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">how Google uses information from sites that use its services</a>.
      </p>
      <p>
        Third parties may place and read cookies on your browser, or use web beacons and IP addresses to collect information
        as a result of ad serving on this site. Where the law requires consent (for example in the EEA, UK and Switzerland),
        you will be asked through a consent message before personalised ads are shown.
      </p>
      <h2>Affiliate links</h2>
      <p>Links to marketplaces may be affiliate links. The marketplace may set its own cookies when you click them, under its own privacy policy.</p>
      <h2>Your rights</h2>
      <p>You can ask us to access or delete any data we hold about you by emailing <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. Deleting an alert removes it immediately. To delete your account and all its data, email us from the address on the account.</p>
    </div>
  );
}
