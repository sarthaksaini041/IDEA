# TinyLab Finder: improvement report

This report was last updated on 2026-09-25. It covers what was built in the September 2026 improvement pass, what is waiting on outside accounts, and what to do next.

Every claim below is backed by one of two things:

- a check that was actually run (listed under "Verified"), or
- a research source (linked in section 11).

---

## 1. Already implemented

### 1.1 New "best for" pages

**What it does**

Adds scalable "best for" and "which mini PCs have X" landing pages at `/best` and `/best/[slug]`.

- **Pages today:** 12 use cases are defined in total, and 11 are published.
- **How pages are built:** each page is a transparent filter over the spec data.
  - The page states its criteria in plain language.
  - Every model on it says why it matched.
  - Each page gets its own title, description, canonical URL, Open Graph and Twitter tags, and ItemList structured data.
- **Thin pages are never published:** a page needs at least 3 matching models (`MIN_MATCHES`).
  - Example: the AV1 page currently has only 2 matches.
  - It is therefore not rendered (the URL returns 404), not linked and not in the sitemap.
  - It will publish itself automatically once a third AV1-capable model is added.

**Files:** `data/usecases.ts`, `app/best/page.tsx`, `app/best/[slug]/page.tsx`, `components/ModelTable.tsx`

**Verified:**

- Every published page returns 200 with exactly one H1, a canonical URL, an Open Graph image and valid JSON-LD.
- The unpublished page returns 404.
- Unit tests check uniqueness, the minimum match count, and that every linked guide or use case resolves.

### 1.2 Automatic comparison pages

**What it does**

Comparison pages grow from 6 to 43, all "meaningful" pairs. They come from two sources:

- **10 curated pairs:** pairs people actually cross-shop, each with a hand-written framing question. New curated pairs include M920q vs OptiPlex 7070 Micro, M920q vs EliteDesk 800 G5, and G6 vs G8.
- **Rule-generated pairs,** made by only three rules:
  - the next CPU generation in the same product line,
  - the budget tier vs the business tier from the same brand and generation,
  - the same generation from a different brand.
- **What the rules never do:** mix Intel and AMD, or pair random eras.

Each comparison page now includes:

- key differences, written as sentences generated from the data,
- the full spec table, including memory type, 2.5/10GbE path, AV1 decode and measured idle power,
- "which one for which job" (the use cases each model meets) and upgrade paths,
- share links (Reddit, X, Facebook, native share or copy),
- related comparisons,
- **a dynamic Open Graph image per pair** (1200×630 PNG with a highlighted-difference table), so links preview properly on Reddit, Discord, X, Facebook and messaging apps.

**Existing URLs:** unchanged. A test checks that the old slugs still exist.

**Files:** `data/comparisons.ts`, `app/compare/[pair]/page.tsx`, `app/compare/[pair]/opengraph-image.tsx`, `app/compare/page.tsx`, `components/ShareLinks.tsx`, `components/CompareTable.tsx`

**Verified:**

- All 43 pages and Open Graph images return 200; each image has content-type `image/png`.
- The `twitter:card` tag and the per-pair `og:image` are present.
- Tests enforce uniqueness, real models, the same vendor for generated pairs, and an upper limit on the generation gap.

### 1.3 Ten new guides (12 in total)

**The new guides:**

1. Do Lenovo Tiny / OptiPlex Micro / EliteDesk Mini PCs support 64 GB of RAM?
2. Which used mini PCs can take a 10GbE card?
3. Mini PC power consumption (how to measure it; turning watts into cost)
4. Choosing a used mini PC for Proxmox
5. NVMe upgrade guide
6. RAM upgrade guide (DDR4 vs DDR5)
7. OPNsense/pfSense router
8. Can a mini PC be a NAS?
9. Used business mini PC vs a new N100
10. TinyMiniMicro model names explained

**How they are written:**

- Tables are generated from `data/models.ts`, so a guide can never disagree with the spec pages.
- Unofficial facts (for example 64 GB on 32 GB-rated models) are labelled as unofficial.
- The N100 figures cite Intel's specification page.

**How the guide page changed:**

- It gains a Related section.
- Links to unpublished `/best` pages are filtered out automatically.
- Its Article structured data gains an author and mainEntityOfPage.
- It gains Twitter tags and the article's modified time.

**Existing guide fix:** AV1 now says "11th gen and newer" (Rocket Lake UHD 7xx is Xe graphics).

**Files:** `data/guides.tsx`, `data/guides-more.tsx`, `app/guides/[slug]/page.tsx`

**Verified:** all guide pages return 200, every internal link resolves (111 internal links crawled), and description lengths are checked by a test.

### 1.4 Model pages

Each model page gained:

- **"Used price" block.** When there is no data it shows an honest "Price data coming soon". With real stored data it shows the lowest and median asking price, the sample size, the date and a history chart.
- **Power section.** A table of cited measurements (range, configuration, method, date, source and attribution). Otherwise it shows "Not measured yet" and a link to submit a reading.
- **"What to buy with it" build list.** RAM, NVMe, 2.5" SATA, NIC and power adapter, derived from the spec. Each item shows the exact spec and why it fits. No prices are shown.
- **Six FAQs generated from data,** also emitted as FAQPage structured data.
- **"Good for" chips** linking to the use-case pages.
- **Related guides,** chosen by each guide's `models` rule.
- **All comparisons** that include the model.
- **Save / watchlist button.**
- **Affiliate disclosure,** shown only when a program is active.
- Twitter tags, and manufacturer data in the WebPage structured data.

The spec sheet gained a "Faster networking" row, and the idle row now uses cited data.

**Files:** `app/models/[slug]/page.tsx`, `lib/faq.ts`, `components/model/*`, `components/SpecSheet.tsx`, `components/AffiliateDisclosure.tsx`

**Verified:** checked in the browser for the empty price state, the build list (DDR5 on G9), 6 FAQs, the power empty state and the anonymous save prompt. A price and chart rendered correctly from test rows in the local database (rows deleted afterwards; production untouched).

### 1.5 Data additions

**New models, both checked against HP QuickSpecs PDFs that were downloaded and parsed:**

- **HP EliteDesk 800 G8 Mini** (Q570, 11th gen): 2× M.2 2280, 1× 2.5", 64 GB DDR4-3200, I219-LM.
- **HP Elite Mini 800 G9** (Q670, 12th/13th gen): **DDR5**, 64 GB, 2× M.2 2280, 1× 2.5", and an optional Flex IO **Intel I226-V 2.5GbE** port.
- These are the first models in the site with **AV1** decode.

**New CPUs:** i5-11400T, i5-11500T, i5-11600T and i5-13500T.

**New fields:**

- `ram.type` now allows DDR5.
- `lanUpgrades`: speed, route, and whether the route is `official` or `community`. For example, the Lenovo riser + PCIe NIC route for 10GbE is marked **community** (reported by owners), because it is not a Lenovo option.
- `power: PowerRecord[]`: kind, idle (as a range), load, configuration, method, date, source and `via` attribution.

**11 cited idle-power readings** (`data/power.ts`):

- **Where they come from:** original ServeTheHome TinyMiniMicro reviews, imported through the CC BY 4.0 [homelab-mini-pc-dataset](https://github.com/SolvoHQ/homelab-mini-pc-dataset).
- **Attribution:** every reading shows its original source and the dataset it came through.
- **Excluded on purpose:**
  - editorial estimates,
  - second-hand "buyer's guide" aggregates,
  - configurations that would mislead: the M920x measured with a discrete GPU, and the OptiPlex 7060 measured with a 65 W CPU.

**Verified:** tests check that power records have an https source, a date and sane bounds; that every 10GbE claim sits on a model with a PCIe slot; and that every power key is a real model.

### 1.6 eBay price integration (built but switched off: `PENDING_CREDENTIALS`)

**Pieces:**

- **Provider interface:** `lib/prices/types.ts`.
- **eBay Browse provider:** `lib/prices/ebay.ts`.
  - Gets an app token through the client-credentials grant.
  - 8-second timeouts.
  - Searches used condition IDs and fixed-price listings only.
  - Filters out parts listings (caddy, riser, "for parts", barebone and so on) and extreme outliers.
  - Requires at least 3 listings, otherwise returns nothing.
- **Configuration and status** (`ACTIVE` / `PENDING_CREDENTIALS` / `DISABLED`): `lib/prices/config.ts`.
- **Storage:** `lib/prices/store.ts`, writing to the new `price_snapshots` table (migration applied to Supabase).
- **Sync:** `lib/prices/sync.ts`. It never calls eBay unless status is ACTIVE.
- **Public API:** `GET /api/prices/[slug]`.
  - Always returns 200 with a status plus `degraded` when the database fails.
  - CDN-cached for 1 hour.
  - In-memory rate limit.
- **Daily cron:** `GET /api/cron/sync-prices` at 05:47 UTC in `vercel.json`. Without credentials it returns `PENDING_CREDENTIALS` and writes nothing.
- **UI:** `components/model/PriceBox.tsx` and `PriceChart.tsx` (an SVG chart that plots stored observations only).

**Verified:**

- Unit tests confirm that without keys the status is `PENDING_CREDENTIALS`, the provider is **never called**, nothing is saved, and history is empty.
- DISABLED and ACTIVE states and market parsing are tested.
- Live checks: `/api/prices` returns `PENDING_CREDENTIALS`; the cron returns 401 without its secret and `PENDING_CREDENTIALS` with it.
- With the database unreachable, `/api/prices` returns 200 with `degraded: true` and the model page still returns 200.

### 1.7 Amazon Associates (built but switched off)

- **Switch:** `lib/affiliate/amazon.ts` is enabled only by a correctly formatted `NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG` (for example `name-20`). An invalid or missing tag keeps it disabled.
- **Links:** search links only, marked `rel="sponsored"`. **Amazon prices are never shown**, because the Operating Agreement forbids prices that did not come from its API.
- **Build list:** `lib/build.ts` and `components/model/BuildList.tsx` show Amazon buttons only when Amazon is enabled.
- **Disclosure:** `components/AffiliateDisclosure.tsx` includes the required sentence "As an Amazon Associate we earn from qualifying purchases."

**Verified:** tests show no link without a tag or with an invalid tag, and the correct tag parameter when one is set. The browser check found no Amazon links on the live-like build. A test confirms no build item contains a price.

### 1.8 Build lists

This is the per-model "What to buy with it" list described under 1.4.

- **How it's built:** it is derived from RAM type and speed, slot counts, the PCIe path, the vendor NIC module and the power adapter wattage.
- **Total price:** an estimated total is **not** shown, because no legitimate part prices exist. The architecture allows it once a live source does.

### 1.9 "Which mini PC is right for me?" quiz (`/which-mini-pc`)

- **Six questions.** Each answer becomes a yes/no rule over the spec data. There are no scores or weights.
- **Results** list the rules each model met. If nothing meets every rule, the "closest" list shows each model that misses exactly one rule, and names that rule.
- **Sort order:** lowest cost first (older generations, stated as a proxy because we have no prices) or newest first.
- **Pure logic** lives in `lib/quiz.ts` and is unit-tested.
- **Mobile:** a "see results" jump link.

**Files:** `lib/quiz.ts`, `components/Quiz.tsx`, `app/which-mini-pc/page.tsx`

### 1.10 Saved models / watchlist

- **Storage:** a `saved_models` table (migration applied).
- **API:** `GET/POST /api/saved` with a session, a CSRF check (Origin plus JSON content type), and a Postgres rate limit of 60 changes per 10 minutes. A user can save up to 50 models.
- **UI:** a Save button on model pages, and a "Saved models" section on `/account` with alert links and a "compare saved" link.

**Verified in the browser:** signup → email code → verify → save → the account page lists the model → unsave. A cross-site POST returns 403, and an anonymous GET returns `signedIn: false`.

### 1.11 Security and reliability

- **Malformed URLs now return 404 instead of 500.** A new `proxy.ts` (the Next 16 name for middleware) uses the testable `isMalformedPath()` in `lib/paths.ts`. Before this fix, Vercel logs showed 500s for bot-probe URLs such as `/alerts%5C` (`NoFallbackError`).
- **Security headers** in `next.config.ts`:
  - `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and COOP,
  - `poweredByHeader: false`,
  - `X-Robots-Tag: noindex` on `/api/*`.
- **Rate limits:**
  - The auth endpoints already had Postgres-backed limits.
  - New: alert creation (20 per hour per user), the saved-models API, and an in-memory per-IP limit on `/api/prices` (`lib/memlimit.ts`).
- **Error monitoring:** `lib/monitoring.ts` always writes a structured log line and can also send to `ERROR_WEBHOOK_URL` (Slack, Discord or any collector). It is wired into all API error paths through `serverError()`, plus price sync, the prices API and the cron.
- **Error boundary:** `app/error.tsx` shows a friendly page with retry.

**Verified:** `/alerts%5C` and `/alerts%5C%5C%5C` return 404; the headers are present and `x-powered-by` is absent; the header tests pass.

### 1.12 CI

- `.github/workflows/ci.yml` runs on every push to `main`/`development` and on PRs.
- Steps: `npm ci` → typecheck → unit tests → production build.

### 1.13 SEO and internal linking

- **Sitemap:** now 102 URLs, and a test checks for duplicates and missing pages.
  - Added: `/best`, the use-case pages, `/which-mini-pc`, all 43 comparisons, and the new guides and models.
  - Private pages are never included, and a test enforces that.
- **Navigation:** "Best for" was added.
- **Home page:** quiz and "best picks" buttons, plus "Popular lists" chips.
- **Links between content types:**
  - Model pages link to use cases, guides and comparisons.
  - Guides link to related lists and guides.
  - Use-case pages link to guides and related lists.
- **Metadata:** privacy and terms descriptions were fixed (they were too short). The About page gains "How we make money" and "Prices and power figures" policy sections.

### 1.14 Tests: 31 in total (17 before)

`tests/site.test.ts` adds 14 tests covering:

- use cases, comparisons, guides and the sitemap,
- the quiz,
- malformed paths,
- the price-integration states,
- price statistics,
- Amazon being disabled,
- build lists,
- FAQs,
- power and networking provenance,
- the power dataset,
- the rate limiter.

---

## 2. Pending eBay credentials

**What you need to provide:** an eBay Developer **production keyset**, which gives you an App ID (Client ID) and a Cert ID (Client Secret). The Dev ID and a user token are not needed, because the app uses the client-credentials grant.

**How to switch it on:**

1. At developer.ebay.com, create a production keyset. For "Marketplace Account Deletion", choose the exemption (the app stores no eBay user data).
2. In Vercel (Production and Preview):
   - Set `EBAY_CLIENT_ID` and `EBAY_CLIENT_SECRET` (mark the secret "Sensitive").
   - Optionally set `PRICE_MARKETS=EBAY_US,EBAY_GB,EBAY_DE`.
3. Redeploy. There is no migration step: `price_snapshots` already exists in Supabase.
4. Trigger the first sync: `curl -H "Authorization: Bearer $CRON_SECRET" https://tinylabfinder.online/api/cron/sync-prices`. After that it runs daily.

**Also affected:** the existing alert-checking cron (`/api/cron/check-prices`) starts sending alert emails automatically once the keys exist.

**API considerations:**

- **Call volume:** Browse has a default limit of 5,000 calls per day. One sync is about 27 models × the number of markets, so well under the limit.
- **Higher limits:** these need eBay's Application Growth Check.
- **Sold prices:** these need the separately approved **Marketplace Insights API**. Until then, the site labels prices as "asking prices" (as it does now).
- **Tuning left to do once real data flows:**
  - Tune the `NOT_A_UNIT` title filter and the outlier threshold (35% of the median) against real results.
  - Consider category filtering (Desktops & All-in-Ones) to cut accessory noise.

---

## 3. Pending Amazon account

**Requirements:**

- An Amazon Associates account.
- **3 qualifying sales within 180 days**, or Amazon closes the account.
- Price data through the API needs the **Creators API**, which requires 10 qualifying sales in the trailing 30 days. The Product Advertising API was shut down on 30 April 2026.

**Configuration:**

- `NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG=<yourtag>-20`
- `NEXT_PUBLIC_AMAZON_HOST` (optional, for example `www.amazon.co.uk`)

**Where links will appear:** the "What to buy with it" list on every model page (RAM kit, NVMe, SATA SSD, NIC or USB adapter, power adapter). The disclosure sentence appears automatically.

**Remaining steps:**

- Add the tag and redeploy.
- Optionally add region routing (for example a UK visitor → amazon.co.uk). Needs geolocation, via a Vercel header.
- After Creators API eligibility: add a price provider to show live part prices and an estimated build total. The hooks are already in `lib/build.ts` via `itemLink`.

---

## 4. Pending AdSense approval

**Technically ready:**

- The ad-slot architecture: `components/ads/*` with the in-content, sidebar, below-results and footer placements.
- Reserved heights, so layout doesn't shift when ads load.
- The `NEXT_PUBLIC_ADS_PROVIDER` feature flag (currently `none`).
- `/ads.txt` generated from the client ID.
- Supporting pages: a cookie policy that changes its text automatically when AdSense is on, a privacy policy with Google's required wording, About, Contact, Terms, and an affiliate disclosure.
- The content base: about 100 indexable pages of original, data-backed content.

**Needs Google:** site approval.

- Google judges quality and E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).
- Apply once there is organic traffic and the site has been indexed for a few weeks.

**After approval:**

1. Set `NEXT_PUBLIC_ADS_PROVIDER=adsense`, `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-…` and the `NEXT_PUBLIC_AD_SLOT_*` IDs.
2. In AdSense, enable Privacy & messaging → a European regulations message (a Google-certified consent message) for the EEA, UK and Switzerland.
3. Add a Content-Security-Policy that allows Google ad hosts (see section 9).

---

## 5. SEO opportunities, most valuable first

**High impact, low effort (data-driven, can do now):**

- **Add 3 or more more 11th–13th gen models** (Lenovo M70q Gen 3, M90q Gen 3, M80q Gen 2; Dell OptiPlex 7000/7010 Micro; HP ProDesk 400/600 G6–G9 Mini).
  - This publishes the **AV1 page** automatically.
  - It adds high-demand "Gen 3" searches (M70q Gen 3 listings sell at around $350 in 2026).
  - It generates new successor and cross-brand comparisons.
- **"Does the [model] support X?" questions.** These are already answered in the model FAQs. Consider dedicated anchors, or linking to them from Google Search Console queries once impression data arrives.
- **"[model] vs N100" pages.** The N100 guide already covers the concept; per-model versions would target the frequent "M920q vs N100" searches.

**High impact, medium effort:**

- **Model families missing entirely:** Lenovo ThinkCentre M900/M910q (very common), M715q; Dell OptiPlex 5000-series Micro; HP ProDesk 400/600 G4–G6 Mini; Fujitsu Esprimo (strong in the EU).
- **"Best mini PC under $X" pages.** These need **real** prices, so they should wait for eBay.
- **Proxmox cluster guide:** 3-node builds, a QDevice, Ceph on NVMe, and a 2.5GbE switch.
- **IOMMU / GPU passthrough and ECC.** The idlewatt dataset tracks these and we do not.

**Internal linking:**

- Link from `/compare` model cells to `/best` pages.
- Add breadcrumbs "Best for → model" once a model is in a list.
- Mark up guide tables with anchor IDs for sitelinks.

---

## 6. Data improvements

- **Missing models:** see section 5.
- **Missing specifications:**
  - PCIe generation per M.2 slot,
  - dimensions and weight,
  - fan and noise,
  - USB-C and Thunderbolt,
  - maximum number of displays,
  - IOMMU groups,
  - ECC support,
  - BIOS version notes.
- **Unverified models** (`confidence: "check"`): verifying them against Lenovo PSREF, Dell setup-and-specifications PDFs and HP MSG/QuickSpecs would lift trust.
  - Lenovo and Dell hosts were unreachable from this build environment; HP was reachable.
- **Power:** 11 of 27 models now have a cited reading.
  - Next: ENERGY STAR idle-state figures (an official manufacturer source), and moderated community submissions (the form fields are already defined in `PowerRecord`).
- **Prices and history:** waiting on eBay (section 2).
- **Compatibility:** tested RAM kits and 10GbE cards per model (community-sourced, cited).

---

## 7. Revenue opportunities

- **eBay Partner Network.** Links are already built with `campid`/`customid`. Add the campaign ID once approved. Live prices (section 2) should lift click-through.
- **Amazon Associates.** Build-list links (section 3).
- **AdSense** (section 4).
- **Other legitimate options:**
  - **Newegg / B&H affiliate programs** for new parts (RAM, NVMe), using the same build-list architecture.
  - **Refurbisher partnerships**, clearly disclosed.
  - A **"compatible parts" list per model**, which is a natural home for affiliate links.
  - Sponsorship of the price-alert emails (clearly labelled).

---

## 8. User features

- **Done:** finder, quiz, watchlist, price alerts, 43 comparisons, sharing, build lists.
- **Next:**
  - saved builds (a watchlist plus chosen parts),
  - "alert me when a saved model drops below X" (connect the watchlist to alerts),
  - a community power-reading submission form with moderation,
  - an embeddable comparison widget,
  - RSS / newsletter for new models and price drops.

---

## 9. Technical improvements

- **Content-Security-Policy.** Deferred on purpose so ads aren't broken. Plan:
  - `default-src 'self'`,
  - scripts from self, `vercel-scripts` and the Google ad hosts,
  - JSON-LD handled by a nonce or hashes,
  - `img-src` self plus Google,
  - `frame-src` for the Google ad and consent frames.
  - Test it in report-only mode first.
- **Branch protection on `main`:** require the "CI / checks" status so a red build can't be merged. A GitHub setting; I have no tool for it.
- **Vercel firewall:** add a rate-limit rule on `/api/auth/*` as a second layer, plus Bot Protection (both available on Hobby).
- **Proxy cost:** the malformed-path check runs on page requests. Hobby includes 1M middleware invocations a month. If traffic approaches that, narrow the matcher.
- **Rate limiting:** `/api/prices` uses a per-instance limiter. If it is abused, move it to the Vercel firewall or an Upstash rate limit.
- **Monitoring:** add Sentry by replacing `send()` in `lib/monitoring.ts`. Add an uptime check (for example UptimeRobot on `/` and `/api/prices/<slug>`).
- **Database:** add a retention job for `price_snapshots` (for example keep daily lows beyond 1 year). Consider moving auth attempts to a cheaper store if traffic grows.
- **Tests:** add Playwright end-to-end tests to CI (the local scripts used here are the starting point).

---

## 10. Content opportunities (future clusters)

- **Proxmox:** cluster on 3 Tiny PCs, ZFS on mini PCs, Ceph feasibility, backup server (PBS).
- **Media:** Plex vs Jellyfin transcoding by generation (in progress), HDR tone mapping, Intel GPU passthrough to LXC.
- **Networking:** 2.5GbE on Lenovo Tiny, the HP Flex IO module compatibility matrix, VLANs on a single port.
- **Buying:** how to read a Lenovo machine type (MTM) and HP product number, a BIOS password guide, which power bricks fit which models.
- **Power:** yearly cost by model (once readings exist), and "Is it worth replacing a 6th-gen box to save power?"

---

## 11. Research findings

- **Demand.** "Best mini PC for Proxmox/homelab 2026" is covered by many blogs. The Lenovo M920q is the most recommended used pick because of its PCIe riser and the 64 GB reports ([ComputingForGeeks](https://computingforgeeks.com/best-mini-pc-for-homelab-proxmox/), [Budget Homelab](https://budgethomelab.com/articles/used-mini-pc-homelab-under-200/), [JPK.io](https://jpk.io/home-lab/best-mini-pc-proxmox-homelab/)). N100/N150 boxes are the main new-hardware alternative ([HomeLab Starter](https://homelabstarter.com/homelab-n100-mini-pc-builds/)).
- **Common questions:**
  - 64 GB RAM support,
  - M920q vs M920x (the second NVMe slot),
  - 10GbE / quad NIC via the riser ([STH M920q review](https://www.servethehome.com/lenovo-thinkcentre-m920-and-m920q-tiny-guide-and-review/)),
  - HP Flex IO 2.5GbE module compatibility between V1 and V2 machines ([STH forums](https://forums.servethehome.com/index.php?threads%2F2-5g-nic-for-elitedesk-800-g4.44418%2F=)).
- **Competitors:**
  - [MiniPC Spec](https://minipcspec.com/): 292 models, specs only.
  - [MPCDB](https://mpcdb.com/) and [Awesome Mini PC](https://awesomeminipc.com/): consumer-focused.
  - [minipcprice](https://minipcprice.com/): listing prices.
  - **[idlewatt / homelab-mini-pc-dataset](https://github.com/SolvoHQ/homelab-mini-pc-dataset)** (CC BY 4.0): cited idle power, IOMMU and ECC.
  - **The gap we fill:** homelab-specific verdicts (transcoding, PCIe/NIC paths), source-labelled confidence, and price alerts.
- **Manufacturer documentation:**
  - HP QuickSpecs for the 800 G8 ([c07048012](https://h20195.www2.hp.com/v2/GetPDF.aspx/c07048012.pdf)) and the 800 G9 ([c08017769](https://h20195.www2.hp.com/v2/GetPDF.aspx/c08017769.pdf)) were parsed directly.
  - Intel's N100 specification page is cited in the N100 guide.
- **Revenue rules:**
  - eBay API call limits and the Growth Check ([eBay](https://developer.ebay.com/develop/get-started/api-call-limits)).
  - EPN disclosure rules ([EPN](https://partnernetwork.ebay.com/resources/affiliate-disclosure-faq)).
  - Amazon: 3 sales in 180 days; the Creators API needs 10 sales in 30 days; PA-API was shut down on 30 April 2026 ([summary](https://muntaseerrahman.com/blog/amazon-pa-api-sunset-creators-api-migration/); [Associates policies](https://affiliate-program.amazon.com/help/operating/policies)).
  - AdSense eligibility and low-value-content guidance ([Google](https://support.google.com/adsense/answer/9724?hl=en)).
- **Research limits:**
  - Reddit, Lenovo PSREF, Dell, ServeTheHome and energystar.gov were blocked from this build environment, so community demand was assessed through search results and secondary sources.
  - Power readings come from the cited dataset, not from our own reading of STH.

---

## 12. Recommended next work

**Can be done immediately (no accounts needed):**

1. Add Lenovo M70q/M90q Gen 3, Dell OptiPlex 7000 Micro and HP ProDesk 600 G6 Mini from official documents. This publishes the AV1 page.
2. Add ENERGY STAR idle figures where the configuration matches.
3. Turn on branch protection requiring CI, and the Vercel firewall rate-limit rule.
4. Submit the sitemap in Search Console (done by the owner) and watch the queries for new use-case pages.
5. Add a community power-submission form (moderated) and connect the watchlist to alerts.

**Requires eBay:** live prices, price history, "best under $X" pages, accurate price alerts, and more EPN revenue.

**Requires Amazon:** build-list links. After 10 sales in 30 days: the Creators API for part prices and build totals.

**Requires AdSense approval:** turning on ad slots, the consent message, and the CSP update.

**Requires external services (optional):** Sentry, an uptime monitor, and Upstash for global rate limits.

**Long-term:** an open, cited, community-maintained 1-litre PC dataset (for contributions and backlinks), an embeddable widget, and a newsletter.
