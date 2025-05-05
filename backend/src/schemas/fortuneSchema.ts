// post.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema'; // Assuming User schema is in a different file

// Define Prize interface
export interface Prize {
  // id: string;
  key: number;
  name: string;
  qty: number;
}

// Define Person interface
export interface Person {
  // id?: string;
  manv: string;
  name: string;
}

// Define Winner interface
export interface Winner extends Person {
  prizeId: string;
  prize: string;
}

@Schema({ timestamps: true })
export class Fortune extends Document {
  @Prop({ required: true })
  type: 'random' | 'wheel';

  @Prop({ required: true })
  title: string;

  @Prop({ required: false, default: null })
  description: string;

  @Prop({
    required: false,
    type: [
      {
        manv: { type: String, required: true },
        name: { type: String, required: true },
      },
    ],
    default: [],
  })
  persons: Person[];

  @Prop({
    required: false,
    type: [
      {
        key: { type: Number, required: true },
        name: { type: String, required: true },
        qty: { type: Number, required: true, min: 0 },
      },
    ],
    default: [],
    // validate: [
    //   (val: Prize[]) => val.every((prize) => prize.qty >= 0),
    //   'Quantity must be non-negative',
    // ],
  })
  prizes: Prize[];

  @Prop({
    required: false,
    type: [
      {
        manv: { type: String, required: true },
        name: { type: String, required: true },
        prizeId: { type: String, required: true },
        key: { type: Number, required: true },
        prize: { type: String, required: true },
      },
    ],
    default: [],
  })
  winners: Winner[];

  //

  @Prop({ type: Types.ObjectId, ref: 'User', required: false, default: null })
  createdBy: User;
}

export const FortuneSchema = SchemaFactory.createForClass(Fortune);
