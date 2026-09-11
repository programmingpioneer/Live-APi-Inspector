import { Module } from '@nestjs/common';
import { EndpointsModule } from './endpoints/endpoints.module';
import { GatewayModule } from './gateway/gateway.module';
import { IngestModule } from './ingest/ingest.module';
import { PersistenceModule } from './persistence/persistence.module';
import { ReplayModule } from './replay/replay.module';

@Module({
  imports: [
    EndpointsModule,
    PersistenceModule,
    GatewayModule,
    IngestModule,
    ReplayModule,
  ],
})
export class AppModule {}
