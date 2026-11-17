import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

function renderMermaidDiagrams() {
  // Find all code blocks generated from ```mermaid
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

  blocks.forEach(async (el, index) => {
    const parent = el.closest('.expressive-code') || el;
    const code = el.textContent || '';
    const container = document.createElement('div');
    container.className = 'mermaid-rendered';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.margin = '1.5rem 0';
    container.style.overflowX = 'auto';

    try {
      const { svg } = await mermaid.render(`mermaid-${Date.now()}-${index}`, code);
      container.innerHTML = svg;
      parent.replaceWith(container);
    } catch (err) {
      console.warn('Mermaid rendering error:', err);
    }
  });
}

// Run on initial page load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderMermaidDiagrams);
  } else {
    renderMermaidDiagrams();
  }

  // Re-run if Starlight navigates using client-side routing
  document.addEventListener('astro:page-load', renderMermaidDiagrams);
}
