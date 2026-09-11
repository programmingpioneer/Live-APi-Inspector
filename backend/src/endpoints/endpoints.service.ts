import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export interface EndpointRecord {
  slug: string;
  createdAt: string;
  requestCount: number;
}

/**
 * EndpointsService
 * ----------------
 * Slug generation + persistence.
 * Endpoints JSON file mein save hote hain — backend restart pe bhi zinda rehte hain.
 */
@Injectable()
export class EndpointsService implements OnModuleInit {
  private readonly logger = new Logger(EndpointsService.name);
  private readonly endpoints = new Map<string, EndpointRecord>();
  private readonly dataDir = join(process.cwd(), '.devtoll-data');
  private readonly filePath = join(this.dataDir, 'endpoints.json');

  /** Backend start hone pe disk se load karo. */
  onModuleInit(): void {
    this.load();
  }

  private load(): void {
    try {
      if (!existsSync(this.filePath)) {
        this.logger.log('No persisted endpoints — starting fresh');
        return;
      }
      const raw = readFileSync(this.filePath, 'utf8');
      const list = JSON.parse(raw) as EndpointRecord[];
      if (!Array.isArray(list)) return;
      for (const rec of list) {
        if (rec?.slug) this.endpoints.set(rec.slug, rec);
      }
      this.logger.log(`Loaded ${this.endpoints.size} endpoints from disk`);
    } catch (e) {
      this.logger.warn(`Failed to load endpoints: ${(e as Error).message}`);
    }
  }

  private save(): void {
    try {
      if (!existsSync(this.dataDir)) {
        mkdirSync(this.dataDir, { recursive: true });
      }
      const list = Array.from(this.endpoints.values());
      writeFileSync(this.filePath, JSON.stringify(list, null, 2), 'utf8');
    } catch (e) {
      this.logger.warn(`Failed to persist endpoints: ${(e as Error).message}`);
    }
  }

  /** Unique slug generate karo (crypto random, collision-resistant). */
  generate(prefix?: string): EndpointRecord {
    const raw = randomBytes(6).toString('hex'); // 12 hex chars
    const slug = prefix ? `${prefix}-${raw}` : raw;

    const record: EndpointRecord = {
      slug,
      createdAt: new Date().toISOString(),
      requestCount: 0,
    };

    this.endpoints.set(slug, record);
    this.save();
    return record;
  }

  /** Endpoint dhundo by slug. */
  find(slug: string): EndpointRecord | undefined {
    return this.endpoints.get(slug);
  }

  /**
   * Alias for `find(slug) !== undefined`.
   * Used by ingest.controller to decide 404 vs 200.
   */
  exists(slug: string): boolean {
    return this.endpoints.has(slug);
  }

  /** Saare endpoints ki list. */
  listAll(): EndpointRecord[] {
    return Array.from(this.endpoints.values());
  }

  /**
   * Request aane pe counter badhao.
   * Alias: `incrementRequestCount` (used by ingest.controller).
   */
  incrementCount(slug: string): void {
    const ep = this.endpoints.get(slug);
    if (ep) {
      ep.requestCount += 1;
      this.save();
    }
  }

  /** Alias for `incrementCount` — matched to ingest.controller's expected name. */
  incrementRequestCount(slug: string): void {
    this.incrementCount(slug);
  }
}