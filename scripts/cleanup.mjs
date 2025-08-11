#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';

const ROOT = process.cwd();

async function cleanup() {
  console.log('🧹 Starting project cleanup...\n');

  // 1. Create assets directory if it doesn't exist
  const assetsDir = path.join(ROOT, 'assets');
  await fs.ensureDir(assetsDir);
  console.log('✅ Assets directory ready');

  // 2. Move media files to assets directory
  const mediaFiles = [
    'Dungeon Raid.jpg',
    'Dungeon Raid2.jpg', 
    'Dungeon Raid3.jpg',
    'Dungeon Raid4.jpg',
    'Dungeon Raid6.jpg',
    'Dungeon Raid.webm',
    'Dungeon Raid1.webm',
    'Dungeon Raid2.webm'
  ];

  for (const file of mediaFiles) {
    const sourcePath = path.join(ROOT, file);
    const destPath = path.join(assetsDir, file.replace(/\s+/g, '-').toLowerCase());
    
    if (await fs.pathExists(sourcePath)) {
      await fs.move(sourcePath, destPath);
      console.log(`📁 Moved: ${file} → assets/${path.basename(destPath)}`);
    } else {
      console.log(`⚠️  File not found: ${file}`);
    }
  }

  // 3. Create data directory for scripts
  const dataDir = path.join(ROOT, 'data');
  await fs.ensureDir(dataDir);
  console.log('✅ Data directory created for scripts');

  // 4. Create sample data files
  const sampleData = {
    items: [
      {
        name: "Sword of Ember",
        description: "A legendary fire-enchanted weapon that deals increased fire damage and applies burn effects."
      },
      {
        name: "Arcane Talisman", 
        description: "An ancient artifact that channels pure magical energy, enhancing spell power and mana regeneration."
      }
    ],
    enemies: [
      {
        name: "Goblin King",
        description: "Elite boss of the goblin hordes with powerful abilities including War Cry, Cleave, and Shield Bash."
      }
    ]
  };

  await fs.writeJson(path.join(dataDir, 'items.json'), sampleData.items, { spaces: 2 });
  await fs.writeJson(path.join(dataDir, 'enemies.json'), sampleData.enemies, { spaces: 2 });
  console.log('✅ Sample data files created');

  // 5. Consolidate URL files
  const allUrls = [
    'https://dungeonraid.online/',
    'https://dungeonraid.online/pages/guide/beginners.html',
    'https://dungeonraid.online/pages/tactics/combos.html',
    'https://dungeonraid.online/pages/support/chromebook.html',
    'https://dungeonraid.online/pages/updates/changelog.html',
    'https://dungeonraid.online/pages/items/',
    'https://dungeonraid.online/pages/items/sword-of-ember.html',
    'https://dungeonraid.online/pages/items/arcane-talisman.html',
    'https://dungeonraid.online/pages/enemies/',
    'https://dungeonraid.online/pages/enemies/goblin-king.html',
    'https://dungeonraid.online/pages/legal/privacy.html'
  ];

  await fs.writeFile(path.join(ROOT, 'urls.txt'), allUrls.join('\n'), 'utf8');
  console.log('✅ URLs consolidated into urls.txt');

  // 6. Remove redundant files
  const filesToRemove = ['links.txt', 'full.txt'];
  for (const file of filesToRemove) {
    const filePath = path.join(ROOT, file);
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      console.log(`🗑️  Removed: ${file}`);
    }
  }

  // 7. Create a proper og-image placeholder
  const ogImagePath = path.join(assetsDir, 'og-image.jpg');
  if (!await fs.pathExists(ogImagePath)) {
    // Create a text file as placeholder
    await fs.writeFile(ogImagePath.replace('.jpg', '.txt'), 
      'This is a placeholder for og-image.jpg\nCreate a 1200x630px image for social media sharing', 
      'utf8');
    console.log('⚠️  Created og-image.txt placeholder (needs to be replaced with actual image)');
  }

  console.log('\n🎉 Cleanup completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Replace og-image.txt with actual og-image.jpg (1200x630px)');
  console.log('2. Update HTML files to use new asset paths');
  console.log('3. Test all links work correctly');
  console.log('4. Run npm run build to test scripts');
}

cleanup().catch(err => {
  console.error('❌ Cleanup failed:', err);
  process.exit(1);
}); 