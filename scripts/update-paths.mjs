#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';

const ROOT = process.cwd();

async function updatePaths() {
  console.log('🔄 Updating file paths in HTML files...\n');

  // Define path mappings (old -> new)
  const pathMappings = [
    ['/Dungeon Raid2.jpg', '/assets/dungeon-raid2.jpg'],
    ['/Dungeon Raid2.webm', '/assets/dungeon-raid2.webm'],
    ['/og-image.jpg', '/assets/og-image.jpg']
  ];

  // Get all HTML files
  const htmlFiles = [
    path.join(ROOT, 'index.html'),
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

  let totalUpdates = 0;

  for (const filePath of htmlFiles) {
    if (await fs.pathExists(filePath)) {
      let content = await fs.readFile(filePath, 'utf8');
      let fileUpdates = 0;

      // Apply path mappings
      for (const [oldPath, newPath] of pathMappings) {
        if (content.includes(oldPath)) {
          content = content.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
          fileUpdates++;
        }
      }

      if (fileUpdates > 0) {
        await fs.writeFile(filePath, content, 'utf8');
        console.log(`✅ Updated ${fileUpdates} paths in ${path.relative(ROOT, filePath)}`);
        totalUpdates += fileUpdates;
      } else {
        console.log(`ℹ️  No updates needed in ${path.relative(ROOT, filePath)}`);
      }
    } else {
      console.log(`⚠️  File not found: ${path.relative(ROOT, filePath)}`);
    }
  }

  console.log(`\n🎉 Path updates completed! Total updates: ${totalUpdates}`);
  console.log('\n📋 Next steps:');
  console.log('1. Verify all images and videos load correctly');
  console.log('2. Test social media previews');
  console.log('3. Check that all internal links work');
}

updatePaths().catch(err => {
  console.error('❌ Path update failed:', err);
  process.exit(1);
}); 