import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Division } from '../../global/types';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  divisionId: Division;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
