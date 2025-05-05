import { ObjectType, Field, ID } from '@nestjs/graphql';

import { DocumentModel } from '../../../model/document.model';

@ObjectType()
export class CategoryModel extends DocumentModel {
  @Field({ nullable: true, defaultValue: false })
  isMenu: boolean;


  // @Field(() => [SubCategoryModel], { nullable: true, defaultValue: [] })
  // subCategories: SubCategoryModel[];
  // @Field(() => [PageModel], { nullable: true, defaultValue: [] })
  // pages: PageModel[];
}
