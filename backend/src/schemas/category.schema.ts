import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PageDocument } from './item.schema';

@Schema({
  timestamps: true,
  // toJSON: { virtuals: true },
  // toObject: { virtuals: true },
})
export class Category extends PageDocument {
  @Prop({ required: false, default: false })
  isMenu: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// CategorySchema.virtual('subCategories', {
//   ref: 'SubCategory',
//   localField: '_id',
//   foreignField: 'category',
//   justOne: false,
//   //match: { archived: false }, // match option with basic query selector
//   //count: true
// });

// aggregate
// Aggregation to get authors and their books
