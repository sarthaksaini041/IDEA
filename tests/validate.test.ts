import assert from "node:assert/strict";
import { test } from "node:test";
import { validateAlert } from "../lib/validate";

const good = { email: "A@Example.com ", modelSlug: "lenovo-thinkcentre-m720q", maxPrice: "149.6", marketplace: "EBAY_GB" };

test("accepts and normalises a valid alert", () => {
  const r = validateAlert(good);
  assert.ok(r.ok);
  if (r.ok) assert.deepEqual(r.value, { email: "a@example.com", modelSlug: "lenovo-thinkcentre-m720q", maxPrice: 150, marketplace: "EBAY_GB" });
});

test("rejects bad fields with per-field messages", () => {
  const r = validateAlert({ email: "nope", modelSlug: "not-a-model", maxPrice: 5, marketplace: "EBAY_XX" });
  assert.ok(!r.ok);
  if (!r.ok) assert.deepEqual(Object.keys(r.errors).sort(), ["email", "marketplace", "maxPrice", "modelSlug"]);
});

test("rejects non-objects and honeypot submissions", () => {
  assert.ok(!validateAlert(null).ok);
  assert.ok(!validateAlert("x").ok);
  const r = validateAlert({ ...good, website: "http://spam" });
  assert.ok(!r.ok);
});

test("defaults marketplace to EBAY_US", () => {
  const { marketplace, ...rest } = good;
  const r = validateAlert(rest);
  assert.ok(r.ok && r.value.marketplace === "EBAY_US");
});
