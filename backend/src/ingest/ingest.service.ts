import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PersistenceService } from '../persistence/persistence.service';
import { InspectorGateway } from '../gateway/gateway.gateway';
import type { CapturedRequest } from './types';

interface CaptureInput {
  slug: string;
  method: string;
  path: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, unknown>;
  body: unknown;
  ip: string | null;
  httpVersion: string;
}

/**
 * IngestService
 * -------------
 * HTTP capture → persist → broadcast. Ye teeno steps alag rakhe gaye hain
 * taake koi bhi layer independently evolve ho sake.
 */
@Injectable()
export class IngestService {
  constructor(
    private readonly persistence: PersistenceService,
    private readonly gateway: InspectorGateway,
  ) {}

  async capture(input: CaptureInput): Promise<CapturedRequest> {
    // Raw body ko stringify karke preserve karo — malformed JSON bhi safe rahe
    let bodyRaw: string | null = null;
    try {
      bodyRaw =
        input.body === undefined || input.body === null
          ? null
          : JSON.stringify(input.body);
    } catch {
      bodyRaw = '<unparseable-body>';
    }

    const captured: CapturedRequest = {
      id: randomUUID(),
      slug: input.slug,
      method: input.method,
      path: input.path,
      headers: input.headers,
      query: input.query,
      body: input.body ?? null,
      bodyRaw,
      ip: input.ip,
      httpVersion: input.httpVersion,
      timestamp: new Date().toISOString(),
    };

    // 1. Persist (fire-and-forget nahi — store ho jaye phir emit karo)
    await this.persistence.save(input.slug, captured);

    // 2. Real-time broadcast to room:slug
    this.gateway.emitCapture(input.slug, captured);

    return captured;
  }
}
