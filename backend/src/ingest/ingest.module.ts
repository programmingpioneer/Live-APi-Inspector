import { Module } from '@nestjs/common';
import { EndpointsModule } from '../endpoints/endpoints.module';
import { GatewayModule } from '../gateway/gateway.module';
import { PersistenceModule } from '../persistence/persistence.module';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';

@Module({
  imports: [EndpointsModule, PersistenceModule, GatewayModule],
  controllers: [IngestController],
  providers: [IngestService],
})
export class IngestModule {}
