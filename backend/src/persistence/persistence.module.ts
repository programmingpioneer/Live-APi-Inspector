import { Module } from '@nestjs/common';
import { PersistenceService } from './persistence.service';

@Module({
  providers: [PersistenceService],
  exports: [PersistenceService],
})
export class PersistenceModule {}