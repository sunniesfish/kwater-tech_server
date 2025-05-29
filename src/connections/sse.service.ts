import { Injectable, Sse } from '@nestjs/common';
import { Division } from 'src/global/types';
import { Response } from 'express';
import { Alarm } from 'src/alarm/schemas/alarm.schema';

type CientId = string;

interface CreatedPayload {
  alarm: Alarm;
}
interface UpdatedPayload {
  alarm: Alarm;
}
interface DeletedPayload {
  alarmId: string;
}

export type Event =
  | { type: 'CREATED'; payload: CreatedPayload }
  | { type: 'UPDATED'; payload: UpdatedPayload }
  | { type: 'DELETED'; payload: DeletedPayload };

@Injectable()
export class SSEService {
  private divisionClients = new Map<Division, Map<CientId, Response>>();

  addClient(division: Division, clientId: CientId, res: Response) {
    if (!this.divisionClients.has(division)) {
      this.divisionClients.set(division, new Map<CientId, Response>());
    }
    this.divisionClients.get(division)!.set(clientId, res);
  }

  removeClient(division: Division, clientId: CientId) {
    this.divisionClients.get(division)?.delete(clientId);
  }

  sendEventToDivision(division: Division, event: Event) {
    const divisionClients = this.divisionClients.get(division);
    if (!divisionClients) return;
    for (const [_, res] of divisionClients.entries()) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }
  }
}
