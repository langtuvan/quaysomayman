import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { PageDocument } from './item.schema';
import { Category } from './category.schema';

@Schema({ timestamps: true })
export class SubCategory extends PageDocument {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Category;

  @Prop({ required: false, default: false })
  isMenu: boolean;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
