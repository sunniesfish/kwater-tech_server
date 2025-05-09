import { Body, Controller, Get, Post } from '@nestjs/common';
import { Alarm } from '../models/alarm.schema';
import { AlarmService } from '../service/alarm.service';

export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @Post()
  async createAlarm(@Body() alarm: Alarm): Promise<Alarm> {
    return this.alarmService.createAlarm(alarm);
  }

  @Get()
  async getAlarms(): Promise<Alarm[]> {
    return this.alarmService.getAlarms();
  }
}
