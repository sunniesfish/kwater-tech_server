import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Division } from 'src/global/types';

@Schema()
export class Connections extends Document {
  @Prop({ required: true, unique: true })
  clientId: string;

  @Prop({ required: true })
  divisionId: Division;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  lastSeen: Date;
}

export const ConnectionsSchema = SchemaFactory.createForClass(Connections);
