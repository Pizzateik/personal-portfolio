# Deploy to Cloudflare Pages

The canonical public website is **https://eikrose.de**. This repository is a static React/Vite site: Cloudflare builds it from GitHub and serves `dist/`. No Worker, server process, API key, or application environment variables are required.

## 1. Create the Pages project

1. Sign in at [Cloudflare](https://dash.cloudflare.com/) using the account containing the `eikrose.de` zone.
2. Open **Workers & Pages → Create application → Pages → Connect to Git**.
3. Connect GitHub and authorize access to **Pizzateik/personal-portfolio**. Selecting only this repository is sufficient.
4. Select that repository and begin setup.
5. Use these build settings:

| Setting | Value |
| --- | --- |
| Project name | `personal-portfolio` (or another available name) |
| Production branch | `main` |
| Framework preset | React (Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Leave blank; use the repository root |
| Environment variables | None required |

Cloudflare installs npm dependencies from the committed package files. `.node-version` selects Node **24.19.0**, the version used for the verified local build. Keep development dependencies enabled: TypeScript and Vite are needed during the build. Image variants are already committed; do not add `npm run images` to the hosting build.

Select **Save and Deploy**. Open the actual `*.pages.dev` URL shown after deployment and check the homepage and `/this-page-does-not-exist`. The latter should display the custom 404 with HTTP status 404. Cloudflare creates a hostname based on the available project name; use the actual one from the dashboard wherever a Pages target is requested.

## 2. Connect eikrose.de

Public DNS checked on 2 October 2026 already uses Cloudflare nameservers (`graham.ns.cloudflare.com` and `blair.ns.cloudflare.com`). If the zone is active in your account, no registrar/nameserver change is needed. If using a different Cloudflare account, create the Pages project in the account that owns the zone.

1. Open the Pages project → **Custom domains → Set up a custom domain**.
2. Enter **eikrose.de** and continue.
3. Confirm the DNS change requested by Cloudflare. Its apex CNAME should point to your project's actual `*.pages.dev` hostname. Replace conflicting old website A/AAAA/CNAME records for `@` when prompted; leave email MX/TXT and unrelated subdomains unchanged.
4. Wait until the custom domain shows **Active**, including its HTTPS certificate.
5. Repeat **Set up a custom domain** for **www.eikrose.de**. Confirm its CNAME points to the same Pages hostname, with Cloudflare proxying enabled, and wait for **Active**.

Add both domains through the Pages dashboard, rather than only creating DNS records. The dashboard associates the hostnames with the site and provisions certificates.

## 3. Redirect www and HTTP to the canonical URL

In the **eikrose.de zone** (not the Pages project), open **Rules → Redirect Rules → Create rule → Single Redirect**. Use the custom filter/expression option.

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

These dashboard changes cannot be encoded as domain-level redirects in Pages' `_redirects` file. No Cloudflare credentials or account configuration are stored in the repository.

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

Future pushes to `main` automatically build and deploy through the Git integration. Use the Pages deployment history to inspect failed build logs or roll back a deployment. Nameserver changes are unnecessary for ordinary updates.

## Hosting behavior included in the repository

The build writes pre-rendered, localized `index.html` and `404.html` with inline styles. Text and skeletons appear before the React bundle arrives; desktop scrolling works during loading. English is the no-JavaScript default. Cloudflare Pages automatically uses the top-level `404.html` for unknown paths. Do not add a catch-all 200 rewrite to the homepage.

Vite copies `public/_headers` into `dist/`. Hashed JS/CSS in `/assets/` receive long-lived immutable browser caching. Other files retain Pages' default ETag/revalidation behavior, so changes to HTML or unversioned photos, fonts, and favicons do not wait behind a year-long browser cache. The `pages.dev` production and preview hostnames receive `X-Robots-Tag: noindex`; the custom domain remains indexable. The canonical link, metadata, robots file, and sitemap consistently use `https://eikrose.de`.

Deploy only `dist/`: original image sources, diagnostics, dependencies, and local paths are excluded from the site output. No extra cache rule or HTML minification setting is necessary. Leave Rocket Loader disabled so the parser-time scrolling and language scripts keep their intended ordering. If a Content Security Policy is added later, account for the existing inline styles and scripts.

Official references: [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/), [build settings](https://developers.cloudflare.com/pages/configuration/build-configuration/), [build versions](https://developers.cloudflare.com/pages/configuration/build-image/), [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), [headers](https://developers.cloudflare.com/pages/configuration/headers/), [404 behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/), [Single Redirects](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/).
