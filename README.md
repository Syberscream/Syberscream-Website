# SyberScream — Technical Services

The website for SyberScream (syberscream.com): computer repair, virus and spyware removal, networks, cabling, cameras and POS systems. Based in Terrace, BC.

Moved off the old WordPress host (which forwarded syberscream.com to vital2tech.com) and rebuilt as a plain static site in the same look as woextractor.com.

## Files

- `index.html` — the whole site: services, why us, clients, WO Extractor, contact
- `css/site.css` — styles (navy, yellow and blue; Bricolage Grotesque, Geist and Geist Mono fonts from Google Fonts)
- `404.html` — page-not-found page
- `favicon.svg` — the SS stamp icon
- `CNAME` — the custom domain, `syberscream.com`
- `robots.txt`, `sitemap.xml` — for search engines

No build step, no server, no database. Edit the HTML and push.

## Going live (GitHub Pages)

1. Repo **Settings → Pages**: Source = *Deploy from a branch*, Branch = `main`, folder `/ (root)`.
2. Custom domain: `syberscream.com` (already in `CNAME`). Tick **Enforce HTTPS** once the certificate is ready.
3. At the domain registrar, remove the old forwarding to vital2tech.com and set DNS:
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www`: `syberscream.github.io`
4. Leave any `MX` records alone if email runs on the domain.

## Contact details on the site

- Phone: 1 (250) 615-3203
- Location: Terrace, BC, Canada
- Hours: Monday–Saturday, 8:00 am – 10:00 pm

## Copyright

© 2026 SyberScream. All rights reserved.

This repository is not open source. No licence is granted to copy, modify or distribute the code, design or text without written permission from SyberScream.

Client names are listed as past clients only; their names and trademarks belong to their owners. Fonts: Geist and Bricolage Grotesque (SIL OFL 1.1).
