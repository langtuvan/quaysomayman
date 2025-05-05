import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Fortune } from './fortuneSchema';
import { Role } from './role.schema';
import { Exclude, Type } from 'class-transformer';

import { Document } from 'mongoose';
import { Transform } from 'class-transformer';

// export type AddressDocument = Address & Document;

@Schema()
export class Address extends Document {
  // @Transform(({ value }) => value.toString())
  // _id: string;

  @Prop()
  city: string;

  @Prop()
  street: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

// // export type UserDocument = User & Document;
// export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  avatarSrc: string;

  // @Prop({ required: true, unique: true })
  @Prop({ required: false, unique: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop({ required: false, default: false })
  confirmEmail: boolean;

  @Prop({ required: false, default: false })
  confirmPhone: boolean;

  @Prop({ required: false })
  isAdmin: boolean;

  @Prop()
  @Exclude()
  password?: string; // Optional for users authenticated via SSO

  @Prop({ required: false })
  provider: string; // 'google', 'facebook', etc.

  @Prop({ required: false })
  providerId: string; // External provider ID (e.g., Google user ID)

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }] })
  roles: Role[];

  //others
  @Prop({ type: AddressSchema })
  @Type(() => Address)
  address?: Address;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false, default: null })
  createdBy: User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false, default: null })
  updatedBy: User;

  @Prop({ required: false, default: [] })
  fortunes: Fortune[];
}

export const UserSchema = SchemaFactory.createForClass(User);
