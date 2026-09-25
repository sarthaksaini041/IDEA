import assert from "node:assert/strict";
import { test } from "node:test";
import { redactUrl } from "../lib/redact";

test("private pages lose their whole query string", () => {
  assert.equal(redactUrl("https://x.online/verify?email=a%40b.com&next=%2Falerts"), "https://x.online/verify");
  assert.equal(redactUrl("https://x.online/alerts/unsubscribe?token=secret123"), "https://x.online/alerts/unsubscribe");
  assert.equal(redactUrl("https://x.online/login?next=/account#top"), "https://x.online/login");
});

test("secrets and emails are removed elsewhere, useful filters kept", () => {
  assert.equal(redactUrl("https://x.online/?media=hevc10&brand=HP"), "https://x.online/?media=hevc10&brand=HP");
  assert.equal(redactUrl("https://x.online/alerts?model=m720q&email=a@b.com"), "https://x.online/alerts?model=m720q");
  assert.equal(redactUrl("https://x.online/compare?m=a,b&ref=me@mail.com"), "https://x.online/compare?m=a%2Cb");
  assert.equal(redactUrl("https://x.online/signup?_vercel_share=abc"), "https://x.online/signup");
});

test("unparseable input never leaks a query", () => {
  assert.equal(redactUrl("/verify?email=a@b.com"), "/verify");
});
