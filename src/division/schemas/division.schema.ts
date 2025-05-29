import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Division extends Document {
  @Prop({ required: true })
  divisionId: string;

  @Prop({ required: true })
  divisionName: string;
}

export const DivisionSchema = SchemaFactory.createForClass(Division);
