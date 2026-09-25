import assert from "node:assert/strict";
import { test } from "node:test";
import { CPUS } from "../data/cpus";
import { COMPARISONS } from "../data/comparisons";
import { MODELS } from "../data/models";
import { CATALOG, alternatives } from "../lib/catalog";
import { MEDIA, transcodeVerdict } from "../lib/media";

test("model slugs are unique and URL-safe", () => {
  const slugs = MODELS.map((m) => m.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const s of slugs) assert.match(s, /^[a-z0-9-]+$/);
});

test("every model references known CPUs and sane specs", () => {
  for (const m of MODELS) {
    assert.ok(m.cpus.length > 0, m.slug);
    for (const id of m.cpus) assert.ok(CPUS[id], `${m.slug} -> ${id}`);
    assert.ok(m.storage.m2Nvme >= 0 && m.storage.m2Nvme <= 3, m.slug);
    assert.ok([16, 32, 64].includes(m.ram.maxOfficialGB), m.slug);
  }
});

test("verified models cite an official source", () => {
  for (const m of MODELS) {
    if (m.confidence === "high") assert.ok(m.sources.length > 0, `${m.slug} is high confidence without a source`);
    for (const src of m.sources) assert.match(src.url, /^https:\/\/(psref\.lenovo\.com|download\.lenovo\.com|dl\.dell\.com|h10032\.www1\.hp\.com)\//);
  }
});

test("measured values are never invented", () => {
  // Idle power must stay null until a real measurement with a source is added.
  for (const m of MODELS) assert.equal(m.idleW, null, `${m.slug} has idleW without a measurement process`);
});

test("known community facts hold", () => {
  const by = (s: string) => MODELS.find((m) => m.slug === s)!;
  assert.equal(by("lenovo-thinkcentre-m920q").storage.m2Nvme, 1, "M920q has one NVMe slot");
  assert.equal(by("lenovo-thinkcentre-m920x").storage.m2Nvme, 2, "M920x has two NVMe slots");
  assert.equal(by("hp-elitedesk-800-g4-mini").storage.m2Nvme, 2);
  assert.notEqual(by("lenovo-thinkcentre-m720q").pcieSlot, "none");
  // Verified against Dell/Lenovo/HP documents (see each model's sources).
  assert.equal(by("dell-optiplex-7080-micro").storage.m2Nvme, 2, "Dell spec: two M.2 SSD slots");
  assert.equal(by("dell-optiplex-7070-micro").ram.maxOfficialGB, 32, "Dell spec: 32 GB max");
  assert.equal(by("hp-elitedesk-800-g5-mini").ram.maxOfficialGB, 32, "HP MSG: up to 32 GB");
  assert.equal(by("lenovo-thinkcentre-m90q-gen-1").pcieSlot, "riser-x8", "PSREF: PCIe 3.0 x8");
});

test("comparisons reference existing models", () => {
  for (const c of COMPARISONS) {
    assert.ok(MODELS.some((m) => m.slug === c.a), c.slug);
    assert.ok(MODELS.some((m) => m.slug === c.b), c.slug);
  }
  assert.equal(new Set(COMPARISONS.map((c) => c.slug)).size, COMPARISONS.length);
});

test("media capabilities by generation", () => {
  assert.equal(MEDIA["intel-gen9"].decode.hevc10, false, "Skylake lacks full 10-bit HEVC decode");
  assert.equal(MEDIA["intel-gen9.5"].decode.hevc10, true);
  assert.equal(MEDIA["intel-gen9.5"].decode.av1, false);
  assert.equal(MEDIA["intel-xe"].decode.av1, true);
  assert.equal(transcodeVerdict("amd-vcn2"), "amd");
});

test("catalog derives verdict from the best CPU option", () => {
  const g3 = CATALOG.find((m) => m.slug === "hp-elitedesk-800-g3-mini")!;
  assert.equal(g3.bestIgpu, "intel-gen9.5", "a 7th-gen option exists");
  const g2 = CATALOG.find((m) => m.slug === "hp-elitedesk-800-g2-mini")!;
  assert.equal(g2.verdict, "limited");
  const alts = alternatives(g3);
  assert.equal(alts.length, 3);
  assert.ok(!alts.some((a) => a.slug === g3.slug));
});
