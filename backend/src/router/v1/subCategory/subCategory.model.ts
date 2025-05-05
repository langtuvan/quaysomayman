import { ObjectType, Field, ID } from '@nestjs/graphql';
import { DocumentModel } from '../../../model/document.model';
import { CategoryModel } from '../category/category.model';

@ObjectType()
export class SubCategoryModel extends DocumentModel {
  @Field({ nullable: true, defaultValue: false })
  isMenu: boolean;

  @Field(() => CategoryModel) // Many-to-one relation, post belongs to a user
  category: CategoryModel;
}
