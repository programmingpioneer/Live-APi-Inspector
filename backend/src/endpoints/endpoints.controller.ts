import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { EndpointsService, type EndpointRecord } from './endpoints.service';
import {
  generateEndpointSchema,
  type GenerateEndpointInput,
} from './endpoints.schema';

@Controller('api/v1/endpoints')
export class EndpointsController {
  constructor(private readonly endpointsService: EndpointsService) {}

  /**
   * POST /api/v1/endpoints
   * Body: { prefix?: string }
   * Response: { slug, createdAt, requestCount }
   *
   * Uses safeParse so Zod validation errors become 400 Bad Request
   * (not an unhandled 500).
   */
  @Post()
  createEndpoint(@Body() rawBody: unknown): EndpointRecord {
    const parsed = generateEndpointSchema.safeParse(rawBody ?? {});

    if (!parsed.success) {
      throw new BadRequestException({
        error: 'Invalid endpoint request',
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const input = parsed.data as GenerateEndpointInput;
    return this.endpointsService.generate(input.prefix);
  }

  /**
   * GET /api/v1/endpoints
   * Response: EndpointRecord[]
   */
  @Get()
  listEndpoints(): EndpointRecord[] {
    return this.endpointsService.listAll();
  }
}
