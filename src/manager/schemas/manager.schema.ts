import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Manager extends Document {
  @Prop({ required: true, unique: true })
  managerId: string;

  @Prop({ required: true })
  managerName: string;

  @Prop({ required: true })
  password: string;
}

export const ManagerSchema = SchemaFactory.createForClass(Manager);
