import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Category } from './category.schema';
import { SubCategory } from './subCategory.schema';
import { User } from './user.schema';

export class PageDocument extends Document {
  @Prop({ required: true })
  displayName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  content: string;

  @Prop({ required: false })
  imageSrc: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: false, default: true })
  canDelete: boolean;

  @Prop({ required: false, default: false })
  status: boolean;

  @Prop({ required: false, default: false })
  isProtect: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false, default: null })
  createdBy: User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false, default: null })
  updatedBy: User;
}
