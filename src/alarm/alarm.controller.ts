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

@Controller('alarms')
@UseGuards(JwtAuthGuard)
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @Get(':division')
  async findAll(@Param('division') division: Division) {
    return this.alarmService.findAll(division);
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
}
