#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';

const ROOT = process.cwd();

async function checkStatus() {
  console.log('🔍 Checking project status...\n');

  const issues = [];
  const warnings = [];
  const successes = [];

  // 1. Check if og-image.jpg exists
  const ogImagePath = path.join(ROOT, 'assets', 'og-image.jpg');
  if (await fs.pathExists(ogImagePath)) {
    successes.push('✅ og-image.jpg exists');
  } else {
    const ogImageTxt = path.join(ROOT, 'assets', 'og-image.txt');
    if (await fs.pathExists(ogImageTxt)) {
      warnings.push('⚠️  og-image.txt placeholder exists (needs to be replaced with actual image)');
    } else {
      issues.push('❌ og-image.jpg missing (social media previews won\'t work)');
    }
  }

  // 2. Check media files in assets directory
  const assetsDir = path.join(ROOT, 'assets');
  const expectedMediaFiles = [
    'dungeon-raid.jpg',
    'dungeon-raid2.jpg',
    'dungeon-raid3.jpg',
    'dungeon-raid4.jpg',
    'dungeon-raid6.jpg',
    'dungeon-raid.webm',
    'dungeon-raid1.webm',
    'dungeon-raid2.webm'
  ];

  for (const file of expectedMediaFiles) {
    const filePath = path.join(assetsDir, file);
    if (await fs.pathExists(filePath)) {
      successes.push(`✅ ${file} in assets directory`);
    } else {
      warnings.push(`⚠️  ${file} not found in assets directory`);
    }
  }

  // 3. Check if media files still exist in root (should not)
  const rootMediaFiles = [
    'Dungeon Raid.jpg',
    'Dungeon Raid2.jpg',
    'Dungeon Raid3.jpg',
    'Dungeon Raid4.jpg',
    'Dungeon Raid6.jpg',
    'Dungeon Raid.webm',
    'Dungeon Raid1.webm',
    'Dungeon Raid2.webm'
  ];

  for (const file of rootMediaFiles) {
    const filePath = path.join(ROOT, file);
    if (await fs.pathExists(filePath)) {
      issues.push(`❌ ${file} still exists in root directory (should be moved to assets/)`);
    }
  }

  // 4. Check data directory for scripts
  const dataDir = path.join(ROOT, 'data');
  if (await fs.pathExists(dataDir)) {
    const dataFiles = await fs.readdir(dataDir);
    if (dataFiles.length > 0) {
      successes.push(`✅ Data directory exists with ${dataFiles.length} files`);
    } else {
      warnings.push('⚠️  Data directory exists but is empty');
    }
  } else {
    issues.push('❌ Data directory missing (scripts may not work)');
  }

  // 5. Check URL files
  const urlFiles = ['urls.txt', 'links.txt', 'full.txt'];
  for (const file of urlFiles) {
    const filePath = path.join(ROOT, file);
    if (await fs.pathExists(filePath)) {
      if (file === 'urls.txt') {
        successes.push('✅ urls.txt exists (maintained)');
      } else {
        warnings.push(`⚠️  ${file} still exists (should be removed)`);
      }
    }
  }

  // 6. Check HTML files for broken references
  const htmlFiles = [
    'index.html',
    'pages/guide/beginners.html',
    'pages/tactics/combos.html',
    'pages/support/chromebook.html',
    'pages/updates/changelog.html',
    'pages/items/index.html',
    'pages/items/sword-of-ember.html',
    'pages/items/arcane-talisman.html',
    'pages/enemies/index.html',
    'pages/enemies/goblin-king.html',
    'pages/legal/privacy.html'
  ];

  for (const file of htmlFiles) {
    const filePath = path.join(ROOT, file);
    if (await fs.pathExists(filePath)) {
      successes.push(`✅ ${file} exists`);
    } else {
      issues.push(`❌ ${file} missing`);
    }
  }

  // 7. Check sitemap and robots
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  const robotsPath = path.join(ROOT, 'robots.txt');
  
  if (await fs.pathExists(sitemapPath)) {
    successes.push('✅ sitemap.xml exists');
  } else {
    issues.push('❌ sitemap.xml missing');
  }

  if (await fs.pathExists(robotsPath)) {
    successes.push('✅ robots.txt exists');
  } else {
    issues.push('❌ robots.txt missing');
  }

  // Display results
  console.log('📊 Project Status Summary:\n');
  
  if (successes.length > 0) {
    console.log('✅ Successes:');
    successes.forEach(s => console.log(`  ${s}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('⚠️  Warnings:');
    warnings.forEach(w => console.log(`  ${w}`));
    console.log('');
  }

  if (issues.length > 0) {
    console.log('❌ Issues:');
    issues.forEach(i => console.log(`  ${i}`));
    console.log('');
  }

  // Overall status
  if (issues.length === 0 && warnings.length === 0) {
    console.log('🎉 Project is in excellent condition!');
  } else if (issues.length === 0) {
    console.log('✅ Project is in good condition with minor warnings');
  } else {
    console.log('⚠️  Project has issues that need attention');
  }

  // Recommendations
  if (issues.length > 0 || warnings.length > 0) {
    console.log('\n📋 Recommendations:');
    if (issues.length > 0) {
      console.log('1. Fix critical issues first');
    }
    if (warnings.length > 0) {
      console.log('2. Address warnings to improve project quality');
    }
    console.log('3. Run: npm run cleanup');
    console.log('4. Run: npm run update-paths');
    console.log('5. Test all functionality');
  }
}

checkStatus().catch(err => {
  console.error('❌ Status check failed:', err);
  process.exit(1);
}); 