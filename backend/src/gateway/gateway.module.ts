import { Module } from '@nestjs/common';
import { InspectorGateway } from './gateway.gateway';

@Module({
  providers: [InspectorGateway],
  exports: [InspectorGateway],
})
export class GatewayModule {}
