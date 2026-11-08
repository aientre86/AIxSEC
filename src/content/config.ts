import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        pillar: z.enum(['OG', 'DD', 'IO', 'PD', 'IN']),
        tags: z.array(z.string()),
        threat_level: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
        date: z.coerce.date(),
        draft: z.boolean().default(false),
      }),
    }),
  }),
};
