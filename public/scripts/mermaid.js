import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

function getMermaidCode(el) {
  // Starlight's expressive-code wraps lines in <div class="ec-line"><div class="code">...</div></div>
  const lines = el.querySelectorAll('.ec-line .code');
  if (lines.length > 0) {
    return Array.from(lines)
      .map((line) => line.textContent || '')
      .join('\n');
  }
  return el.textContent || '';
}

async function renderMermaidDiagrams() {
  const blocks = document.querySelectorAll(
    'pre.mermaid, pre > code.language-mermaid, div.expressive-code pre[data-language="mermaid"]'
  );

  if (blocks.length === 0) return;

  const isDark = document.documentElement.dataset.theme === 'dark';
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'neutral',
    securityLevel: 'loose',
    fontFamily: 'inherit',
  });

  for (let index = 0; index < blocks.length; index++) {
    const el = blocks[index];
    const parent = el.closest('.expressive-code') || el;
    const code = getMermaidCode(el).trim();

    if (!code) continue;

    const container = document.createElement('div');
    container.className = 'mermaid-rendered';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.margin = '2rem 0';
    container.style.overflowX = 'auto';

    try {
      const id = `mermaid-svg-${Date.now()}-${index}`;
      const { svg } = await mermaid.render(id, code);
      container.innerHTML = svg;
      parent.replaceWith(container);
    } catch (err) {
      console.warn('Mermaid rendering error for block:', err);
    }
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderMermaidDiagrams);
  } else {
    renderMermaidDiagrams();
  }

  document.addEventListener('astro:page-load', renderMermaidDiagrams);
}
