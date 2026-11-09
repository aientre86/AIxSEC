#!/usr/bin/env node
/**
 * AI & AI Security Knowledge Hub - Article Scaffolding CLI (Node.js)
 * =================================================================
 * Quickly create markdown articles conforming to the site schema
 * and directory hierarchy.
 *
 * Usage:
 *   node scripts/add_article.mjs --path security-for-ai/threats-defenses --title "Model Inversion Defense"
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(PROJECT_ROOT, 'src', 'content', 'docs');

function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'article';
}

function parseArgs(args) {
  const result = {
    path: '',
    title: '',
    tags: [],
    description: '',
    threatLevel: null,
    order: null,
    draft: false,
    force: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--path' && args[i + 1]) result.path = args[++i];
    else if (arg === '--title' && args[i + 1]) result.title = args[++i];
    else if (arg === '--tags' && args[i + 1]) {
      result.tags = args[++i].split(/[,;]/).map((t) => t.trim()).filter(Boolean);
    } else if (arg === '--description' && args[i + 1]) result.description = args[++i];
    else if (arg === '--threat-level' && args[i + 1]) result.threatLevel = args[++i];
    else if (arg === '--order' && args[i + 1]) result.order = Number(args[++i]);
    else if (arg === '--draft') result.draft = true;
    else if (arg === '--force') result.force = true;
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));

if (!args.path || !args.title) {
  console.error('Usage: node scripts/add_article.mjs --path <subfolder> --title "<Article Title>" [--tags tag1,tag2] [--threat-level Low|Medium|High|Critical] [--order N]');
  console.error('Example: node scripts/add_article.mjs --path ai-for-security/soc-automation --title "Automated Alert Triage"');
  process.exit(1);
}

const slug = slugify(args.title);
const targetDir = path.join(DOCS_DIR, args.path.replace(/\\/g, '/'));
fs.mkdirSync(targetDir, { recursive: true });

const targetFile = path.join(targetDir, `${slug}.md`);
if (fs.existsSync(targetFile) && !args.force) {
  console.error(`Error: File already exists: ${targetFile} (Use --force to overwrite)`);
  process.exit(1);
}

const description = args.description || `Comprehensive guide and analysis for ${args.title}.`;
const dateStr = new Date().toISOString().split('T')[0];

const frontmatter = [
  '---',
  `title: "${args.title.replace(/"/g, '\\"')}"`,
  `description: "${description.replace(/"/g, '\\"')}"`,
  ...(args.tags.length > 0 ? ['tags:', ...args.tags.map((t) => `  - "${t}"`)] : []),
  ...(args.threatLevel ? [`threat_level: "${args.threatLevel}"`] : []),
  `date: ${dateStr}`,
  `draft: ${args.draft ? 'true' : 'false'}`,
  ...(args.order !== null ? ['sidebar:', `  order: ${args.order}`] : []),
  '---',
].join('\n');

const body = `

## Executive Summary

Brief context and background regarding \`${args.title}\`.

---

## Technical Analysis

Detail the architectural components, implementation patterns, and core considerations:

- Key vectors, capabilities, and system components
- Architectural mitigation patterns or operational workflows
- Verification criteria and testing guidelines

---

## Action Items & Next Steps

1. Review configuration parameters and baseline telemetry.
2. Conduct validation tests against target components.
3. Update operational runbooks and team documentation.
`;

fs.writeFileSync(targetFile, `${frontmatter}\n${body}`, 'utf8');

console.log(`Successfully created article:`);
console.log(`  File:   ${targetFile}`);
console.log(`  Path:   src/content/docs/${args.path.replace(/\\/g, '/')}/${slug}.md`);
console.log(`  Title:  ${args.title}`);
console.log(`  Slug:   ${slug}`);
