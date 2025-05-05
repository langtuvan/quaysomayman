import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { Status } from 'src/enum/status';

// export type TicketDocument = HydratedDocument<Ticket>;

export enum TicketType {
  forgotPassword = 0,
  activeAccount = 1,
}

@Schema({ timestamps: true })
export class Ticket extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  destinationId: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: Status })
  type: number;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  value: string;

  @Prop({
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
  })
  expDate: Date;

  @Prop({ required: false, enum: Status, default: Status.Pending })
  status: Status;

  @Prop({ required: true, default: true })
  canDelete: boolean;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
