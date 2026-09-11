import { All, Controller, Get, Param, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { EndpointsService } from '../endpoints/endpoints.service';
import { IngestService } from './ingest.service';
import { PersistenceService } from '../persistence/persistence.service';
import type { CapturedRequest } from './types';

/**
 * IngestController
 * ----------------
 * Wildcard route: @All(':slug') matlab GET, POST, PUT, DELETE, PATCH
 * — HAR method capture hota hai, kyunki webhook inspector ka yahi purpose hai.
 */
@Controller('api/v1/inspect')
export class IngestController {
  constructor(
    private readonly ingestService: IngestService,
    private readonly endpointsService: EndpointsService,
    private readonly persistenceService: PersistenceService,
  ) {}

  @All(':slug')
  async capture(
    @Param('slug') slug: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    // Endpoint exist nahi karta? 404 — taake random slug spam na ho
    if (!this.endpointsService.exists(slug)) {
      res.status(404).json({ error: 'Unknown endpoint slug' });
      return;
    }

    // Counter increment (request count tracking)
    this.endpointsService.incrementRequestCount(slug);

    const captured = await this.ingestService.capture({
      slug,
      method: req.method,
      path: req.path,
      headers: req.headers as Record<string, string | string[] | undefined>,
      query: (req.query ?? {}) as Record<string, unknown>,
      body: (req as Request & { body?: unknown }).body ?? null,
      ip: req.ip ?? null,
      httpVersion: req.httpVersion,
    });

    // 200 + capture ID — webhook sender ko confirmation
    res.status(200).json({ captured: true, id: captured.id });
  }

  /**
   * GET /api/v1/inspect/:slug/requests
   * Recent captured requests — frontend page load par history fetch karta hai.
   */
  @Get(':slug/requests')
  async listRequests(
    @Param('slug') slug: string,
  ): Promise<CapturedRequest[]> {
    return this.persistenceService.getRecent(slug, 100);
  }
}
