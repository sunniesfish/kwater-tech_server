import { Controller, Sse, Param, Query, Res } from '@nestjs/common';
import { SSEService } from './sse.service';
import { Division } from 'src/global/types';
import { Response } from 'express';
@Controller('sse')
export class SSEGatewayController {
  constructor(private readonly sseService: SSEService) {}

  @Sse('subscribe/:division')
  sse(
    @Param('division') division: Division,
    @Query('clientId') clientId: string,
    @Res() res: Response,
  ) {
    return this.sseService.addClient(division, clientId, res);
  }
}
