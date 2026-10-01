# Deployment

The public URL is **https://eikrose.de**. Canonical and social metadata always use this domain.

## Static hosting and 404s

Run `npm run build` and publish **dist/**. Both `index.html` and `404.html` contain pre-rendered content and inline styles, so text appears before the interaction bundle loads. English is the default; a small inline script selects the saved EN / DE / FR copy before hydration. The 404 includes a working home link and `noindex`. Assets use root-relative URLs, including on nested error pages. Inline styles and the small bootstrap script must be allowed if a Content Security Policy is added later.

Vite development and preview servers return the custom page with HTTP 404 for unknown navigation URLs. [Cloudflare Pages automatically uses a top-level 404.html](https://developers.cloudflare.com/pages/configuration/serving-pages/) for missing pages. On another host, set its missing-page document to `/404.html` and retain HTTP status **404**. Do not enable a catch-all 200 rewrite to `index.html`.

## Cloudflare domain redirects — manual setup

This repository has no connected Cloudflare credentials or DNS/redirect configuration. The following changes must be made in the Cloudflare dashboard for **eikrose.de**:

1. Under **DNS → Records**, add/update the `www` record: type **CNAME**, name **www**, target **eikrose.de**, proxy status **Proxied**. Keep the working apex record and hosting custom domain in place. Confirm the edge certificate covers both `eikrose.de` and `www.eikrose.de`.
2. Under **Rules → Redirect Rules**, create a **Single Redirect** named `Canonical portfolio domain`, using a **custom filter expression**:

   ```text
   (http.host eq "www.eikrose.de") or (http.host eq "eikrose.de" and not ssl)
   ```

3. Set the URL redirect to **Dynamic**, with this expression:

   ```text
   concat("https://eikrose.de", http.request.uri.path)
   ```

4. Select status **301** and enable **Preserve query string**, then deploy the rule. Place it before any conflicting redirects. This sends both HTTP and HTTPS `www` requests, and HTTP apex requests, directly to the HTTPS apex while preserving the path and query.

Example: `http://www.eikrose.de/something?from=link` → `https://eikrose.de/something?from=link` (301). If `/something` doesn't exist, the destination then returns the custom 404.

Reference: [Cloudflare's WWW-to-apex example](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/) and [Single Redirect settings](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/settings/). Cloudflare Pages' `_redirects` file cannot implement domain-level redirects; use the zone-level rule above.

After deployment, verify the apex homepage returns 200, an unknown path returns 404, and both HTTP apex and HTTPS `www` return 301 with the expected `Location`. These live domain checks are separate from local build verification.
