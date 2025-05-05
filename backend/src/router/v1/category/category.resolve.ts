import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
// guard pipe
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ObjectIdPipe } from 'src/pipe/object-id.pipe';
import { CurrentUser } from 'src/auth/current-user.decorator';
// service, model, dto

import _ from 'lodash';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceModel } from 'src/type/ConfigService';
import { CategoryModel } from 'src/router/v1/category/category.model';
import { CategoryService } from './category.service';
import { SubCategoryService } from '../subCategory/subCategory.service';
import { SubCategoryModel } from 'src/router/v1/subCategory/subCategory.model';

// others ref

@Resolver(() => CategoryModel)
export class CategoryResolver {
  constructor(
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    //private readonly configService: ConfigService<ConfigServiceModel>,
  ) {}

  @Query((returns) => [CategoryModel])
  async categories() {
    return this.categoryService.find();
  }

  @Query((returns) => CategoryModel)
  @UsePipes(ObjectIdPipe)
  async category(@Args('id') id: string) {
    return this.categoryService.findById(id);
  }

  @ResolveField(() => [SubCategoryModel]) // Resolve the SubCategories field for a Category
  async subCategories(@Parent() category: CategoryModel) {
    const subCategories = await this.subCategoryService.findByCatId(
      category._id,
    );

    return subCategories
 
    // return subCategories.map((subCategory) => ({
    //   ...subCategory,
    //   slug: subCategory.category.slug + subCategory.slug,
    // }));
  }

  //   @ResolveField(() => [Product]) // Resolve the Products field for a Category
  //   async products(@Parent() category: Category) {
  //     return this.productService.findByCatId(category.id);
  //   }
}
