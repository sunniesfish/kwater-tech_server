import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  password?: string;

  @Prop({ nullable: false })
  affiliation?: string;

  @Prop({ nullable: false, default: false })
  isManager?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
