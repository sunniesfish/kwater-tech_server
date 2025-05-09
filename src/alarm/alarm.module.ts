import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlarmService } from './service/alarm.service';
import { Alarm, AlarmSchema } from './models/alarm.schema';
import { AlarmController } from './controllers/alarm.controller';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Alarm.name, schema: AlarmSchema }]),
  ],
  controllers: [AlarmController],
  providers: [AlarmService],
})
export class AlarmModule {}
