import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ReplayService, type ReplayResult } from './replay.service';
import { replaySchema } from './replay.schema';

/**
 * ReplayController
 * ----------------
 * Frontend se replay request aati hai: { targetUrl, requestId }
 * Standard Schema (Zod) validation ke saath.
 */
@Controller('api/v1/replay')
export class ReplayController {
  constructor(private readonly replayService: ReplayService) {}

  @Post()
  async replay(@Body() rawBody: unknown): Promise<ReplayResult> {
    const parsed = replaySchema.safeParse(rawBody);

    if (!parsed.success) {
      throw new HttpException(
        {
          error: 'Validation failed',
          details: parsed.error.flatten(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.replayService.replay(
        parsed.data.requestId,
        parsed.data.targetUrl,
      );
    } catch (error) {
      throw new HttpException(
        {
          error: 'Replay failed',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
