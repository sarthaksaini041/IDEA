import assert from "node:assert/strict";
import { test } from "node:test";
import { codeMatches, hashCode, hashPassword, hashToken, newCode, newSessionToken, verifyPassword } from "../lib/auth/crypto";
import { checkPassword, safeNext, type Errors } from "../lib/auth/validate";
import { validateAlert } from "../lib/validate";

test("passwords hash with a random salt and verify", async () => {
  const a = await hashPassword("correct horse battery");
  const b = await hashPassword("correct horse battery");
  assert.notEqual(a, b, "salted");
  assert.match(a, /^scrypt\$16384\$8\$1\$/);
  assert.ok(await verifyPassword("correct horse battery", a));
  assert.ok(!(await verifyPassword("correct horse batterY", a)));
  assert.ok(!(await verifyPassword("x", "garbage")));
});

test("codes are 6 digits, keyed and bound to user + purpose", () => {
  for (let i = 0; i < 50; i++) assert.match(newCode(), /^\d{6}$/);
  const h = hashCode("u1", "verify", "123456");
  assert.ok(codeMatches("u1", "verify", "123456", h));
  assert.ok(!codeMatches("u1", "verify", "123457", h));
  assert.ok(!codeMatches("u2", "verify", "123456", h), "other user");
  assert.ok(!codeMatches("u1", "reset", "123456", h), "other purpose");
});

test("session tokens are random and stored only as hashes", () => {
  const t = newSessionToken();
  assert.ok(t.length >= 43);
  assert.notEqual(t, newSessionToken());
  assert.notEqual(hashToken(t), t);
  assert.equal(hashToken(t), hashToken(t));
});

test("password rules", () => {
  const e = (pw: string, email = "a@b.co") => { const x: Errors = {}; checkPassword(pw, email, x); return x.password; };
  assert.ok(e("short"));
  assert.ok(e("aaaaaaaa"));
  assert.ok(e("password"));
  assert.ok(e("a@b.co.uk", "a@b.co.uk"));
  assert.equal(e("a decent passphrase"), undefined);
});

test("post-login redirects stay on this site", () => {
  assert.equal(safeNext("/alerts?model=x"), "/alerts?model=x");
  assert.equal(safeNext("//evil.com"), "/account");
  assert.equal(safeNext("https://evil.com"), "/account");
  assert.equal(safeNext("/\\evil.com"), "/account");
  assert.equal(safeNext(undefined), "/account");
});

test("alert validation", () => {
  const ok = validateAlert({ modelSlug: "lenovo-thinkcentre-m720q", maxPrice: "149.6", marketplace: "EBAY_GB" });
  assert.ok(ok.ok && ok.value.maxPrice === 150 && ok.value.marketplace === "EBAY_GB");
  const bad = validateAlert({ modelSlug: "nope", maxPrice: 5, marketplace: "toString" });
  assert.ok(!bad.ok && bad.errors.marketplace && bad.errors.modelSlug && bad.errors.maxPrice);
  const def = validateAlert({ modelSlug: "lenovo-thinkcentre-m720q", maxPrice: 100 });
  assert.ok(def.ok && def.value.marketplace === "EBAY_US");
});
