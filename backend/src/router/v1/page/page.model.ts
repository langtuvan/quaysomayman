import { ObjectType, Field, ID } from '@nestjs/graphql';
import { DocumentModel } from 'src/model/document.model';
import { CategoryModel } from '../category/category.model';
import { SubCategoryModel } from '../subCategory/subCategory.model';

@ObjectType()
export class PageModel extends DocumentModel {
  @Field(() => CategoryModel) // Many-to-one relation, post belongs to a user
  category: CategoryModel;

  @Field(() => SubCategoryModel) // Many-to-one relation, post belongs to a user
  subCategory: SubCategoryModel;

}
