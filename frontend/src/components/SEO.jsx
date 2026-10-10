import { useEffect } from "react";

// Keep this aligned with the public production URL. Update it when
// vault.thelastcommit.xyz is connected and set as the canonical domain.
const CANONICAL_ORIGIN = "https://vault.thelastcommit.xyz";

function upsertMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

export default function SEO({
  title = "TLC Vault — Save and Access Your Code Online | The Last Commit",
  description = "Save and organize programming code online, compile supported code in your workspace, and track your consistency with TLC Vault by The Last Commit.",
  path = "/",
  noIndex = false,
  structuredData = null,
}) {
  useEffect(() => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const canonicalUrl = `${CANONICAL_ORIGIN}${normalizedPath}`;
    const robots = noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large";

    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", robots);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", "TLC Vault");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("name", "twitter:card", "summary");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertCanonical(canonicalUrl);

    const existingSchema = document.getElementById("tlc-vault-page-schema");
    if (existingSchema) existingSchema.remove();

    if (structuredData && !noIndex) {
      const script = document.createElement("script");
      script.id = "tlc-vault-page-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      const schema = document.getElementById("tlc-vault-page-schema");
      if (schema) schema.remove();
    };
  }, [title, description, path, noIndex, structuredData]);

  return null;
}
