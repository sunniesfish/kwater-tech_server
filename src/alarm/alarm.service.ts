import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alarm } from './schemas/alarm.schema';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { v4 as uuidv4 } from 'uuid';
import { Division } from '../global/types';

@Injectable()
export class AlarmService {
  constructor(
    @InjectModel(Alarm.name) private readonly alarmModel: Model<Alarm>,
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
    return createdAlarm.save();
  }

  async remove(division: Division, alarmId: string): Promise<void> {
    const result = await this.alarmModel
      .deleteOne({ id: alarmId, division })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Alarm with id ${alarmId} not found`);
    }
  }
}
