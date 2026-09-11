import { Injectable } from '@nestjs/common';
import type { CapturedRequest } from '../ingest/types';

const MAX_REQUESTS_PER_SLUG = 100;

/**
 * PersistenceService
 * -----------------
 * In-memory request store. Har slug ke liye last 100 requests rakhta hai.
 * Production me isay Redis ya Postgres se replace karo — interface same rahega.
 */
@Injectable()
export class PersistenceService {
  private readonly requests = new Map<string, CapturedRequest[]>();

  async save(slug: string, data: CapturedRequest): Promise<CapturedRequest> {
    const list = this.requests.get(slug) ?? [];

    list.push(data);

    // Memory bound — sabse purana request hatao jab limit cross ho
    while (list.length > MAX_REQUESTS_PER_SLUG) {
      list.shift();
    }

    this.requests.set(slug, list);
    return data;
  }

  async getRecent(slug: string, limit = 20): Promise<CapturedRequest[]> {
    const list = this.requests.get(slug) ?? [];
    return list.slice(-limit).reverse(); // newest first
  }

  async count(slug: string): Promise<number> {
    return this.requests.get(slug)?.length ?? 0;
  }

  /** Saare registered slugs ki list — ReplayService ke liye. */
  async getAllSlugs(): Promise<string[]> {
    return [...this.requests.keys()];
  }
}