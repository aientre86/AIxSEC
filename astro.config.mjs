import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

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
      sidebar: [
        {
          label: 'Overview & Framework',
          slug: 'index',
        },
        {
          label: 'OG - Oversight & Governance',
          collapsed: false,
          autogenerate: { directory: '01-og' },
        },
        {
          label: 'DD - Design & Development',
          collapsed: false,
          autogenerate: { directory: '02-dd' },
        },
        {
          label: 'IO - Implementation & Operation',
          collapsed: false,
          autogenerate: { directory: '03-io' },
        },
        {
          label: 'PD - Protection & Defense',
          collapsed: false,
          autogenerate: { directory: '04-pd' },
        },
        {
          label: 'IN - Investigation',
          collapsed: false,
          autogenerate: { directory: '05-in' },
        },
      ],
      customCss: [],
    }),
  ],
});
