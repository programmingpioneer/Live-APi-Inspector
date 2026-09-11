import { z } from 'zod';

/**
 * Replay validation — target URL HTTPS/HTTP hona chahiye.
 * Internal URLs (localhost, 127.0.0.1, 169.254.x.x) block karo
 * taake SSRF attack ka risk na ho.
 */
export const replaySchema = z.object({
  targetUrl: z
    .string()
    .url('Target must be a valid URL')
    .refine((url) => {
      const parsed = new URL(url);
      const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
      return !blockedHosts.includes(parsed.hostname);
    }, 'Target URL cannot point to internal/localhost'),
  requestId: z.string().uuid(),
});

export type ReplayInput = z.infer<typeof replaySchema>;
