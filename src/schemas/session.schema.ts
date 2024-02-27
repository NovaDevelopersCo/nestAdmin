import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Session {
  @Prop({ required: true, ref: 'User' })
  user: string;

  @Prop({ required: true })
  refreshToken: string;
}

export type SessionDocument = Session & Document;
export const SessionSchema = SchemaFactory.createForClass(Session);
export const SessionModel = mongoose.model<SessionDocument>(
  'Session',
  SessionSchema,
);
