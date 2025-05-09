import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Day } from '../constants/enums';

export type AlarmDocument = Alarm & Document;

@Schema({ timestamps: false })
export class Alarm {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, type: [String], enum: Day })
  day: Day[];

  @Prop({ required: true })
  hour: number;

  @Prop({ required: true })
  minute: number;

  @Prop({ required: true })
  repeat: boolean;

  @Prop()
  lastTriggered?: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  musicId: string;
}

export const AlarmSchema = SchemaFactory.createForClass(Alarm);
