import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alarm } from './schemas/alarm.schema';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { v4 as uuidv4 } from 'uuid';
import { Division } from '../global/types';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class AlarmService {
  constructor(
    @InjectModel(Alarm.name) private readonly alarmModel: Model<Alarm>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(division: Division): Promise<Alarm[]> {
    return this.alarmModel.find({ division }).exec();
  }

  async create(
    division: Division,
    createAlarmDto: CreateAlarmDto,
  ): Promise<Alarm> {
    const createdAlarm = new this.alarmModel({
      ...createAlarmDto,
      id: uuidv4(),
      division,
    });

    const savedAlarm = await createdAlarm.save();

    this.eventEmitter.emit('alarm.created', savedAlarm);

    return savedAlarm;
  }

  async findOne(division: Division, alarmId: string): Promise<Alarm> {
    const alarm = await this.alarmModel
      .findOne({ id: alarmId, division })
      .exec();
    if (!alarm) {
      throw new NotFoundException(`Alarm with id ${alarmId} not found`);
    }
    return alarm;
  }

  async remove(division: Division, alarmId: string): Promise<void> {
    const result = await this.alarmModel
      .deleteOne({ id: alarmId, division })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Alarm with id ${alarmId} not found`);
    }
    this.eventEmitter.emit('alarm.deleted', alarmId);
  }
}
