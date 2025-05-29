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
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('alarms')
@Controller('alarms')
@UseGuards(JwtAuthGuard)
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @Get(':division')
  @ApiOperation({ summary: '알림 목록 조회' })
  @ApiOkResponse({
    description: '알림 목록 조회 성공',
    type: [Alarm],
  })
  @ApiBadRequestResponse({
    description: '알림 목록 조회 실패',
  })
  async findAll(@Param('division') division: Division) {
    return this.alarmService.findAll(division);
  }

  @Get(':division/:alarmId')
  @ApiOperation({ summary: '알림 상세 조회' })
  @ApiOkResponse({
    description: '알림 상세 조회 성공',
    type: Alarm,
  })
  @ApiBadRequestResponse({
    description: '알림 상세 조회 실패',
  })
  async findOne(
    @Param('division') division: Division,
    @Param('alarmId') alarmId: string,
  ) {
    return this.alarmService.findOne(division, alarmId);
  }

  @Post(':division')
  @ApiOperation({ summary: '알림 생성' })
  @ApiOkResponse({
    description: '알림 생성 성공',
    type: Alarm,
  })
  @ApiBadRequestResponse({
    description: '알림 생성 실패',
  })
  async create(
    @Param('division') division: Division,
    @Body() createAlarmDto: CreateAlarmDto,
  ) {
    return this.alarmService.create(division, createAlarmDto);
  }

  //수정 필요
  @Delete(':division/:alarmId')
  @ApiOperation({ summary: '알림 삭제' })
  @ApiOkResponse({
    description: '알림 삭제 성공',
    type: Boolean,
  })
  @ApiBadRequestResponse({
    description: '알림 삭제 실패',
  })
  async remove(
    @Param('division') division: Division,
    @Param('alarmId') alarmId: string,
  ): Promise<boolean> {
    await this.alarmService.remove(division, alarmId);
    return true;
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
