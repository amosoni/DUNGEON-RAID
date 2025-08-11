#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';

const ROOT = process.cwd();

async function validateProject() {
  console.log('🔍 Comprehensive Project Validation...\n');

  const results = {
    seo: { passed: 0, total: 0, issues: [] },
    performance: { passed: 0, total: 0, issues: [] },
    structure: { passed: 0, total: 0, issues: [] },
    content: { passed: 0, total: 0, issues: [] }
  };

  // 1. SEO Validation
  console.log('📊 SEO Validation:');
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
      const content = await fs.readFile(filePath, 'utf8');
      results.seo.total++;

      // Check for essential meta tags
      if (content.includes('<meta name="robots"')) {
        results.seo.passed++;
      } else {
        results.seo.issues.push(`${file}: Missing robots meta tag`);
      }

      if (content.includes('<meta name="description"')) {
        results.seo.passed++;
      } else {
        results.seo.issues.push(`${file}: Missing description meta tag`);
      }

      if (content.includes('canonical')) {
        results.seo.passed++;
      } else {
        results.seo.issues.push(`${file}: Missing canonical URL`);
      }

      if (content.includes('application/ld+json')) {
        results.seo.passed++;
      } else {
        results.seo.issues.push(`${file}: Missing structured data`);
      }
    }
  }

  // 2. Performance Validation
  console.log('⚡ Performance Validation:');
  for (const file of htmlFiles) {
    const filePath = path.join(ROOT, file);
    if (await fs.pathExists(filePath)) {
      const content = await fs.readFile(filePath, 'utf8');
      results.performance.total++;

      if (content.includes('loading="lazy"')) {
        results.performance.passed++;
      } else {
        results.performance.issues.push(`${file}: Missing lazy loading`);
      }

      if (content.includes('decoding="async"')) {
        results.performance.passed++;
      } else {
        results.performance.issues.push(`${file}: Missing async decoding`);
      }

      if (content.includes('preconnect') || content.includes('dns-prefetch')) {
        results.performance.passed++;
      } else {
        results.performance.issues.push(`${file}: Missing resource hints`);
      }
    }
  }

  // 3. Structure Validation
  console.log('🏗️  Structure Validation:');
  const requiredDirs = ['assets', 'pages', 'scripts', 'data'];
  for (const dir of requiredDirs) {
    const dirPath = path.join(ROOT, dir);
    results.structure.total++;
    if (await fs.pathExists(dirPath)) {
      results.structure.passed++;
    } else {
      results.structure.issues.push(`Missing directory: ${dir}`);
    }
  }

  const requiredFiles = ['sitemap.xml', 'robots.txt', 'package.json'];
  for (const file of requiredFiles) {
    const filePath = path.join(ROOT, file);
    results.structure.total++;
    if (await fs.pathExists(filePath)) {
      results.structure.passed++;
    } else {
      results.structure.issues.push(`Missing file: ${file}`);
    }
  }

  // 4. Content Validation
  console.log('📝 Content Validation:');
  for (const file of htmlFiles) {
    const filePath = path.join(ROOT, file);
    if (await fs.pathExists(filePath)) {
      const content = await fs.readFile(filePath, 'utf8');
      results.content.total++;

      if (content.length > 2000) {
        results.content.passed++;
      } else {
        results.content.issues.push(`${file}: Content too short (${content.length} chars)`);
      }

      if (content.includes('<h1>') && content.includes('<h2>')) {
        results.content.passed++;
      } else {
        results.content.issues.push(`${file}: Missing proper heading structure`);
      }

      if (content.includes('<nav>') || content.includes('navigation')) {
        results.content.passed++;
      } else {
        results.content.issues.push(`${file}: Missing navigation`);
      }
    }
  }

  // Display Results
  console.log('\n📊 Validation Results:\n');

  const categories = [
    { name: 'SEO', data: results.seo },
    { name: 'Performance', data: results.performance },
    { name: 'Structure', data: results.structure },
    { name: 'Content', data: results.content }
  ];

  for (const category of categories) {
    const percentage = Math.round((category.data.passed / category.data.total) * 100);
    const status = percentage >= 90 ? '🟢' : percentage >= 70 ? '🟡' : '🔴';
    
    console.log(`${status} ${category.name}: ${category.data.passed}/${category.data.total} (${percentage}%)`);
    
    if (category.data.issues.length > 0) {
      console.log(`   Issues:`);
      category.data.issues.forEach(issue => console.log(`   - ${issue}`));
    }
    console.log('');
  }

  // Overall Score
  const totalPassed = Object.values(results).reduce((sum, cat) => sum + cat.passed, 0);
  const totalTests = Object.values(results).reduce((sum, cat) => sum + cat.total, 0);
  const overallScore = Math.round((totalPassed / totalTests) * 100);

  console.log(`🎯 Overall Score: ${totalPassed}/${totalTests} (${overallScore}%)`);

  if (overallScore >= 90) {
    console.log('🎉 Project is in EXCELLENT condition!');
  } else if (overallScore >= 70) {
    console.log('✅ Project is in GOOD condition with room for improvement');
  } else {
    console.log('⚠️  Project needs attention to reach optimal condition');
  }

  // Recommendations
  if (overallScore < 100) {
    console.log('\n📋 Recommendations:');
    Object.values(results).forEach(category => {
      if (category.issues.length > 0) {
        category.issues.forEach(issue => {
          console.log(`- Fix: ${issue}`);
        });
      }
    });
  }

  return { results, overallScore };
}

validateProject().catch(err => {
  console.error('❌ Project validation failed:', err);
  process.exit(1);
}); 