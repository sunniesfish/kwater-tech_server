import { Injectable } from '@nestjs/common';

@Injectable()
export class SSEService {
  private clients = new Map();
}
