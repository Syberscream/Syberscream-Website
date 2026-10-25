# SyberScream — Technical Services

The website for SyberScream (syberscream.com): computer repair, virus and spyware removal, networks, cabling, cameras and POS systems. Based in Terrace, BC.

Moved off the old WordPress host (webhostinghub, which forwarded syberscream.com to vital2tech.com) and rebuilt as a plain static site in the same look as woextractor.com.

## Files

- `index.html` — the whole site: stats, services, why us and the current special, client rotator, WO Extractor, contact and map
- `admin.html` — password-protected page for editing the client rotator (syberscream.com/admin)
- `css/site.css` — styles (navy, yellow and blue; Bricolage Grotesque, Geist and Geist Mono fonts from Google Fonts)
- `src/worker.js` — small Cloudflare Worker: serves the site and the `/api/clients` endpoints the rotator and admin page use
- `404.html` — page-not-found page
- `favicon.svg` — the SS stamp icon
- `robots.txt`, `sitemap.xml` — for search engines (the admin page is excluded)
- `wrangler.jsonc` — Cloudflare settings: the site files, the worker, and the `SITE_KV` storage
- `.assetsignore` — repo-only files kept off the public site (README, config, worker source)
- `CNAME` — not used by Cloudflare; kept in case the site ever moves to GitHub Pages

No build step. Edit and push to `main`; Cloudflare redeploys in about a minute.

## Client rotator and admin page

- The homepage strip loads its list from `GET /api/clients`. If that fails, it shows the list written into `index.html`.
- `syberscream.com/admin` edits the heading, speed, direction, pause-on-hover, and each client's name, logo, optional link, order and visibility. Saving goes live immediately.
- Logos are shrunk in the browser to fit 300×100 and saved with the list (PNG, JPEG or WebP, up to about 200 KB each; up to 80 clients).
- The admin password is the `ADMIN_PASSWORD` secret on the Worker (Workers & Pages → syberscream-website → Settings → Variables and Secrets). Change it there at any time.
- The list is stored in Workers KV under the key `clients`, in the namespace bound as `SITE_KV`. Cloudflare created that namespace on the first deploy.

API (admin calls send `Authorization: Bearer <password>`):

| Method | Path | Who | Does |
|---|---|---|---|
| GET | `/api/clients` | public | rotator settings and client list |
| POST | `/api/login` | admin | checks the password |
| PUT | `/api/clients` | admin | saves settings and list (validated) |

## Hosting

- **Site**: Cloudflare Workers project `syberscream-website` (Compute → Workers & Pages), connected to this repo's `main` branch. Deploy command `npx wrangler deploy`, no build command.
- **Domains**: `syberscream.com` and `www.syberscream.com` are custom domains on that project.
- **Preview**: `syberscream-website.syberscream.workers.dev`
- **DNS**: Cloudflare (nameservers `craig.ns.cloudflare.com`, `sharon.ns.cloudflare.com`), set at the registrar, Penguin Web Hosting.
- **Email**: Google Workspace. Keep the MX, SPF, DMARC and google-site-verification records in Cloudflare DNS.

## Local testing

```
echo "ADMIN_PASSWORD=pick-a-test-password" > .dev.vars
npx wrangler dev
```

Then open http://localhost:8787 and http://localhost:8787/admin. Don't commit `.dev.vars`.

## Contact details on the site

- Phone: 1 (250) 615-3203
- Location: Terrace, BC, Canada
- Hours: Monday–Saturday, 8:00 am – 10:00 pm

## Copyright

© 2026 SyberScream. All rights reserved.

This repository is not open source. No licence is granted to copy, modify or distribute the code, design or text without written permission from SyberScream.

Client names are listed as past clients only; their names and trademarks belong to their owners. Fonts: Geist and Bricolage Grotesque (SIL OFL 1.1).
