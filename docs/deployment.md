# Deploy to Cloudflare Workers

The canonical public website is **https://eikrose.de**. This repository uses **Workers Static Assets**: Cloudflare builds the React/Vite site from GitHub and serves `dist/`. `wrangler.jsonc` configures the asset directory and custom 404. No custom Worker script, server process, or application secrets are required.

## 1. Create the Workers application

1. Sign in at [Cloudflare](https://dash.cloudflare.com/) using the account containing the `eikrose.de` zone.
2. Open **Workers & Pages → Create application → Continue with GitHub**.
3. Connect GitHub and authorize access to **Pizzateik/personal-portfolio**. Selecting only this repository is sufficient.
4. Select that repository and begin setup.
5. Use these build settings:

| Setting | Value |
| --- | --- |
| Project name | `personal-portfolio` (must match `name` in `wrangler.jsonc`) |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Preview command | `npx wrangler preview` |
| Enable Preview builds | On, if you want previews for other branches |
| Protect with Cloudflare Access | Off for the public portfolio |
| Root directory | Leave blank; use the repository root |
| Environment variables | None required |

Cloudflare installs npm dependencies from the committed package files. `.node-version` selects Node **24.19.0**, the version used for the verified local build. Wrangler is pinned as a development dependency, so `npx wrangler` uses the same tested version locally and in Workers Builds. Keep development dependencies enabled: TypeScript, Vite, and Wrangler are needed during the build/deploy. Image variants are already committed; do not add `npm run images` to the hosting build. The asset output directory is defined in `wrangler.jsonc`, so there is no separate dashboard output-directory field.

Select **Deploy**. Open the actual `*.workers.dev` URL shown after deployment and check the homepage and `/this-page-does-not-exist`. The latter should display the custom 404 with HTTP status 404. The application name must match `personal-portfolio` in `wrangler.jsonc`; if you choose a different name, update the configuration to match before deploying. For an existing Worker, the repository connection and commands are under **Settings → Build**.

## 2. Connect eikrose.de

Public DNS checked on 2 October 2026 already uses Cloudflare nameservers (`graham.ns.cloudflare.com` and `blair.ns.cloudflare.com`). If the zone is active in your account, no registrar/nameserver change is needed. Create the Worker in the account that owns the zone.

1. Open the Worker → **Settings → Domains & Routes → Add → Custom Domain**.
2. Enter **eikrose.de** and choose **Add Custom Domain**.
3. Cloudflare creates the Worker DNS record and certificate. If an existing website CNAME blocks creation, remove only that conflicting record for the requested hostname and retry. If the hostname is attached to a Pages project, detach it there before moving it. Leave email MX/TXT and unrelated subdomains unchanged.
4. Wait until the custom domain shows **Active**, including its HTTPS certificate.
5. Repeat **Add → Custom Domain** for **www.eikrose.de** and wait for **Active**.

Use Workers **Custom Domains**, rather than a CNAME pointing to `workers.dev` or a wildcard Worker Route. Cloudflare manages the DNS and certificates. Domains are intentionally attached in the dashboard, so the first Git deployment does not replace existing domain mappings automatically.

## 3. Redirect www and HTTP to the canonical URL

In the **eikrose.de zone**, open **Rules → Redirect Rules → Create rule → Single Redirect**. Use the custom filter/expression option.

Name: **Canonical portfolio domain**

Matching expression:

```text
(http.host eq "www.eikrose.de") or (http.host eq "eikrose.de" and http.request.scheme eq "http")
```

For the URL redirect, choose **Dynamic** and enter:

```text
concat("https://eikrose.de", http.request.uri.path)
```

Set **301**, enable **Preserve query string**, and deploy. Place it ahead of conflicting redirect rules. Both website DNS records must remain proxied for the zone rule to run.

Examples:

- `https://www.eikrose.de/` → `https://eikrose.de/`
- `http://eikrose.de/` → `https://eikrose.de/`
- `http://www.eikrose.de/something?from=link` → `https://eikrose.de/something?from=link`

These domain-level redirects are managed in the zone dashboard. No Cloudflare credentials or account IDs are stored in the repository.

## 4. Check the deployment

- `https://eikrose.de/`: homepage, favicon, portrait, EN/DE/FR switching, desktop scrolling, and Sometime hover/dialog work.
- `https://eikrose.de/og-image.webp`: social preview displays.
- `https://eikrose.de/robots.txt` and `/sitemap.xml`: resolve and reference the canonical domain.
- `https://eikrose.de/this-page-does-not-exist`: localized custom 404; home button works; response status is 404.
- HTTP apex and HTTP/HTTPS `www` URLs: return 301 to HTTPS apex with the path/query preserved.

For a quick response check in PowerShell:

```powershell
curl.exe -I https://eikrose.de/
curl.exe -I https://eikrose.de/this-page-does-not-exist
curl.exe -I "http://www.eikrose.de/something?from=link"
```

Future pushes to `main` automatically build and deploy through Workers Builds. Use the Worker's build/deployment history to inspect failed logs or roll back a deployment. Nameserver changes are unnecessary for ordinary updates.

## Local validation and optional CLI deployment

```sh
npm ci
npm run check:deploy
npm run preview:worker
```

`check:deploy` builds and validates deployment configuration without publishing. `preview:worker` serves the production assets with the local Workers runtime, including Cloudflare header and 404 handling, normally at `http://localhost:8787`. Ordinary source development still uses `npm run dev`.

If deploying manually instead of through the connected Git integration, authenticate with `npx wrangler login`, then run `npm run deploy`. Cloudflare credentials remain outside the repository. Do not run the manual deploy command merely to preview the site.

## Hosting behavior included in the repository

The build writes pre-rendered, localized `index.html` and `404.html` with inline styles. Text and skeletons appear before the React bundle arrives; desktop scrolling works during loading. English is the no-JavaScript default. Workers is configured with `assets.not_found_handling: "404-page"`, serving `404.html` with status 404 for unknown paths. Do not switch to an SPA fallback that returns the homepage with status 200.

Vite copies `public/_headers` into `dist/`. Hashed JS/CSS in `/assets/` receive long-lived immutable browser caching. Other files retain the static asset service's default ETag/revalidation behavior, so changes to HTML or unversioned photos, fonts, and favicons do not wait behind a year-long browser cache. The `workers.dev` production and preview hostnames receive `X-Robots-Tag: noindex`; the custom domain remains indexable. The canonical link, metadata, robots file, and sitemap consistently use `https://eikrose.de`.

Deploy only `dist/`: original image sources, diagnostics, dependencies, and local paths are excluded from the site output. No extra cache rule or HTML minification setting is necessary. Leave Rocket Loader disabled so the parser-time scrolling and language scripts keep their intended ordering. If a Content Security Policy is added later, account for the existing inline styles and scripts.

Official references: [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/), [build settings](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), [build versions](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/), [custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [headers](https://developers.cloudflare.com/workers/static-assets/headers/), [404 behavior](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/), [Single Redirects](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/).
