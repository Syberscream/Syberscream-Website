# SyberScream — Technical Services

The website for SyberScream (syberscream.com): computer repair, virus and spyware removal, networks, cabling, cameras and POS systems. Based in Terrace, BC.

Moved off the old WordPress host (webhostinghub, which forwarded syberscream.com to vital2tech.com) and rebuilt as a plain static site in the same look as woextractor.com.

## Files

- `index.html` — the whole site: services, why us, clients, WO Extractor, contact
- `css/site.css` — styles (navy, yellow and blue; Bricolage Grotesque, Geist and Geist Mono fonts from Google Fonts)
- `404.html` — page-not-found page
- `favicon.svg` — the SS stamp icon
- `robots.txt`, `sitemap.xml` — for search engines
- `wrangler.jsonc` — Cloudflare settings: serve this folder as the site, use `404.html` for missing pages
- `.assetsignore` — repo-only files kept off the public site (README, config)
- `CNAME` — not used by Cloudflare; kept in case the site ever moves to GitHub Pages

No build step, no server, no database. Edit the HTML and push to `main`; Cloudflare redeploys in about a minute.

## Hosting

- **Site**: Cloudflare Workers project `syberscream-website` (Compute → Workers & Pages), connected to this repo's `main` branch. Deploy command `npx wrangler deploy`, no build command.
- **Domains**: `syberscream.com` and `www.syberscream.com` are custom domains on that project.
- **Preview**: `syberscream-website.syberscream.workers.dev`
- **DNS**: Cloudflare (nameservers `craig.ns.cloudflare.com`, `sharon.ns.cloudflare.com`), set at the registrar, Penguin Web Hosting.
- **Email**: Google Workspace. Keep the MX, SPF, DMARC and google-site-verification records in Cloudflare DNS.

## Contact details on the site

- Phone: 1 (250) 615-3203
- Location: Terrace, BC, Canada
- Hours: Monday–Saturday, 8:00 am – 10:00 pm

## Copyright

© 2026 SyberScream. All rights reserved.

This repository is not open source. No licence is granted to copy, modify or distribute the code, design or text without written permission from SyberScream.

Client names are listed as past clients only; their names and trademarks belong to their owners. Fonts: Geist and Bricolage Grotesque (SIL OFL 1.1).
