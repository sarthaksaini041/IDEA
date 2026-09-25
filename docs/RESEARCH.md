# Research report (September 2026)

## Method and limits
- **Reddit** was read through the Arctic Shift archive (Reddit's own site blocks this cloud server). Every link below points to the original reddit.com post.
- **Sweep:** about 123 tech subreddits × 9 request keywords (website, tool, app, tracker, spreadsheet…), June 2023 to September 2026, roughly 28,000 posts. Tool-request titles were then filtered and clustered, and the strongest clusters were read in depth.
- **X:** could not be read (x.com is blocked; search returns titles only). X evidence is effectively absent, and nothing was invented to fill the gap.
- **Search demand:** Google Trends (worldwide, via pytrends). Values are relative (0–100), not absolute search volumes.
- **Competitor sites** could only be seen through search results, not opened directly.

## Candidates considered
An early non-tech pass (gardening, lawn care, knitting, houseplants) was dropped when the brief changed to tech. Tech candidates:

| # | Idea | Evidence | Why ranked where |
|---|------|----------|------------------|
| 1 | **Used business mini-PC finder for home servers** (chosen) | Strong: near-daily buying questions across 6 subs, 2025–26 | Growing demand, gap in accurate model-level data, ads + affiliate + alerts |
| 2 | Plex/Jellyfin transcoding hardware checker | Strong | Folded into #1 as its transcoding filter |
| 3 | USB-C charger compatibility checker | Medium | Constant data upkeep |
| 4 | OS age-verification tracker | Strong, news-driven | Political/legal risk, weak monetization |
| 5 | Retro handheld database | Strong | Saturated: three new databases launched in 2026 |
| 6 | RAM/SSD price tracker | Very strong (see Trends) | Saturated: 7+ trackers |
| 7 | AI coding-agent skills directory | Very strong trend | Saturated, ad-blocking audience |
| – | Chromebook update-expiry finder, Steam Deck settings DB, laptop/monitor finders, switch DB, B2B vendor-renewal tracker, Shopify unpaid-invoice app | Thin or crowded | Rejected |

## Evidence for the chosen idea

**Explicit tool requests**
- Filterable database of used mini/SFF PCs requested, because price sites cover only new hardware (2026-02): https://reddit.com/r/homelab/comments/1qxrtzr/
- "Does anyone have a list of which SFF/tiny PCs support ECC?" (2026-07): https://reddit.com/r/homelab/comments/1v68raj/
- "List of mini pc: which generations offer the best balance? QuickSync for Plex/Jellyfin?" (2026-09): https://reddit.com/r/homelab/comments/1wanxp0/

**Repeated comparison questions**
- HP EliteDesk vs Dell OptiPlex (42 comments, 2025-10): https://reddit.com/r/HomeServer/comments/1obxem9/
- Lenovo M920q vs HP 800 G4 (2026-02): https://reddit.com/r/Proxmox/comments/1qy3ieb/

**Price-fairness pain**
- https://reddit.com/r/HomeServer/comments/1th2vzu/ (2026-05)
- https://reddit.com/r/homelab/comments/1v8tt3j/ (2026-07)

**Accuracy is the gap**
- A September 2026 price tracker was criticized for spec errors, including mixing up the M920q (1 NVMe slot) and M920x (2): https://reddit.com/r/selfhosted/comments/1wdboao/

**Transcoding questions**
- https://reddit.com/r/PleX/comments/16lpdbm/
- https://reddit.com/r/PleX/comments/1s4g5i2/
- https://reddit.com/r/PleX/comments/1oeq9qx/
- https://reddit.com/r/jellyfin/comments/1wi984m/

**Search trend (Google Trends, worldwide, quarterly average, 2024 → 2026)**
- "mini pc": about 20 → 35–55 (peak 87 in April 2026)
- "proxmox": 38 → 91
- "jellyfin": 15 → 40
- "optiplex micro": 2–3 → 5–11
- "homelab": roughly 3–8× growth from a low base
- RAM-shortage searches ("ram shortage" +288,400% rising) keep used PCs with RAM already included attractive.

## Competition
- **MPCDB** (claims 4,000+ mini PCs) and **awesomeminipc.com** (469 devices). Both appear to focus on new mini PCs; their coverage of used business models is **unverified** because the sites could not be opened.
- **ServeTheHome** TinyMiniMicro articles: long-form reviews, not filterable data.
- AI-written comparison blogs (budgethomelab, minipclab, 2ndboot, techfuelhq).
- **Differentiation:** per-model, homelab-specific attributes (NVMe count, PCIe riser, NIC chip, second-NIC path, official vs. owner-reported RAM, transcoding by CPU generation), confidence labels, head-to-head pages for real cross-shopping pairs, and price alerts.

## Monetization (estimates, not measured)
- **AdSense:** tech display ads typically earn about $3–8 per 1,000 pageviews (industry range, unverified). $50–100/month therefore needs roughly 15–30k pageviews/month.
- **eBay Partner Network** links on every model page; Amazon for RAM/SSD/NIC could be added.
- **Price alerts:** free now, and a natural paid tier later (more alerts, more markets, sold-price history).

## Main risks
1. **Data accuracy.** See "Spec verification" below: 14 of 23 models are verified; 9 still need checking.
2. **Unverified competitor coverage.** MPCDB may already cover some used models.
3. **eBay sold-price data** needs the Marketplace Insights API (restricted), so alerts use active asking prices.
4. **AdSense approval is not guaranteed.** Google requires valuable original content, so grow the guides and verified data first.

## Google AdSense requirements checked (official docs, via search)
- Eligibility: 18+, original high-quality content, access to the site's HTML: https://support.google.com/adsense/answer/9724
- Program policies: no encouraging clicks, no deceptive placement near navigation: https://support.google.com/adsense/answer/48182 and https://support.google.com/adsense/answer/1346295
- Privacy policy must disclose third-party cookies: https://support.google.com/adsense/answer/1348695
- A Google-certified CMP is required for personalized ads in the EEA/UK (since 2024-01-16) and Switzerland (since 2024-07-31): https://support.google.com/adsense/answer/13554116
- No ads on pages without publisher content (thank-you, error, low-value pages): https://support.google.com/publisherpolicies/answer/11112688
- ads.txt line format `google.com, pub-…, DIRECT, f08c47fec0942fa0`: https://support.google.com/adsense/answer/12171612

## Spec verification (September 2026)
Each model's key figures (official RAM limit, M.2 and 2.5" counts, PCIe, onboard NIC, chipset, power adapters) were checked against official documents downloaded from Lenovo PSREF / download.lenovo.com, dl.dell.com and h10032.www1.hp.com. Every model page links to its source.

**Verified (14):**
- Lenovo: M720q, M920q, M920x, M75q-1, M75q Gen 2, M70q Gen 1, M90q Gen 1
- Dell OptiPlex Micro: 3050, 7050, 7060, 3070, 7070, 3080, 7080

**Corrections the check made to the earlier data:**
- OptiPlex **7080 Micro**: two M.2 SSD slots (was 1) and a half-height PCIe x8 slot (was none).
- OptiPlex **7070 Micro**: 32 GB official maximum (was 64).
- EliteDesk **800 G5 Mini**: 32 GB official maximum (was 64).
- OptiPlex **7050 Micro**: onboard NIC is Intel I219-V (was I219-LM).
- **M90q Gen 1**: PCIe 3.0 x8 slot confirmed; memory is DDR4-2933.
- **M70q Gen 1**: H470 chipset; memory is DDR4-2933.
- Blank chipset and NIC fields filled for M75q-1, M75q Gen 2, OptiPlex 3050, 3070 and 3080.
- Several power-adapter wattages corrected.

**Still unverified (9):**

| Model | Why |
|-------|-----|
| M710q | No official document found |
| OptiPlex 3060 Micro | The service manual has no RAM limit |
| EliteDesk 800 G2 Mini | Official document doesn't confirm every key field |
| EliteDesk 800 G3 Mini | Changed to 1 M.2 slot, since HP's guide describes only one |
| EliteDesk 800 G4 Mini | HP's service guide describes only one M.2 SSD slot; owners report two |
| EliteDesk 800 G5 Mini | Same one-slot vs two-slot conflict as the G4 |
| EliteDesk 800 G6 Mini | No official document found |
| ProDesk 600 G3 Mini | Official document doesn't confirm every key field |
| EliteDesk 705 G4 Mini | Official document doesn't confirm every key field |

HP's QuickSpecs server (h20195.www2.hp.com) was unreachable from the build environment. Checking HP QuickSpecs is the next step for the HP models.
