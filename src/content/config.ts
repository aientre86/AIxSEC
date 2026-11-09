import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        tags: z.array(z.string()).default([]),
        threat_level: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
        date: z.coerce.date().optional(),
        draft: z.boolean().default(false),
      }),
    }),
  }),
};
