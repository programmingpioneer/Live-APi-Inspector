import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { ReplayController } from './replay.controller';
import { ReplayService } from './replay.service';

@Module({
  imports: [PersistenceModule],
  controllers: [ReplayController],
  providers: [ReplayService],
})
export class ReplayModule {}
