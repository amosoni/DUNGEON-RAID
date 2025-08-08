import fs from 'fs-extra';
import path from 'path';
import slugify from 'slugify';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');

const TEMPLATE = (title, heading, content) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${content.replace(/\"/g, '&quot;').slice(0,160)}" />
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="text-white bg-slate-950">
<div class="container mx-auto px-6 py-10 max-w-3xl">
<h1 class="font-gaming text-3xl">${heading}</h1>
<p class="text-gray-300 mt-4">${content}</p>
</div>
</body>
</html>`;

async function generate(type) {
  const list = await fs.readJson(path.join(DATA_DIR, `${type}.json`)).catch(() => []);
  const outDir = path.join(ROOT, 'pages', `${type}-auto`);
  await fs.emptyDir(outDir);
  for (const row of list) {
    const slug = slugify(row.name, { lower: true, strict: true });
    const html = TEMPLATE(`${row.name} | Dungeon Raid ${type.slice(0, -1)}`, row.name, row.description || '');
    await fs.writeFile(path.join(outDir, `${slug}.html`), html, 'utf8');
  }
  // index
  let links = list.map(r => {
    const slug = slugify(r.name, { lower: true, strict: true });
    return `<li><a class="text-cyan-300" href="./${slug}.html">${r.name}</a></li>`;
  }).join('\n');
  const indexHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${type} Index</title><script src="https://cdn.tailwindcss.com"></script></head><body class="text-white bg-slate-950"><div class="container mx-auto px-6 py-10"><h1 class="font-gaming text-3xl mb-6">${type} Index</h1><ul class="list-disc pl-6">${links}</ul></div></body></html>`;
  await fs.writeFile(path.join(outDir, 'index.html'), indexHtml, 'utf8');
}

async function main() {
  await generate('items');
  await generate('enemies');
  console.log('Pages generated in /pages/items-auto and /pages/enemies-auto');
}

main().catch(err => { console.error(err); process.exit(1); }); 