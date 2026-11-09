// Builds a nested Starlight sidebar from the folder structure under src/content/docs.
//
// - Every folder becomes a (collapsible) group; nesting depth is unlimited.
// - Optional `_meta.yml` in a folder customises the group:
//       label: Threat Detection   # display name (default: title-cased folder name)
//       order: 1                  # position among sibling folders (default: 999, then alphabetical)
//       collapsed: true           # start collapsed (default: true for nested, false for themes)
// - Pages are ordered by frontmatter `sidebar: { order: N }`, then by title.
// - A folder's `index.md` is shown first as "Overview".
import fs from 'node:fs';
import path from 'node:path';

const DOCS = path.resolve('src/content/docs');

const titleCase = (s) =>
  s.replace(/^\d+[-_]/, '').split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

function readMeta(dir) {
  const file = path.join(dir, '_meta.yml');
  const meta = {};
  if (!fs.existsSync(file)) return meta;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(\w+)\s*:\s*(.*?)\s*$/);
    if (!m || m[2].startsWith('#')) continue;
    let v = m[2].replace(/\s+#.*$/, '').replace(/^["']|["']$/g, '');
    if (v === 'true' || v === 'false') v = v === 'true';
    else if (/^-?\d+$/.test(v)) v = Number(v);
    meta[m[1]] = v;
  }
  return meta;
}

function readPage(file) {
  const src = fs.readFileSync(file, 'utf8');
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  if (/^draft:\s*true/m.test(fm)) return null;
  const title = fm.match(/^title:\s*["']?(.*?)["']?\s*$/m)?.[1] ?? path.basename(file);
  const order = Number(fm.match(/^sidebar:[\s\S]*?^\s+order:\s*(-?\d+)/m)?.[1] ?? 999);
  return { title, order };
}

const toSlug = (abs) =>
  path.relative(DOCS, abs).replace(/\\/g, '/').replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');

function buildGroup(dir, { collapsed = true } = {}) {
  const meta = readMeta(dir);
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const pages = entries
    .filter((e) => e.isFile() && /\.mdx?$/.test(e.name) && !/^index\.mdx?$/.test(e.name))
    .map((e) => ({ abs: path.join(dir, e.name), ...readPage(path.join(dir, e.name)) }))
    .filter((p) => p.title)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    .map((p) => ({ slug: toSlug(p.abs) }));

  const groups = entries
    .filter((e) => e.isDirectory())
    .map((e) => buildGroup(path.join(dir, e.name)))
    .filter(Boolean)
    .sort((a, b) => a._order - b._order || a.label.localeCompare(b.label))
    .map(({ _order, ...g }) => g);

  const index = entries.find((e) => /^index\.mdx?$/.test(e.name));
  const items = [
    ...(index ? [{ label: 'Overview', slug: toSlug(path.join(dir, index.name)) }] : []),
    ...pages,
    ...groups,
  ];
  if (!items.length) return null; // hide empty folders

  return {
    label: meta.label ?? titleCase(path.basename(dir)),
    collapsed: meta.collapsed ?? collapsed,
    items,
    _order: meta.order ?? 999,
  };
}

/** Build a top-level sidebar group for a theme folder. */
export function theme(folder) {
  const g = buildGroup(path.join(DOCS, folder), { collapsed: false });
  if (!g) return { label: titleCase(folder), items: [] };
  const { _order, ...rest } = g;
  return rest;
}
