import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { theme } from './sidebar.mjs';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages base URL compatibility:
  // Replace <username> and <repo-name> with your GitHub username and repository name.
  // If hosted at the root domain (e.g., https://username.github.io), set site accordingly and leave base undefined.
  // If hosted under a repository subpath (e.g., https://username.github.io/ai-security-hub/), set base: '/ai-security-hub/'.
  site: 'https://aientre86.github.io',
  base: '/AIxSEC',
  integrations: [
    starlight({
      title: 'AI&SEC',
      logo: {
        src: './src/assets/logo.svg',
      },
      description: 'Automation, AI for Security, and Security for AI.',
      social: {
        github: 'https://github.com/aientre86/AIxSEC',
      },
      // Sidebar is generated from folders — see sidebar.mjs. Just add .md files / folders.
      sidebar: [
        { label: 'Home', slug: 'index' },
        theme('ai-real-world'),
        theme('ai-for-security'),
        theme('security-for-ai'),
      ],
      customCss: [],
    }),
  ],
});
