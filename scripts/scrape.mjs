import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs-extra';
import path from 'path';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'scripts', 'sources.json');
const OUT_DIR = path.join(ROOT, 'data');

async function fetchHTML(url) {
  const res = await axios.get(url, { timeout: 20000, headers: { 'User-Agent': 'DungeonRaidBot/1.0' } });
  return res.data;
}

async function scrapeList(source) {
  const html = await fetchHTML(source.url);
  const $ = cheerio.load(html);
  const rows = [];
  $(source.selector.row).each((_, el) => {
    const name = $(el).find(source.selector.name).text().trim();
    const desc = $(el).find(source.selector.desc).text().trim();
    if (name) rows.push({ name, description: desc });
  });
  return rows;
}

async function main() {
  await fs.ensureDir(OUT_DIR);
  const config = await fs.readJson(CONFIG_PATH);
  const out = { items: [], enemies: [] };

  for (const src of config.items || []) {
    try {
      const data = await scrapeList(src);
      out.items.push(...data);
    } catch (e) {
      console.error('Item source failed:', src.url, e.message);
    }
  }
  for (const src of config.enemies || []) {
    try {
      const data = await scrapeList(src);
      out.enemies.push(...data);
    } catch (e) {
      console.error('Enemy source failed:', src.url, e.message);
    }
  }

  await fs.writeJson(path.join(OUT_DIR, 'items.json'), out.items, { spaces: 2 });
  await fs.writeJson(path.join(OUT_DIR, 'enemies.json'), out.enemies, { spaces: 2 });
  console.log(`Scraped: items=${out.items.length}, enemies=${out.enemies.length}`);
}

main().catch(err => { console.error(err); process.exit(1); }); 