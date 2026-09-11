import { Injectable } from '@nestjs/common';
import { PersistenceService } from '../persistence/persistence.service';
import { randomUUID } from 'node:crypto';
import type { CapturedRequest } from '../ingest/types';

export interface ReplayResult {
  id: string;
  requestId: string;
  targetUrl: string;
  status: number;
  statusText: string;
  timestamp: string;
}

/**
 * ReplayService
 * -------------
 * Captured request ko target URL par dobara bhejta hai.
 * SSRF protection: internal/localhost URLs block (replay.schema me).
 */
@Injectable()
export class ReplayService {
  constructor(private readonly persistence: PersistenceService) {}

  async replay(requestId: string, targetUrl: string): Promise<ReplayResult> {
    // Captured request dhoondo
    const all = await this.findRequest(requestId);
    if (!all) {
      throw new Error('Captured request not found');
    }

    const headers = this.sanitizeHeaders(all.headers);

    const response = await fetch(targetUrl, {
      method: all.method,
      headers,
      body: this.shouldHaveBody(all.method, all.bodyRaw)
        ? all.bodyRaw
        : undefined,
    });

    return {
      id: randomUUID(),
      requestId: all.id,
      targetUrl,
      status: response.status,
      statusText: response.statusText,
      timestamp: new Date().toISOString(),
    };
  }

  /** Request ID se captured request dhoondo (saare slugs scan karo). */
  private async findRequest(requestId: string): Promise<CapturedRequest | null> {
    const slugs = await this.persistence.getAllSlugs();
    for (const slug of slugs) {
      const recent = await this.persistence.getRecent(slug, 100);
      const found = recent.find((r) => r.id === requestId);
      if (found) return found;
    }
    return null;
  }

  /** Hop-by-hop headers ko replay ke liye sanitize karo. */
  private sanitizeHeaders(
    headers: Record<string, string | string[] | undefined>,
  ): Record<string, string> {
    const blocked = new Set([
      'host',
      'content-length',
      'connection',
      'transfer-encoding',
      'upgrade',
      'expect',
      'proxy-authorization',
    ]);

    const cleaned: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (blocked.has(key.toLowerCase())) continue;
      if (value === undefined) continue;
      cleaned[key] = Array.isArray(value) ? value.join(', ') : value;
    }
    return cleaned;
  }

  /** GET/HEAD me body nahi bhejte (fetch spec violation). */
  private shouldHaveBody(method: string, bodyRaw: string | null): boolean {
    if (bodyRaw === null || bodyRaw === undefined) return false;
    return !['GET', 'HEAD'].includes(method.toUpperCase());
  }
}