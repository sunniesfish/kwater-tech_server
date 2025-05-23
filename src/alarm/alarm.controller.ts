import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Division } from 'src/global/types';
import { OnEvent } from '@nestjs/event-emitter';
import { Alarm } from './schemas/alarm.schema';

@Controller('alarms')
@UseGuards(JwtAuthGuard)
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @Get(':division')
  async findAll(@Param('division') division: Division) {
    return this.alarmService.findAll(division);
  }

  @Get(':division/:alarmId')
  async findOne(
    @Param('division') division: Division,
    @Param('alarmId') alarmId: string,
  ) {
    return this.alarmService.findOne(division, alarmId);
  }

  @Post(':division')
  async create(
    @Param('division') division: Division,
    @Body() createAlarmDto: CreateAlarmDto,
  ) {
    return this.alarmService.create(division, createAlarmDto);
  }

  @Delete(':division/:alarmId')
  async remove(
    @Param('division') division: Division,
    @Param('alarmId') alarmId: string,
  ) {
    return this.alarmService.remove(division, alarmId);
  }

  @OnEvent('alarm.created')
  async handleAlarmCreated(alarm: Alarm) {
    console.log('Alarm created:', alarm);
  }

  @OnEvent('alarm.deleted')
  async handleAlarmDeleted(alarmId: string) {
    console.log('Alarm deleted:', alarmId);
  }
}
