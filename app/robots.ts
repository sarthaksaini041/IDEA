import type { MetadataRoute } from "next";
import { absoluteUrl } from "../lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/alerts/unsubscribe", "/account", "/login", "/signup", "/verify", "/forgot"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
