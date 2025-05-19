import { Module } from '@nestjs/common';
import { SSEService } from './sse.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SSEService],
  exports: [SSEService],
})
export class ConnectionModule {}
