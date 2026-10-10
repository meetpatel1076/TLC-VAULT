# TLC Vault SEO — Step 1 Patch

This patch is intended to be merged into the existing TLC Vault Vite + React frontend. It is **not** a full replacement for the repository.

## Included changes

- Improved static homepage metadata in `index.html` (title, description, canonical URL, robots, Open Graph, and Twitter card fields).
- Added `features.html` as a second Vite HTML entry so `/features` has its own descriptive metadata in the initial HTML response.
- Added `/features` in `src/App.jsx` and private-route `noindex` metadata for login, registration, email-verification, dashboard, repository, and admin routes.
- Added `src/components/SEO.jsx` for client-side page metadata and JSON-LD.
- Added `src/pages/FeaturesPage.jsx` with code workspace, embedded compiler, streak, badges, weekly statistics, and cross-computer access descriptions.
- Added a link to the Features page from the landing-page navigation, footer, and a landing-page feature overview section.
- Added `public/robots.txt`, `public/sitemap.xml`, and `public/favicon.svg`.
- Updated `vite.config.js` for the two HTML entry points and `vercel.json` to map `/features` to `/features.html` while preserving the SPA fallback.

## Before deployment

1. Merge the files at the matching paths into the existing frontend project. Do not delete your own `public` assets such as `tlc-vault-logo.png` or `public/fonts` if they exist in your local project. The ZIP originally provided for this patch did not contain those assets.
2. The SEO URLs currently use `https://tlc-vault.vercel.app` because the custom domain has not yet been connected to Vercel. After `https://vault.thelastcommit.xyz` is connected and working, update the canonical origin and URLs in `index.html`, `features.html`, `src/components/SEO.jsx`, `src/App.jsx`, `public/sitemap.xml`, and `public/robots.txt` to the custom domain.
3. Run `npm run build` locally. Fix any build errors before deploying.
4. Test `/`, `/features`, `/login`, `/register`, and `/dashboard`. Confirm that Features navigation works and private pages have `noindex` metadata after the app loads.
5. Confirm that `/robots.txt`, `/sitemap.xml`, and `/favicon.svg` are accessible in the deployed site.
6. Submit the sitemap and inspect the public URLs in Google Search Console after the domain is ready.

## SEO caveats

- A sitemap and an indexing request do not guarantee that Google will index a page or rank it for a specific search within 2–3 days.
- `robots.txt` is not an access-control system. Authentication and backend authorization must continue protecting private user data.
- The compiler is embedded through OneCompiler. Code sent to the embedded service is shared with that service for execution; the page communicates this limitation.
- The new Features page only describes functionality stated to exist in the product. Confirm the final copy matches the live app before publishing.
