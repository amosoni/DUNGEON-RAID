# Dungeon Raid SEO Submission Checklist

Files:
- `sitemap.xml` – submit to Google/Bing/Yandex
- `robots.txt` – allows full crawl, points to sitemap
- `urls.txt` – primary URLs to submit frequently
- `links.txt` – extended URLs (hot pages)
- `full.txt` – all URLs (useful for full submit or testing redirects)

Canonical & Redirects:
- Preferred URL: https://dungeonraid.online/
- 301 rules:
  - http → https
  - www → non-www
  - /index.html → /

Cloudflare Rules (example):
1) http://*dungeonraid.online/* → https://dungeonraid.online/$1 (301)
2) https://www.dungeonraid.online/* → https://dungeonraid.online/$1 (301)
3) https://dungeonraid.online/*index.html → https://dungeonraid.online/$1 (301)

Submit:
- Google Search Console: submit `sitemap.xml` and paste `urls.txt` in URL Inspection (as needed)
- Bing Webmaster Tools: submit `sitemap.xml`

Notes:
- Keep `sitemap.xml` in sync if you add new pages
- Prefer short, descriptive titles (40–60 chars) and descriptions (140–160 chars) 