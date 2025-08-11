#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';

const ROOT = process.cwd();

async function optimizePerformance() {
  console.log('⚡ Starting performance optimization...\n');

  // Get all HTML files
  const htmlFiles = [
    path.join(ROOT, 'pages', 'guide', 'beginners.html'),
    path.join(ROOT, 'pages', 'tactics', 'combos.html'),
    path.join(ROOT, 'pages', 'support', 'chromebook.html'),
    path.join(ROOT, 'pages', 'updates', 'changelog.html'),
    path.join(ROOT, 'pages', 'items', 'index.html'),
    path.join(ROOT, 'pages', 'items', 'sword-of-ember.html'),
    path.join(ROOT, 'pages', 'items', 'arcane-talisman.html'),
    path.join(ROOT, 'pages', 'enemies', 'index.html'),
    path.join(ROOT, 'pages', 'enemies', 'goblin-king.html'),
    path.join(ROOT, 'pages', 'legal', 'privacy.html')
  ];

  let totalOptimizations = 0;

  for (const filePath of htmlFiles) {
    if (await fs.pathExists(filePath)) {
      let content = await fs.readFile(filePath, 'utf8');
      let fileOptimizations = 0;

      // 1. Add loading="lazy" to images that don't have it
      if (content.includes('<img') && !content.includes('loading=')) {
        content = content.replace(/<img/g, '<img loading="lazy"');
        fileOptimizations++;
      }

      // 2. Add decoding="async" to images that don't have it
      if (content.includes('<img') && !content.includes('decoding=')) {
        content = content.replace(/<img/g, '<img decoding="async"');
        fileOptimizations++;
      }

      // 3. Add width and height attributes to images for better CLS
      if (content.includes('<img') && !content.includes('width=')) {
        content = content.replace(/<img([^>]*)>/g, '<img$1 width="auto" height="auto">');
        fileOptimizations++;
      }

      // 4. Add preconnect for external resources
      if (content.includes('fonts.googleapis.com') && !content.includes('preconnect')) {
        const preconnectLinks = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`;
        content = content.replace('</head>', `${preconnectLinks}\n  </head>`);
        fileOptimizations++;
      }

      // 5. Add DNS prefetch for CDN resources
      if (content.includes('cdn.tailwindcss.com') && !content.includes('dns-prefetch')) {
        const dnsPrefetch = `
    <link rel="dns-prefetch" href="//cdn.tailwindcss.com">`;
        content = content.replace('</head>', `${dnsPrefetch}\n  </head>`);
        fileOptimizations++;
      }

      if (fileOptimizations > 0) {
        await fs.writeFile(filePath, content, 'utf8');
        console.log(`✅ Optimized ${fileOptimizations} aspects in ${path.relative(ROOT, filePath)}`);
        totalOptimizations += fileOptimizations;
      } else {
        console.log(`ℹ️  No optimizations needed in ${path.relative(ROOT, filePath)}`);
      }
    } else {
      console.log(`⚠️  File not found: ${path.relative(ROOT, filePath)}`);
    }
  }

  // 6. Optimize main index.html
  const mainIndexPath = path.join(ROOT, 'index.html');
  if (await fs.pathExists(mainIndexPath)) {
    let content = await fs.readFile(mainIndexPath, 'utf8');
    let mainOptimizations = 0;

    // Add preload for critical resources
    if (!content.includes('rel="preload"')) {
      const preloadLinks = `
    <link rel="preload" href="/assets/logo.svg" as="image" type="image/svg+xml">
    <link rel="preload" href="/assets/favicon.svg" as="image" type="image/svg+xml">`;
      content = content.replace('</head>', `${preloadLinks}\n  </head>`);
      mainOptimizations++;
    }

    // Add resource hints for external resources
    if (!content.includes('rel="preconnect"')) {
      const resourceHints = `
    <link rel="preconnect" href="https://www.miniplay.com">
    <link rel="dns-prefetch" href="//www.miniplay.com">`;
      content = content.replace('</head>', `${resourceHints}\n  </head>`);
      mainOptimizations++;
    }

    if (mainOptimizations > 0) {
      await fs.writeFile(mainIndexPath, content, 'utf8');
      console.log(`✅ Optimized ${mainOptimizations} aspects in index.html`);
      totalOptimizations += mainOptimizations;
    }
  }

  console.log(`\n🎉 Performance optimization completed! Total optimizations: ${totalOptimizations}`);
  console.log('\n📋 Performance improvements added:');
  console.log('1. Lazy loading for images');
  console.log('2. Async decoding for images');
  console.log('3. Width/height attributes for better CLS');
  console.log('4. Preconnect for external fonts');
  console.log('5. DNS prefetch for CDN resources');
  console.log('6. Preload for critical resources');
  console.log('7. Resource hints for external services');
}

optimizePerformance().catch(err => {
  console.error('❌ Performance optimization failed:', err);
  process.exit(1);
}); 