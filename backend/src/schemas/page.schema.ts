import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Category } from './category.schema';
import { SubCategory } from './subCategory.schema';
import { User } from './user.schema';
import { PageDocument } from './item.schema';


//

@Schema({ timestamps: true })
export class Page extends PageDocument {
  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Category;

  @Prop({ type: Types.ObjectId, ref: 'SubCategory', required: true })
  subCategory: SubCategory;
}

export const PageSchema = SchemaFactory.createForClass(Page);
