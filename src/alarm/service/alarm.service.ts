import { Injectable, NotFoundException } from '@nestjs/common';
import { AlarmDocument } from '../models/alarm.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Alarm } from '../models/alarm.schema';
import { Model } from 'mongoose';

@Injectable()
export class AlarmService {
  constructor(
    @InjectModel(Alarm.name) private alarmModel: Model<AlarmDocument>,
  ) {}

  async createAlarm(alarm: Alarm): Promise<Alarm> {
    return this.alarmModel.create(alarm);
  }

  async getAlarms(): Promise<Alarm[]> {
    return this.alarmModel.find();
  }

  async getAlarmById(id: string): Promise<Alarm> {
    const alarm = await this.alarmModel.findById(id);
    if (!alarm) {
      throw new NotFoundException('Alarm not found');
    }
    return alarm;
  }

  async updateAlarm(id: string, alarm: Alarm): Promise<Alarm> {
    const updatedAlarm = await this.alarmModel.findByIdAndUpdate(id, alarm, {
      new: true,
    });
    if (!updatedAlarm) {
      throw new NotFoundException('Alarm not found');
    }
    return updatedAlarm;
  }

  async deleteAlarm(id: string): Promise<Alarm> {
    const alarm = await this.alarmModel.findById(id);
    if (!alarm) {
      throw new NotFoundException('Alarm not found');
    }
    const deletedAlarm = await this.alarmModel.findByIdAndDelete(id);
    if (!deletedAlarm) {
      throw new NotFoundException('Alarm not found');
    }
    return deletedAlarm;
  }
}
