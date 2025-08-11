#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';

const ROOT = process.cwd();

async function generateSitemap() {
  console.log('🗺️  Generating sitemap...\n');

  const baseUrl = 'https://dungeonraid.online';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const pages = [
    {
      url: '/',
      priority: '1.0',
      changefreq: 'weekly',
      lastmod: currentDate
    },
    {
      url: '/pages/guide/beginners.html',
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: currentDate
    },
    {
      url: '/pages/tactics/combos.html',
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: currentDate
    },
    {
      url: '/pages/support/chromebook.html',
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: currentDate
    },
    {
      url: '/pages/updates/changelog.html',
      priority: '0.5',
      changefreq: 'monthly',
      lastmod: currentDate
    },
    {
      url: '/pages/items/',
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: currentDate
    },
    {
      url: '/pages/items/sword-of-ember.html',
      priority: '0.5',
      changefreq: 'monthly',
      lastmod: currentDate
    },
    {
      url: '/pages/items/arcane-talisman.html',
      priority: '0.5',
      changefreq: 'monthly',
      lastmod: currentDate
    },
    {
      url: '/pages/enemies/',
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: currentDate
    },
    {
      url: '/pages/enemies/goblin-king.html',
      priority: '0.5',
      changefreq: 'monthly',
      lastmod: currentDate
    },
    {
      url: '/pages/legal/privacy.html',
      priority: '0.3',
      changefreq: 'yearly',
      lastmod: currentDate
    }
  ];

  // Check if auto-generated pages exist and add them
  const autoPagesDir = path.join(ROOT, 'pages');
  if (await fs.pathExists(autoPagesDir)) {
    const itemsAutoDir = path.join(autoPagesDir, 'items-auto');
    const enemiesAutoDir = path.join(autoPagesDir, 'enemies-auto');
    
    if (await fs.pathExists(itemsAutoDir)) {
      const itemsFiles = await fs.readdir(itemsAutoDir);
      for (const file of itemsFiles) {
        if (file.endsWith('.html')) {
          pages.push({
            url: `/pages/items-auto/${file}`,
            priority: '0.4',
            changefreq: 'monthly',
            lastmod: currentDate
          });
        }
      }
    }
    
    if (await fs.pathExists(enemiesAutoDir)) {
      const enemiesFiles = await fs.readdir(enemiesAutoDir);
      for (const file of enemiesFiles) {
        if (file.endsWith('.html')) {
          pages.push({
            url: `/pages/enemies-auto/${file}`,
            priority: '0.4',
            changefreq: 'monthly',
            lastmod: currentDate
          });
        }
      }
    }
  }

  // Generate XML sitemap
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const page of pages) {
    sitemapXml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }

  sitemapXml += `
</urlset>`;

  // Write sitemap
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  await fs.writeFile(sitemapPath, sitemapXml, 'utf8');

  console.log(`✅ Sitemap generated with ${pages.length} pages`);
  console.log(`📁 Saved to: ${sitemapPath}`);
  
  // Update URLs file
  const urlsContent = pages.map(page => `${baseUrl}${page.url}`).join('\n');
  const urlsPath = path.join(ROOT, 'urls.txt');
  await fs.writeFile(urlsPath, urlsContent, 'utf8');
  
  console.log(`✅ URLs file updated with ${pages.length} URLs`);
  console.log(`📁 Saved to: ${urlsPath}`);

  // Display summary
  console.log('\n📊 Sitemap Summary:');
  console.log(`- Total pages: ${pages.length}`);
  console.log(`- Main pages: ${pages.filter(p => p.priority >= '0.6').length}`);
  console.log(`- Content pages: ${pages.filter(p => p.priority < '0.6' && p.priority >= '0.4').length}`);
  console.log(`- Legal pages: ${pages.filter(p => p.priority < '0.4').length}`);
  console.log(`- Last updated: ${currentDate}`);
}

generateSitemap().catch(err => {
  console.error('❌ Sitemap generation failed:', err);
  process.exit(1);
}); 