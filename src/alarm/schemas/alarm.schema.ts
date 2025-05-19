import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Day, Division } from '../../global/types';

@Schema()
export class Alarm extends Document {
  @Prop({ required: true })
  declare id: string;

  @Prop({ required: true, enum: Day })
  day: Day;

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

  @Prop({ required: true })
  division: Division;
}

export const AlarmSchema = SchemaFactory.createForClass(Alarm);
