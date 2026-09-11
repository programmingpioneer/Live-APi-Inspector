import { z } from 'zod';

/**
 * Slug validation: 4-64 chars, only alphanumeric, dash, underscore.
 * Standard Schema (Zod) — NestJS 12 first-class support.
 */
export const slugSchema = z
  .string()
  .min(4, 'Slug must be at least 4 characters')
  .max(64, 'Slug must be at most 64 characters')
  .regex(/^[a-zA-Z0-9-_]+$/, 'Slug can only contain letters, numbers, dash, underscore');

export const generateEndpointSchema = z.object({
  prefix: z.string().min(2).max(16).regex(/^[a-z0-9-]+$/).optional(),
});

export type GenerateEndpointInput = z.infer<typeof generateEndpointSchema>;
